# Copyright (c) 2023, Finbyz Tech PVT LTD and contributors
# For license information, please see license.txt
import frappe
from frappe.utils import flt
from frappe.contacts.doctype.address.address import get_address_display, get_default_address
from frappe.contacts.doctype.address.address import get_address_display, get_default_address
from frappe.contacts.doctype.contact.contact import get_contact_details, get_default_contact
from frappe.desk.notifications import get_filters_for
from datetime import date
from frappe.model.mapper import get_mapped_doc
from erpnext.accounts.utils import get_fiscal_year, flt
from erpnext.stock.stock_ledger import update_entries_after

@frappe.whitelist()
def pe_on_submit(self, method):
	fwd_uti(self)

def fwd_uti(self):
	for row in self.get('forwards'):
		target_doc = frappe.get_doc("Forward Contract", row.forward_contract)
		if not frappe.db.get_value("Forward Contract Utilization", filters={"parent": row.forward_contract, "voucher_type": "Payment Entry", "voucher_no": self.name}):
			target_doc.append("payment_entries", {
				"date": self.posting_date,
				"party_type": self.party_type,
				"party": self.party,
				"paid_amount" : row.amount_utilized,
				"voucher_type": "Payment Entry",
				"voucher_no" : self.name,
			})
		target_doc.save()
@frappe.whitelist()
def pe_on_cancel(self, method):
	fwd_uti_cancel(self)
	remove_pe_from_brc(self,method)

def remove_pe_from_brc(self,method):
	if frappe.db.exists("DocType", 'BRC Management'):
		voucher_no = self.name
		data = frappe.db.sql(f"""SELECT brc.name as brc , brcp.name
								from `tabBRC Management` as brc
								left join `tabBRC Payment` as brcp on brcp.parent = brc.name     
								where brcp.voucher_type = "Payment Entry" and brcp.voucher_no = '{voucher_no}'
								""", as_dict=1)

		for row in data:
			frappe.db.delete("BRC Payment",row.name)

def fwd_uti_cancel(self):
	if self.name == "ACC-PAY-2022-00220":pass
	for row in self.get('forwards'):
		doc = frappe.get_doc("Forward Contract", row.forward_contract)
		to_remove = [row for row in doc.payment_entries if row.voucher_no == self.name and row.voucher_type == "Payment Entry"]
		[doc.remove(row) for row in to_remove]
		doc.save()


@frappe.whitelist()
def get_party_details(party=None, party_type="Customer", ignore_permissions=True):

	if not party:
		return {}

	if not frappe.db.exists(party_type, party):
		frappe.throw(_("{0}: {1} does not exists").format(party_type, party))

	return _get_party_details(party, party_type, ignore_permissions)

def _get_party_details(party=None, party_type="Customer", ignore_permissions=True):

	out = frappe._dict({
		party_type.lower(): party
	})

	party = out[party_type.lower()]

	if not ignore_permissions and not frappe.has_permission(party_type, "read", party):
		frappe.throw(_("Not permitted for {0}").format(party), frappe.PermissionError)

	party = frappe.get_doc(party_type, party)
	
	set_address_details(out, party, party_type)
	set_contact_details(out, party, party_type)
	set_other_values(out, party, party_type)
	set_organization_details(out, party, party_type)
	return out


def set_address_details(out, party, party_type):
	billing_address_field = "customer_address" if party_type == "Lead" \
		else party_type.lower() + "_address"
	out[billing_address_field] = get_default_address(party_type, party.name)
	
	# address display
	out.address_display = get_address_display(out[billing_address_field])


def set_contact_details(out, party, party_type):
	out.contact_person = get_default_contact(party_type, party.name)

	if not out.contact_person:
		out.update({
			"contact_person": None,
			"contact_display": None,
			"contact_email": None,
			"contact_mobile": None,
			"contact_phone": None,
			"contact_designation": None,
			"contact_department": None
		})
	else:
		out.update(get_contact_details(out.contact_person))

def set_other_values(out, party, party_type):
	# copy
	if party_type=="Customer":
		to_copy = ["customer_name", "customer_group", "territory", "language"]
	else:
		to_copy = ["supplier_name", "supplier_type", "language"]
	for f in to_copy:
		out[f] = party.get(f)
		
def set_organization_details(out, party, party_type):

	organization = None

	if party_type == 'Lead':
		organization = frappe.db.get_value("Lead", {"name": party.name}, "company_name")
	elif party_type == 'Customer':
		organization = frappe.db.get_value("Customer", {"name": party.name}, "customer_name")
	elif party_type == 'Supplier':
		organization = frappe.db.get_value("Supplier", {"name": party.name}, "supplier_name")

	out.update({'party_name': organization})

