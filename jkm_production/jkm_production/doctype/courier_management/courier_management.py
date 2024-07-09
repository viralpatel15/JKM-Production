# Copyright (c) 2022, Finbyz Tech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class CourierManagement(Document):
	def validate(self):
		html = f"<p style='font-size:18px; color:blue;'><a href={self.tracking_site}>Tracking Site</a></p>"
		self.html_wqig = html