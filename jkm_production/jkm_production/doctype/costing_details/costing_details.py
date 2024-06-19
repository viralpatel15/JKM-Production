# Copyright (c) 2024, viral@fosserp.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CostingDetails(Document):
	def validate(self):
		total_qty = 0
		taxable_value = 0
		net_amount = 0
		for row in self.items:
			total_qty += row.qty
			net_amount += row.amount
			taxable_value += row.taxable_value
		self.total_quantity = total_qty
		self.total_amount = net_amount


		total_cost = 0
		if self.grand_total_d:
			total_cost += self.grand_total_d
		if self.grand_total:
			total_cost += self.grand_total
		if self.grand_total_e:
			total_cost += self.grand_total_e
		if self.total_amount_charges:
			total_cost += self.total_amount_charges
		
		if total_cost:
			self.total_cost = total_cost
			self.total_cost__total_qty = total_cost / self.total_quantity


@frappe.whitelist()		
def get_item_details(docname):
	return frappe.get_doc("Supplier Quotation", docname)