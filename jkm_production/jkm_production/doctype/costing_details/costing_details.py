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
		
		local_transport = 0 
		if self.grand_total:
			local_transport = self.grand_total/self.total_quantity
			for row in self.items:
				row.custom_local_transport_charges = local_transport
		if self.total_fob_value:
			for row in self.items:
				row.custom_shipping_fob = self.total_fob_value/self.total_quantity
		if self.total_amount_charges:
			for row in self.items:
				row.custom_other_charges = self.total_amount_charges / self.total_quantity
		if self.total_cif_value:
			for row in self.items:
				row.custom_cif_charges = self.total_cif_value / self.total_quantity
		for row in self.items:
			row.custom_total_fob_value = row.base_rate + row.custom_cost_per_packages + row.custom_local_transport_charges + row.custom_shipping_fob + row.custom_other_charges
			row.custom_total_cif_value = row.custom_cif_charges + row.custom_total_fob_value

@frappe.whitelist()		
def get_item_details(docname):
	return frappe.get_doc("Supplier Quotation", docname)