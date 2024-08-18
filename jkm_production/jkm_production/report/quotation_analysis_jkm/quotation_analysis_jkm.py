# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt


from collections import defaultdict

import frappe
from frappe import _
from frappe.utils import cint, flt

from erpnext.setup.utils import get_exchange_rate


def execute(filters=None):
    if not filters:
        return [], []

    columns = get_columns(filters)
    supplier_quotation_data = get_data(filters)

    data, chart_data = prepare_data(supplier_quotation_data, filters)
    message = get_message()

    return columns, data, message, chart_data


def get_data(filters):
    condition = ''
    if filters.get("item_code"):
        condition += f" and sq_item.item_code = '{filters.get('item_code')}'"
    
    if filters.get('supplier_quotation'):
        condition += " and sq_item.parent in {} ".format(
                "(" + ", ".join([f'"{l}"' for l in filters.get("supplier_quotation")]) + ")")

    if filters.get("request_for_quotation"):
        condition += f" and sq_item.request_for_quotation = '{filters.get('request_for_quotation')}'"

    if filters.get("supplier"):
        condition += " and sq.supplier in {} ".format(
                "(" + ", ".join([f'"{l}"' for l in filters.get("supplier")]) + ")")

    if not filters.get("include_expired"):
        condition += f" and sq.status != 'Expired'"

    if filters.get('from_date'):
        condition += f" and sq.transaction_date >= '{filters.get('from_date')}'"
    if filters.get('to_date'):
        condition += f" and sq.transaction_date <= '{filters.get('to_date')}'"

    supplier_quotation_data = frappe.db.sql(f"""
        Select sq_item.parent,
            sq_item.item_code,
            sq_item.qty,
            sq.currency,
            sq_item.stock_qty,
            sq.custom_transporter,
            sq.custom_pickup_from,
            sq.custom_port_of_loading,
            sq.custom_port_of_discharge,
            sq.custom_total_fob_value,
            sq.custom_total_amount_e,
            sq.custom_total_cif_value,
            sq.custom_total_packing_charges,
            sq.custom_total_transportation_expenses,
            sq_item.amount,
            sq.workflow_state,
            sq_item.base_rate,
            sq_item.base_amount,
            sq.custom_payment_terms_template,
            sq.price_list_currency,
            sq_item.uom,
            sq_item.custom_interest_in_percentage,
            sq_item.custom_interest_,
            sq_item.custom_local_transport_charges,
            sq_item.stock_uom,
            sq_item.custom_cif_charges as per_qty_custom_cif_charges,
            sq_item.custom_total_cif_value as per_qty_custom_total_cif_value,
            sq_item.request_for_quotation,
            sq_item.lead_time_days,
            sq_item.custom_margin,
            sq_item.custom_final_rate,
            sq_item.custom_total_fob_value as per_qty_custom_total_fob_value,
            sq.supplier as supplier_name,
            sq.valid_till
        From `tabSupplier Quotation` as sq
        left Join `tabSupplier Quotation Item` as sq_item ON sq_item.parent = sq.name
        left join `tabRequest for Quotation` as rfq ON rfq.name = sq_item.request_for_quotation
        Where sq_item.docstatus < 2 {condition}
        Order By sq_item.custom_total_cif_value DESC
    """,as_dict=1)


    return supplier_quotation_data


