# Copyright (c) 2024, viral@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SampleBatchDetails(Document):
	pass



#disabled if expired
def disable_batch():
	batch = frappe.get_all("Sample Batch Details", {'disabled' : 0}, pluck="name")
	from frappe.utils import getdate
	currenct_date = getdate()
	for row in batch:
		doc = frappe.get_doc("Sample Batch Details", row)
		if getdate(doc.expiry_date) > currenct_date:
			doc.disabled = 1
			doc.save()