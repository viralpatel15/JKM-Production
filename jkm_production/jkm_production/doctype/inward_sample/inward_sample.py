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
			if inw := frappe.db.get_value("Sample Batch Details", row.batch_no, 'inward_sample'):
				frappe.throw("Row {0} : Batch is allready used in inward sample <b>{1}</b>.<br><br>Please Create New Batch".format(row.idx, inw))
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'qty', row.sample_size)
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'inward_sample', self.name)
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'manufacturing_date', row.manufacturing_date)
			frappe.db.set_value("Sample Batch Details", row.batch_no, 'expiry_date', row.expiry_date)
		

@frappe.whitelist()
def create_outward_sample(source_name, target_doc=None):
	doclist = get_mapped_doc(
		"Inward Sample",
		source_name,
		{
			"Inward Sample": {"doctype": "Outward Sample", "field_map": {"name": "inward_ref"}},
		},
		target_doc,
	)

	return doclist				