def prepare_data(supplier_quotation_data, filters):
    out, groups, qty_list, suppliers, chart_data = [], [], [], [], []
    group_wise_map = defaultdict(list)
    supplier_qty_price_map = {}

    group_by_field = "supplier_name" if filters.get("group_by") == "Group by Supplier" else "item_code"
    company_currency = frappe.db.get_default("currency")
    float_precision = cint(frappe.db.get_default("float_precision")) or 2

    for data in supplier_quotation_data:
        group = data.get(group_by_field)  # get item or supplier value for this row

        supplier_currency = frappe.db.get_value("Supplier", data.get("supplier_name"), "default_currency")

        if supplier_currency:
            exchange_rate = get_exchange_rate(supplier_currency, company_currency)
        else:
            exchange_rate = 1

        row = {
            "item_code": ""
            if group_by_field == "item_code"
            else data.get("item_code"),  # leave blank if group by field
            "supplier_name": "" if group_by_field == "supplier_name" else data.get("supplier_name"),
            "quotation": data.get("parent"),
            "qty": data.get("qty"),
            "price": flt(data.get("amount") * exchange_rate, float_precision),
            "uom": data.get("uom"),
            "price_list_currency": data.get("price_list_currency"),
            "currency": data.get("currency"),
            "workflow_state":data.get("workflow_state"),
            "custom_transporter":data.get("custom_transporter"),
            "custom_local_transport_charges":data.get("custom_local_transport_charges"),
            "custom_total_amount_e":data.get('custom_total_amount_e'),
            "custom_total_fob_value":data.get('custom_total_fob_value'),
            "per_qty_custom_total_fob_value":data.get('per_qty_custom_total_fob_value'),
            "custom_interest_in_percentage":data.get("custom_interest_in_percentage"),
            "custom_interest_":data.get("custom_interest_"),
            "custom_payment_terms_template":data.get("custom_payment_terms_template"),
            "custom_total_cif_value":data.get("custom_total_cif_value"),
            "custom_pickup_from":data.get("custom_pickup_from"),
            "per_qty_custom_total_cif_value":data.get("per_qty_custom_total_cif_value"),
            "custom_margin":data.get('custom_margin'),
            "custom_final_rate":data.get('custom_final_rate'),
            "per_qty_custom_cif_charges":data.get('per_qty_custom_cif_charges'),
            "custom_total_transportation_expenses":data.get("custom_total_transportation_expenses"),
            "stock_uom": data.get("stock_uom"),
            "base_amount": flt(data.get("base_amount"), float_precision),
            "base_rate": flt(data.get("base_rate"), float_precision),
            "request_for_quotation": data.get("request_for_quotation"),
            "valid_till": data.get("valid_till"),
            "lead_time_days": data.get("lead_time_days"),
        }
        row["price_per_unit"] = flt(row["price"]) / (flt(data.get("stock_qty")) or 1)

        # map for report view of form {'supplier1'/'item1':[{},{},...]}
        group_wise_map[group].append(row)

        # map for chart preparation of the form {'supplier1': {'qty': 'price'}}
        supplier = data.get("supplier_name")
        if filters.get("item_code"):
            if supplier not in supplier_qty_price_map:
                supplier_qty_price_map[supplier] = {}
            supplier_qty_price_map[supplier][row["qty"]] = row["price"]

        groups.append(group)
        suppliers.append(supplier)
        qty_list.append(data.get("qty"))

    groups = list(set(groups))
    suppliers = list(set(suppliers))
    qty_list = list(set(qty_list))

    highlight_min_price = group_by_field == "item_code" or filters.get("item_code")

    # final data format for report view
    for group in groups:
        group_entries = group_wise_map[group]  # all entries pertaining to item/supplier
        group_entries[0].update({group_by_field: group})  # Add item/supplier name in first group row

        if highlight_min_price:
            prices = [group_entry["price_per_unit"] for group_entry in group_entries]
            min_price = min(prices)

        for entry in group_entries:
            if highlight_min_price and entry["price_per_unit"] == min_price:
                entry["min"] = 1
            out.append(entry)

    if filters.get("item_code"):
        # render chart only for one item comparison
        chart_data = prepare_chart_data(suppliers, qty_list, supplier_qty_price_map)

    return out, chart_data


def prepare_chart_data(suppliers, qty_list, supplier_qty_price_map):
    data_points_map = {}
    qty_list.sort()

    # create qty wise values map of the form {'qty1':[value1, value2]}
    for supplier in suppliers:
        entry = supplier_qty_price_map[supplier]
        for qty in qty_list:
            if qty not in data_points_map:
                data_points_map[qty] = []
            if qty in entry:
                data_points_map[qty].append(entry[qty])
            else:
                data_points_map[qty].append(None)

    dataset = []
    currency_symbol = frappe.db.get_value("Currency", frappe.db.get_default("currency"), "symbol")
    for qty in qty_list:
        datapoints = {
            "name": currency_symbol + " (Qty " + str(qty) + " )",
            "values": data_points_map[qty],
        }
        dataset.append(datapoints)

    chart_data = {"data": {"labels": suppliers, "datasets": dataset}, "type": "bar"}

    return chart_data


