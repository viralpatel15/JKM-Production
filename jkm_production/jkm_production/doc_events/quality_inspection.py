import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from frappe.utils import cint, cstr, flt, get_number_format_info

from erpnext.stock.doctype.quality_inspection_template.quality_inspection_template import (
	get_template_details,
)
from erpnext.stock.doctype.quality_inspection.quality_inspection import QualityInspection




class QualityInspectionJKM(QualityInspection):
	def on_submit(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()

		if self.reference_type == "Inward Sample":
			frappe.db.set_value("Inward Sample Details", self.custom_table_ref, "quality_inspection", self.name)
	
	def before_cancel(self):
		if self.reference_type == "Inward Sample":
			frappe.db.set_value("Inward Sample Details", self.custom_table_ref, "quality_inspection", "")

	def on_cancel(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()


	def on_trash(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()
		if self.reference_type == "Inward Sample":
			frappe.db.set_value("Inward Sample Details", self.custom_table_ref, "quality_inspection", "")

	def validate(self):
		if not self.readings and self.item_code:
			self.get_item_specification_details()

		if self.inspection_type == "In Process" and self.reference_type == "Job Card":
			item_qi_template = frappe.db.get_value("Item", self.item_code, "quality_inspection_template")
			parameters = get_template_details(item_qi_template)
			for reading in self.readings:
				for d in parameters:
					if reading.specification == d.specification:
						reading.update(d)
						reading.status = "Accepted"

		if self.readings:
			self.inspect_and_set_status()
		if self.reference_type == "Inward Sample":
			frappe.db.set_value("Inward Sample Details", self.custom_table_ref, "quality_inspection", self.name)
		
		