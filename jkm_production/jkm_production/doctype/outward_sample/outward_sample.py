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
		if not self.courier_tracking_no:
			frappe.throw("Courier Tracking Number is Required")

@frappe.whitelist()
def make_quotation(source_name, target_doc=None):
	def postprocess(source, target):
		target.append('items', {
			'item_code': source.product_name,
			'item_name': source.product_name,
			'outward_sample':source.name,
			'sample_ref_no':source.ref_no,
			'base_cost' : source.per_unit_price
			})

	doclist = get_mapped_doc("Outward Sample" , source_name,{
		"Outward Sample":{
			"doctype" : "Quotation",
			"field_map":{
				"link_to" : "quotation_to",
				"party" : "customer",
				"date" : "transaction_date" ,
			},
		}
	},target_doc, postprocess)

	return doclist

@frappe.whitelist()
def make_quality_inspection(source_name, target_doc=None):
	doclist = get_mapped_doc("Outward Sample" , source_name,{
		"Outward Sample":{
			"doctype" : "Quality Inspection",
			"field_map":{
				"product_name" : "item_code",
				"doctype" : "reference_type",
				"name" : "reference_name" ,
			},
		}
	},target_doc)

	return doclist
