# Copyright (c) 2024, viral@gmail.com and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
	columns, data = [], []
	data = get_data(filters)
	columns = get_columns(filters)
	return columns, data

def get_columns(filters):
	column =[
		{
			"label":"Transporter",
			"fieldname":"supplier",
			"fieldtype":"Link",
			"options":"Supplier",
			"width":150
		},
		{
			"label":"Transporter Name",
			"fieldname":"supplier_name",
			"fieldtype":"Data",
			"width":150
		},
		{
			"label":"Person Name",
			"fieldname":"person_name",
			"fieldtype":"Data",
			"width":150
		},
		{
			"label":"Mobile No",
			"fieldname":"mobile_no",
			"fieldtype":"Data",
			"width":150
		},
		{
			"label":"Email ID",
			"fieldname":"email_id",
			"fieldtype":"Data",
			"width":150
		},
		{
			"label":"Branch",
			"fieldname":"branch",
			"fieldtype":"Link",
			"options":"City",
			"width":150
		},
		{
			"label":"Type",
			"fieldname":"custom_type",
			"fieldtype":"Small Text",
			"width":300
		}
	]
	return column

def get_data(filters):
	cond = ''
	if filters.get("supplier"):
		cond += f" and su.name = '{filters.get('supplier')}'"
	if filters.get("branch"):
		cond += f" and tc.branch = '{filters.get('branch')}'"
	
	if filters.get('type'):
		cond += f"and su.custom_type like '%{filters.get('type')}%'"
	data = frappe.db.sql("""
		Select su.name as supplier , su.supplier_name, tc.person_name, tc.mobile_no, tc.email_id, tc.branch, su.custom_type
		From `tabSupplier` as su
		Left Join`tabTransporter Contact` as tc on tc.parent = su.name
		Where su.is_transporter = 1 {0}
	""".format(cond),as_dict=1)
	supplier = []
	for row in data:
		if row.supplier not in supplier:
			supplier.append(row.supplier)
		else:
			row.update({'supplier':'', "supplier_name":''})
	return data

