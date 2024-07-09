
import frappe
from frappe import _
from frappe.model.document import Document
from erpnext.stock.doctype.quality_inspection.quality_inspection import QualityInspection




class QualityInspectionJKM(QualityInspection):
	def on_submit(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()

	def on_cancel(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()

	def on_trash(self):
		if self.reference_type != "Inward Sample":
			self.update_qc_reference()