import frappe

def validate(self, method):
    set_sales_order_ref(self)

def set_sales_order_ref(self):
    if self.custom_is_against_sales_order and self.custom_sales_order:
        doc = frappe.get_doc("Sales Order", self.custom_sales_order)
        item_map = {}
        for row in doc.items:
            item_map[row.item_code] = row
        for row in self.items:
            if item_map.get(row.item_code):
                row.sales_order_item = item_map.get(row.item_code).get('name')
                row.sales_order = self.custom_sales_order