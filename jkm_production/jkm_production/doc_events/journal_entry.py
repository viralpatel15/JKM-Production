# Copyright (c) 2023, Finbyz Tech PVT LTD and contributors
# For license information, please see license.txt


import frappe
from frappe.utils import flt
from forward_contract.forward_contract.doctype.forward_contract.forward_contract import ForwardContract

def before_cancel(self, method):
    if frappe.db.exists("Forward Contract Cancellation" , {'journal_entry' : self.name}):
        fwc, parent = frappe.db.get_value("Forward Contract Cancellation", {'journal_entry' : self.name}, ["name", 'parent'])
        
        if fwc:
            frappe.db.sql(f"DELETE FROM `tabForward Contract Cancellation` WHERE name = '{fwc}'")
        
        if parent:
            doc = frappe.get_doc("Forward Contract", parent)
            ForwardContract.calculate_cancellation(doc)
            doc.save()