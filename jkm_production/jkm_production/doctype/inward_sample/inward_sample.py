# -*- coding: utf-8 -*-
# Copyright (c) 2018, FinByz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import db,_
from frappe.model.document import Document
from frappe.utils import getdate
# from finbyzerp.api import before_naming as naming_series
from frappe.model.mapper import get_mapped_doc

class InwardSample(Document):
	def on_submit(self):	
		for row in self.sample_details:
			doc = frappe.new_doc("Sample Batch Details")
			doc.sample_batch_no = row.batch_ref
			doc.qty = row.sample_size
			doc.item_code = row.item_code
			doc.item_name = row.item_name
			doc.inward_sample = self.name
			doc.manufacturing_date = row.manufacturing_date
			doc.expiry_date = row.expiry_date
			doc.save()
			row.batch_no = doc.name
			
	def before_cancel(self):
		for row in self.sample_details:
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'disabled', 1)
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'inward_sample', '')

@frappe.whitelist()
def create_outward_sample(source_name, target_doc=None):
	doclist = get_mapped_doc(
		"Inward Sample",
		source_name,
		{
			"Inward Sample": {"doctype": "Outward Sample", "field_map": {"name": "inward_ref"}},
			"Inward Sample Details" : {
				"doctype": "Outward Sample Detail",
				'field_map' : {
					'sample_size' : 'quantity'
				},
				'field_no_map': ['status']
			}
		},
		target_doc,
	)


	return doclist				