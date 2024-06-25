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
                
        super().validate()

        if not self.status:
            self.status = "Draft"

        from erpnext.controllers.status_updater import validate_status

        validate_status(self.status, ["Draft", "Submitted", "Stopped", "Cancelled"])

        validate_for_items(self)
        self.validate_with_previous_doc()
        self.validate_uom_is_integer("uom", "qty")
        self.validate_valid_till()