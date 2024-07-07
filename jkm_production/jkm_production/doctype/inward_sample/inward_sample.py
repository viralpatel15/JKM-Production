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
	def before_validate(self):
		if self.status == "Requested":
			for row in self.sample_details:
				if not row.requested_qty:
					frappe.throw("Row #{0}: Requested Qty is required for sample request".format(row.idx))
		if self.status == "Dispatched":
			if not self.courier_service_name or not self.courier_docket_no:
				frappe.throw("Input a Courier Details <br><br> Courier Service Name and Courier Docket No is required")
			
		if self.status == "Ordered":
			for row in self.sample_details:
				if not row.sample_size:
					frappe.throw("Row #{0}: Ordered Quantity is missing".format(row.idx))
			if not self.supplier:
				frappe.throw("Please Update a Supplier Details")
			if not self.supplier_address or not self.contact_person:
				frappe.throw("Please Update a Supplier Address and Contact Details")

		if self.status == "Delivered":
			if not self.delivery_date:
				frappe.throw("Delivery Date is missing")


	def on_submit(self):	
		for row in self.sample_details:
			if not row.batch_ref:
				frappe.throw("Row #{0}: Please Input a Batch No".format(row.idx))
			if not row.manufacturing_date or not row.expiry_date:
				frappe.throw("Row #{0}: Manufacturing Date and Expiry Date is missing".format(row.idx))
			doc = frappe.new_doc("Sample Batch Details")
			doc.sample_batch_no = row.batch_ref
			doc.qty = row.sample_size
			doc.item_code = row.item_code
			doc.item_name = row.item_name
			doc.inward_sample = self.name
			doc.manufacturing_date = row.manufacturing_date
			doc.expiry_date = row.expiry_date
			doc.save()
			frappe.db.set_value(row.doctype, row.docname, 'batch_no', doc.name)
			
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
			"Inward Sample": {"doctype": "Outward Sample", 
					 "field_map": {"name": "inward_ref"},
					 'field_no_map': ["contact_person", "address_display", "contact_display", "contact_mobile", "contact_mobile","status","contact_email"]
					 },
			"Inward Sample Details" : {
				"doctype": "Outward Sample Detail",
				'field_map' : {
					'sample_size' : 'quantity',
					"batch_no" : 'batch_no'

				},
				
			}
		},
		target_doc,
	)
	doc = frappe.get_doc("Inward Sample", source_name)
	if doc.party_type == "Quotation":
		party_name = frappe.db.get_value("Quotation", doc.party, 'customer_name')
		doclist.update({'party_name' : party_name})

	return doclist				