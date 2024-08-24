import frappe

def on_update_after_submit(self, method):
    if self.get('workflow_state'):
        if self.workflow_state == "Renegotiate":
            flag = False
            for row in self.items:
                if not row.custom_is_renegotiable_item:
                    flag =True
                if not row.custom_target_price:
                    frappe.throw(f"Row #{row.idx} : Target price is required for renegotiate")

            if flag and len(self.items) > 1:
                frappe.throw("Enable renegotiable item in Item table")


def on_submit(self,method):
    if self.get('workflow_state'):
        if self.workflow_state == "In Progress":
            if not len(self.suppliers):
                frappe.throw("Supplier Details is requiered to set RFQ")


from erpnext.buying.doctype.request_for_quotation.request_for_quotation import RequestforQuotation

class jkmrequestforquotation(RequestforQuotation):
    def send_to_supplier(self):
        """Sends RFQ mail to involved suppliers."""
        for rfq_supplier in self.suppliers:
            if rfq_supplier.email_id is not None and rfq_supplier.send_email:
                self.validate_email_id(rfq_supplier)

                # make new user if required
                update_password_link, contact = self.update_supplier_contact(rfq_supplier, self.get_link())

                self.update_supplier_part_no(rfq_supplier.supplier)
                self.supplier_rfq_mail(rfq_supplier, update_password_link, self.get_link())
                rfq_supplier.email_sent = 1
                if not rfq_supplier.contact:
                    rfq_supplier.contact = contact
                rfq_supplier.save(ignore_permissions=True)