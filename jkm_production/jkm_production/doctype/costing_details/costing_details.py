# Copyright (c) 2024, viral@fosserp.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import flt
import json

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
		if self.total_amount_domestic:
			total_cost += self.total_amount_domestic
		if self.total_amount_e:
			total_cost += self.total_amount_e
		if self.total_amount_charges:
			total_cost += self.total_amount_charges
		
		if total_cost:
			self.total_cost = total_cost
		
		local_transport = 0 
		if self.total_amount_domestic:
			local_transport = self.total_amount_domestic/self.total_quantity
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
		total_cbm = 0
		for row in self.items:
			row.custom_per_qty_pallet_cost = flt(row.custom_cost_per_packages) * flt(row.custom_total_packages) / flt(row.qty)
			row.custom_total_fob_value = flt(row.base_rate)  + flt(row.custom_local_transport_charges) + flt(row.custom_shipping_fob) + flt(row.custom_other_charges) + flt(row.custom_per_qty_pallet_cost)
			row.custom_total_cif_value = flt(row.custom_cif_charges) + flt(row.custom_total_fob_value)
			row.custom_total_cbm = (flt(row.custom_length) * flt(row.custom_width) * flt(row.custom_height))/1000000 * flt(row.custom_cbm_qty)
			total_cbm += flt(row.custom_total_cbm)
			row.custom_total_packages = row.qty/row.custom_packing_size

		self.total_cbm = total_cbm

@frappe.whitelist()		
def get_item_details(docname):
	return frappe.get_doc("Supplier Quotation", docname)

@frappe.whitelist()
def get_items_conversion_fector(uom, item_code):
	item = frappe.get_doc("Item", item_code)
	for row in item.uoms:
		if row.uom == uom:
			return row.conversion_factor 
	return 1  

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_supplier_quotation(doctype, txt, searchfield, start, page_len, filters):
	doc = filters.get('doc')
	condition = ''
	
	if doc.get('opportunity'):
		condition += f" and rfq.opportunity = '{doc.get('opportunity')}'"
	
	if doc.get("request_for_quotation"):
		condition += f" and sqi.request_for_quotation = '{doc.get('request_for_quotation')}'"
	
	if doc.get('opportunity') or doc.get("request_for_quotation"):
		return frappe.db.sql(f"""
				Select sq.name, sq.workflow_state , sq.supplier, sq.status, sq.supplier_name
				From `tabSupplier Quotation` as sq
				Left Join `tabSupplier Quotation Item` as sqi ON sqi.parent = sq.name
				Left join `tabRequest for Quotation` as rfq ON rfq.name = sqi.request_for_quotation
				Where sq.docstatus = 1 and sq.custom_quotation_request_for = "Product Quotation" {condition}
		""")
	else:
		return frappe.db.sql(f"""
				Select name, workflow_state , supplier, status, supplier_name
				From `tabSupplier Quotation`
				Where docstatus = 1 and custom_quotation_request_for = "Product Quotation"
			""")


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_supplier_quotation_ltc(doctype, txt, searchfield, start, page_len, filters):
	condition = ''
	if filters.get('custom_port_of_origin'):
		condition += f" and sq.custom_port_of_origin = '{filters.get('custom_port_of_origin')}'"

	if filters.get('custom_place_of_delivery'):
		condition += f" and sq.custom_place_of_delivery = '{filters.get('custom_place_of_delivery')}'"
	
	if filters.get("request_for_quotation"):
		condition += f" and sqi.request_for_quotation = '{filters.get('request_for_quotation')}'"

	if filters.get('custom_port_of_origin') or filters.get("custom_place_of_delivery") or filters.get("request_for_quotation_ltc"):
		return frappe.db.sql(f"""
				Select sq.name, sq.workflow_state , sq.supplier, sq.status, sq.supplier_name
				From `tabSupplier Quotation` as sq
				Left Join `tabSupplier Quotation Item` as sqi ON sqi.parent = sq.name
				Left join `tabRequest for Quotation` as rfq ON rfq.name = sqi.request_for_quotation
				Where sq.docstatus = 1 and sq.custom_quotation_request_for = "Local Transport Quotation" {condition}
		""")
	else:
		return frappe.db.sql(f"""
				Select sq.name, sq.workflow_state , sq.supplier, sq.status, sq.supplier_name
				From `tabSupplier Quotation` as sq
				Where sq.docstatus = 1 and sq.custom_quotation_request_for = "Product Quotation"
			""")
	
@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_supplier_quotation_ex(doctype, txt, searchfield, start, page_len, filters):
	condition = ''
	if filters.get('custom_port_of_origin'):
		condition += f" and sq.custom_port_of_origin = '{filters.get('custom_port_of_origin')}'"

	if filters.get('custom_port_of_destination'):
		condition += f" and sq.custom_port_of_destination = '{filters.get('custom_port_of_destination')}'"
	
	if filters.get("request_for_quotation"):
		condition += f" and sqi.request_for_quotation = '{filters.get('request_for_quotation')}'"

	if filters.get('custom_port_of_origin') or filters.get("custom_place_of_delivery") or filters.get("request_for_quotation_ltc"):
		return frappe.db.sql(f"""
				Select sq.name, sq.workflow_state , sq.supplier, sq.status, sq.supplier_name
				From `tabSupplier Quotation` as sq
				Left Join `tabSupplier Quotation Item` as sqi ON sqi.parent = sq.name
				Left join `tabRequest for Quotation` as rfq ON rfq.name = sqi.request_for_quotation
				Where sq.docstatus = 1 and sq.custom_quotation_request_for = "Shipping Quotation" {condition}
		""")
	else:
		return frappe.db.sql(f"""
				Select sq.name , sq.workflow_state , sq.supplier, sq.status, sq.supplier_name 
				From `tabSupplier Quotation` as sq
				Where sq.docstatus = 1 and sq.custom_quotation_request_for = "Shipping Quotation"
			""")
