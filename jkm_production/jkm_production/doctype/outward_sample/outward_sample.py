# -*- coding: utf-8 -*-
# Copyright (c) 2018, FinByz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _, db
from frappe.model.document import Document
from jkm_production.api import get_party_details
from frappe.model.mapper import get_mapped_doc
from frappe.desk.reportview import get_match_cond, get_filters_cond
from erpnext.utilities.product import get_price
from frappe.utils import nowdate,flt
import json

# from finbyzerp.api import before_naming as naming_series

class OutwardSample(Document):
	def validate(self):
		total_qty = 0
		for row in self.details:
			total_qty += row.quantity
			if row.manufacturing_date == row.expiry_date:
				frappe.throw("Row #{0} : Manufacturing Date and Expiry Date can not be the same")
		self.total_qty = total_qty
		
	def on_submit(self):
		
		for row in self.details:
			if row.item_code != frappe.db.get_value("Sample Batch Details", row.batch_no, 'item_code'):
				frappe.throw("Row #{0}: Selected batch is not for item code {1}. Please select a correct batch".format(row.idx, row.item_code))
			batch_qty = frappe.db.get_value("Sample Batch Details", row.batch_no, 'qty')
			remaining_qty = batch_qty - row.quantity
			if remaining_qty < 0 or row.quantity > batch_qty:
				frappe.throw(f"Insufficient Quantity {batch_qty} Available in batch <b>{row.batch_no}</b>")
			frappe.db.set_value('Sample Batch Details', row.batch_no, 'qty', remaining_qty)
	
	def on_cancel(self):
		for row in self.details:
			batch_qty= frappe.db.get_value("Sample Batch Details", row.batch_no, "qty")
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'qty', batch_qty + row.quantity)



@frappe.whitelist()
def get_opportunity_party_details(self):
	doc = json.loads(self)
	inquiry = frappe.get_doc("Opportunity", doc.get('party'))
	return get_party_details(party = inquiry.get('party_name') , party_type=inquiry.get('opportunity_from'))

@frappe.whitelist()
def make_courier_management(source_name, target_doc=None):
	doclist = get_mapped_doc(
		"Outward Sample",
		source_name,
		{
			"Outward Sample": {
				"doctype": "Courier Management",
				"validation": {"docstatus": ["=", 1]},
				"field_map":{
					"party_type" : "link_to"
				}
			},
		},
		target_doc,
	)
	doc = frappe.get_doc("Outward Sample", source_name)
	for row in doc.details:
		doclist.append("sample_items", {
			"sample_ref" : source_name,
			"batch_no" : row.batch_no,
			"quantity" : row.quantity,
			"manufacturing_date":row.manufacturing_date,
			"item" : row.item_code,
			"product_name" : row.item_name,
			"uom" : row.uom,
			"expiry_date":row.expiry_date
		})
	return doclist


@frappe.whitelist()
def get_quotation_party_details(self):
	doc = json.loads(self)
	quotation = frappe.get_doc("Quotation", doc.get('party'))
	return get_party_details(party = quotation.get('party_name') , party_type=quotation.get('quotation_to'))