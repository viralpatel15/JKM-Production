import frappe

def on_submit(self,method):
    if self.workflow_state == "In Progress":
        if not len(self.suppliers):
            frappe.throw("Supplier Details is requiered to set RFQ")