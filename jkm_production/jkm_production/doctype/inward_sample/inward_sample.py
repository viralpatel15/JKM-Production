# -*- coding: utf-8 -*-
# Copyright (c) 2018, FinByz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import db,_
from frappe.model.document import Document
# from finbyzerp.api import before_naming as naming_series
from frappe.model.mapper import get_mapped_doc

class InwardSample(Document):
	pass

		
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