def get_columns(filters):
    currency = frappe.get_cached_value("Company", filters.get("company"), "default_currency")

    group_by_columns = [
        {
            "fieldname": "supplier_name",
            "label": _("Supplier"),
            "fieldtype": "Link",
            "options": "Supplier",
            "width": 150,
        },
        {
            "fieldname": "item_code",
            "label": _("Item"),
            "fieldtype": "Link",
            "options": "Item",
            "width": 150,
        },
    ]

    columns = [
        {"fieldname": "uom", "label": _("UOM"), "fieldtype": "Link", "options": "UOM", "width": 90},
        {"fieldname": "qty", "label": _("Quantity"), "fieldtype": "Float", "width": 80},
        {
            "fieldname": "currency",
            "label": _("Currency"),
            "fieldtype": "Link",
            "options": "Currency",
            "width": 110,
        },
        {
            "fieldname": "price",
            "label": _("Price"),
            "fieldtype": "Currency",
            "options": "currency",
            "width": 110,
        },
        {
            "fieldname": "stock_uom",
            "label": _("Stock UOM"),
            "fieldtype": "Link",
            "options": "UOM",
            "width": 90,
        },
        {
            "fieldname": "price_per_unit",
            "label": _("Price per Unit (Stock UOM)"),
            "fieldtype": "Currency",
            "options": "currency",
            "width": 120,
        },
        {
            "fieldname": "base_amount",
            "label": _("Price ({0})").format(currency),
            "fieldtype": "Currency",
            "options": "price_list_currency",
            "width": 180,
        },
        {
            "fieldname": "base_rate",
            "label": _("Price Per Unit ({0})").format(currency),
            "fieldtype": "Currency",
            "options": "price_list_currency",
            "width": 180,
        },
        {
            "fieldname" : "custom_transporter",
            "label": "Transporter",
            "fieldtype": "Link",
            "options":"Supplier",
            "width" : 180,
        },
        {
            "fieldname" : "custom_pickup_from",
            "label":"Pickup From",
            "fieldtype":"Data",
            "width":180,
        },
        {
            "fieldname" : "custom_total_transportation_expenses",
            "label": "Total Local Transport Expense",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_local_transport_charges",
            "label": "Per Qty Local Transport Charge",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_interest_in_percentage",
            "label": "Interest In Percentage",
            "fieldtype": "Percentage",
            "width" : 180,
        },
        {
            "fieldname" : "custom_interest_",
            "label": "Interest (RS)",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_total_fob_value",
            "label": "Total FOB Value",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_total_cif_value",
            "label": "Total CIF Value",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_total_amount_e",
            "label": "Total Export Charges",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "per_qty_custom_total_fob_value",
            "label": "Per QTY FOB Value",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "per_qty_custom_cif_charges",
            "label":"CIF Charges",
            "field_type":"Currency",
            "width":180
        },
        {
            "fieldname" : "per_qty_custom_total_cif_value",
            "label": "Per QTY CIF Value",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_margin",
            "label": "Margin",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_final_rate",
            "label": "Final Rate",
            "fieldtype": "Currency",
            "width" : 180,
        },
        {
            "fieldname" : "custom_payment_terms_template",
            "label": "Supplier Payment Terms",
            "fieldtype": "Link",
            "options" : "Payment Term",
            "width" : 180,
        },
        {
            "fieldname" : "workflow_state",
            "label": "Workflow State",
            "fieldtype": "Data",
            "width" : 180,
        },
        {
            "fieldname": "quotation",
            "label": _("Supplier Quotation"),
            "fieldtype": "Link",
            "options": "Supplier Quotation",
            "width": 200,
        },
        {"fieldname": "valid_till", "label": _("Valid Till"), "fieldtype": "Date", "width": 100},
        {
            "fieldname": "lead_time_days",
            "label": _("Lead Time (Days)"),
            "fieldtype": "Int",
            "width": 100,
        },
        {
            "fieldname": "request_for_quotation",
            "label": _("Request for Quotation"),
            "fieldtype": "Link",
            "options": "Request for Quotation",
            "width": 200,
        },
    ]

    if filters.get("group_by") == "Group by Item":
        group_by_columns.reverse()

    columns[0:0] = group_by_columns  # add positioned group by columns to the report
    return columns


def get_message():
    return """<span class="indicator">
        Valid till : &nbsp;&nbsp;
        </span>
        <span class="indicator orange">
        Expires in a week or less
        </span>
        &nbsp;&nbsp;
        <span class="indicator red">
        Expires today / Already Expired
        </span>"""


@frappe.whitelist()
def set_default_supplier(item_code, supplier, company):
    frappe.db.set_value(
        "Item Default",
        {"parent": item_code, "company": company},
        "default_supplier",
        supplier,
    )