@frappe.whitelist()
def get_customer_ref_code(item_code, customer):
	ref_code = frappe.db.get_value("Item Customer Detail", {'parent': item_code, 'customer_name': customer}, 'ref_code')
	return ref_code if ref_code else ''

@frappe.whitelist()
@frappe.whitelist()
def make_courier_management(source_name, target_doc=None):
	doclist = get_mapped_doc(
		"Quotation",
		source_name,
		{
			"Quotation": {
				"doctype": "Inward Sample",
				"validation": {"docstatus": ["=", 1]},
				"field_no_map": ["address_display", "contact_person", "contact_display", "contact_mobile", "contact_email"],
				"field_map":{
					"name" : "party",
					"doctype" : "party_type"
				}
			},
			"Quotation Item": {
				"doctype": "Inward Sample Details",
				"field_map": {
					
				},	
			}
		},
		target_doc,
	)
	
	return doclist

#Roadtepclaimmanagement
import frappe
from frappe import _
@frappe.whitelist()
def si_on_submit(self, method):
	create_jv(self)
	
@frappe.whitelist()
def si_on_cancel(self, method):
	cancel_jv(self, method)

def create_jv(self):
	if self.total_duty_drawback:
		drawback_receivable_account = frappe.db.get_value("Company", { "company_name": self.company}, "duty_drawback_receivable_account")
		drawback_income_account = frappe.db.get_value("Company", { "company_name": self.company}, "duty_drawback_income_account")
		drawback_cost_center = frappe.db.get_value("Company", { "company_name": self.company}, "duty_drawback_cost_center")
		if not drawback_receivable_account:
			frappe.throw(_("Set Duty Drawback Receivable Account in Company"))
		elif not drawback_income_account:
			frappe.throw(_("Set Duty Drawback Income Account in Company"))
		elif not drawback_cost_center:
			frappe.throw(_("Set Duty Drawback Cost Center in Company"))
		else:
			jv = frappe.new_doc("Journal Entry")
			jv.voucher_type = "Duty Drawback Entry"
			jv.posting_date = self.posting_date
			jv.company = self.company
			jv.cheque_no = self.name
			jv.cheque_date = self.posting_date
			jv.user_remark = "Duty draw back against " + self.name + " for " + self.customer
			jv.append("accounts", {
				"account": drawback_receivable_account,
				"cost_center": drawback_cost_center,
				"debit_in_account_currency": self.total_duty_drawback
			})
			jv.append("accounts", {
				"account": drawback_income_account,
				"cost_center": drawback_cost_center,
				"credit_in_account_currency": self.total_duty_drawback
			})
			try:
				jv.save(ignore_permissions=True)
				jv.submit()
			except Exception as e:
				frappe.throw(str(e))
			else:
				self.db_set('duty_drawback_',jv.name)

	if self.get('total_meis'):
		meis_receivable_account = frappe.db.get_value("Company", { "company_name": self.company}, "meis_receivable_account")
		meis_income_account = frappe.db.get_value("Company", { "company_name": self.company}, "meis_income_account")
		meis_cost_center = frappe.db.get_value("Company", { "company_name": self.company}, "meis_cost_center")
		if not meis_receivable_account:
			frappe.throw(_("Set RODTEP Receivable Account in Company"))
		elif not meis_income_account:
			frappe.throw(_("Set RODTEP Income Account in Company"))
		elif not meis_cost_center:
			frappe.throw(_("Set RODTEP Cost Center in Company"))
		else:
			meis_jv = frappe.new_doc("Journal Entry")
			meis_jv.voucher_type = "RODTEP Entry"
			meis_jv.posting_date = self.posting_date
			meis_jv.company = self.company
			meis_jv.cheque_no = self.name
			meis_jv.cheque_date = self.posting_date
			meis_jv.user_remark = "RODTEP against " + self.name + " for " + self.customer
			meis_jv.append("accounts", {
				"account": meis_receivable_account,
				"cost_center": meis_cost_center,
				"debit_in_account_currency": self.total_meis
			})
			meis_jv.append("accounts", {
				"account": meis_income_account,
				"cost_center": meis_cost_center,
				"credit_in_account_currency": self.total_meis
			})
			
			try:
				meis_jv.save(ignore_permissions=True)
				meis_jv.submit()
				
			except Exception as e:
				frappe.throw(str(e))
			else:
				self.db_set('rodtep_jv',meis_jv.name)
def cancel_jv(self, method):
	if self.duty_drawback_:
		jv = frappe.get_doc("Journal Entry", self.duty_drawback_)
		jv.cancel()
		self.duty_drawback_ = ''
	if self.get('rodtep_jv'):
		jv = frappe.get_doc("Journal Entry", self.rodtep_jv)
		jv.cancel()
		self.rodtep_jv = ''