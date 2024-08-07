import frappe
from frappe.model.mapper import get_mapped_doc

from erpnext.buying.doctype.supplier_quotation.supplier_quotation import SupplierQuotation
from erpnext.buying.utils import validate_for_items


class jkmsupplierquotation(SupplierQuotation):
    def validate(self):
        self.buying_price_list = ''
        self.ignore_pricing_rule = 1
        for row in self.items:
            if row.custom_rate_currency:
                row.rate = row.custom_rate_currency * row.custom_exchange_rate
            if row.custom_packing_size:
                row.custom_total_packages = row.qty / row.custom_packing_size
                
        super().validate()

        if not self.status:
            self.status = "Draft"

        from erpnext.controllers.status_updater import validate_status

        validate_status(self.status, ["Draft", "Submitted", "Stopped", "Cancelled"])

        validate_for_items(self)
        self.validate_with_previous_doc()
        self.validate_uom_is_integer("uom", "qty")
        self.validate_valid_till()

def on_submit(self, method):
    update_workflow(self)

def on_update_after_submit(self,method):
    update_workflow(self)

def update_workflow(self):
    rfq = self.items[0].get("request_for_quotation")
    if rfq:
        data = frappe.db.sql(f"""
                    Select rfq.name, sqi.parent
                    From `tabRequest for Quotation` as rfq
                    left Join `tabSupplier Quotation Item` as sqi On sqi.request_for_quotation = rfq.name
                    Where rfq.name = '{rfq}' and sqi.docstatus != 2
        """,as_dict=1)
        sq = []
        reject = []
        for row in data:
            if row.parent and row.parent not in sq:
                sq.append(row.parent)
                if row.parent != self.name:
                    reject.append(row.parent)

        for row in reject:
            frappe.db.set_value("Supplier Quotation", row, "workflow_state", "Rejected")
