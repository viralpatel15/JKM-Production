import frappe
from frappe.custom.doctype.property_setter.property_setter import  make_property_setter
from jkm_production.custom_field_and_property_setter.property_setter import get_property_setters


def execute():
    make_property_setter()

def make_property_setter():
    for property_setter in get_property_setters():
        frappe.make_property_setter(property_setter, validate_fields_for_doctype=False)