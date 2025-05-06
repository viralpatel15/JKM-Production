import frappe

# Set Property Setter
def get_property_setters():
    return [
        {
         "doctype": "Purchase Invoice",
         "fieldname":"bill_no",
         "is_system_generated": 0,
         "property": "allow_on_submit",
         "value": 1
         },
    ]