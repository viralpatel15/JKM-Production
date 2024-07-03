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

# from finbyzerp.api import before_naming as naming_series

class OutwardSample(Document):
	def validate(self):
		total_qty = 0
		for row in self.details:
			total_qty += row.quantity
		self.total_qty = total_qty
		
	def on_submit(self):
		if not self.courier_tracking_no:
			frappe.throw("Courier Tracking Number is Required")
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
