import frappe
import json
from erpnext.stock.doctype.item.item import get_item_defaults
from frappe.model.mapper import get_mapped_doc
from erpnext.stock.doctype.material_request.material_request import set_missing_values, update_item
from frappe.utils import flt




@frappe.whitelist()
def make_purchase_order(source_name, target_doc=None, args=None):
	if args is None:
		args = {}
	if isinstance(args, str):
		args = json.loads(args)

	def postprocess(source, target_doc):
		if frappe.flags.args and frappe.flags.args.default_supplier:
			# items only for given default supplier
			supplier_items = []
			for d in target_doc.items:
				default_supplier = get_item_defaults(d.item_code, target_doc.company).get("default_supplier")
				if frappe.flags.args.default_supplier == default_supplier:
					supplier_items.append(d)
			target_doc.items = supplier_items

		set_missing_values(source, target_doc)

	def select_item(d):
		filtered_items = args.get("filtered_children", [])
		child_filter = d.name in filtered_items if filtered_items else True

		return d.ordered_qty < d.stock_qty and child_filter

	doclist = get_mapped_doc(
		"Material Request",
		source_name,
		{
			"Material Request": {
				"doctype": "Purchase Order",
				"validation": {"docstatus": ["=", 1], "material_request_type": ["=", "Purchase"]},
			},
			"Material Request Item": {
				"doctype": "Purchase Order Item",
				"field_map": [
					["name", "material_request_item"],
					["parent", "material_request"],
					["uom", "stock_uom"],
					["uom", "uom"],
					["sales_order", "sales_order"],
					["sales_order_item", "sales_order_item"],
					["wip_composite_asset", "wip_composite_asset"],
					["supplier_quotation", "supplier_quotation"],
					["supplier_quotation_item","supplier_quotation_item" ]
				],
				"postprocess": update_item,
				"condition": select_item,
			},
		},
		target_doc,
		postprocess,
	)

	doclist.set_onload("load_after_mapping", False)
	return doclist

@frappe.whitelist()
def get_sq_rate(ref):
	rate = frappe.db.get_value("Supplier Quotation Item", ref, "rate")
	return rate


def validate(self, method):
	custom_total_net_weight_exim_ = 0
	custom_gross_weight = 0
	custom_total_cbm = 0
	custom_total_packages = 0
	for row in self.items:
		if flt(row.qty) and flt(row.custom_package):
			row.custom_no_of_package = flt(row.qty) / flt(row.custom_package)
			custom_total_packages += row.custom_no_of_package

		if flt(row.custom_per_package_weight) and flt(row.custom_no_of_package):
			row.custom_total_weight_of_package = flt(row.custom_no_of_package) * flt(row.custom_per_package_weight)

		custom_total_net_weight_exim_ += flt(row.custom_net_weight)
		
		if flt(row.custom_total_weight_of_package) and flt(row.custom_no_of_package):
			row.custom_gross_weight = flt(row.custom_total_weight_of_package) + flt(row.custom_net_weight)
			custom_gross_weight += flt(row.custom_gross_weight)

		if flt(row.custom_no_of_package):
			row.custom_per_package_cbm = (flt(row.custom_height) * flt(row.custom_width) * flt(row.custom_length))/1000000
			row.custom_total_cbm_of_package = flt(row.custom_per_package_cbm) * (row.custom_no_of_package)
			custom_total_cbm += row.custom_total_cbm_of_package


	self.custom_total_net_weight_exim_ = custom_total_net_weight_exim_
	self.custom_gross_weight = custom_gross_weight
	self.custom_total_cbm = custom_total_cbm
	self.custom_total_packages = custom_total_packages