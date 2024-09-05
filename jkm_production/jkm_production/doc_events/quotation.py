import frappe

def validate(self, method):
    if self.items[0].prevdoc_docname:
        if frappe.db.exists("Opportunity", self.items[0].prevdoc_docname):
            rfq = frappe.db.sql(f"""
                        Select name
                        From `tabRequest for Quotation`
                        Where docstatus = 1 and opportunity = '{self.items[0].prevdoc_docname}'
                    """, as_dict=1)
            if rfq and rfq[0].get('name'):
                rfq_doc = frappe.get_doc("Request for Quotation", rfq[0].get('name'))
                rfq_item_map = {}
                for row in rfq_doc.items:
                    rfq_item_map[row.item_code] = row
                for row in self.items:
                    if rfq_item_map.get(row.item_code):
                        row.supplier_quotation = rfq_item_map.get(row.item_code).get('supplier_quotation')
                        row.supplier_quotation_item = rfq_item_map.get(row.item_code).get('supplier_quotation_item')