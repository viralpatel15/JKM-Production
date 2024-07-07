from __future__ import unicode_literals
import frappe
import json
from frappe import _, db
from erpnext.utilities.product import get_price
from frappe.desk.reportview import get_match_cond, get_filters_cond
from frappe.utils import nowdate, flt

@frappe.whitelist(allow_guest = 1)
def new_customer_query(doctype, txt, searchfield, start, page_len, filters):
	conditions = []
	meta = frappe.get_meta("Customer")
	searchfields = meta.get_search_fields()
	searchfields = searchfields + [f for f in [searchfield or "name", "customer_name"] \
			if not f in searchfields]

	searchfields = " or ".join([field + " like %(txt)s" for field in searchfields])
	fields = ["name"]
	fields = ", ".join(fields)

	return frappe.db.sql("""select {fields} from `tabCustomer`
		where docstatus < 2
			and ({scond}) and disabled=0
			{fcond} {mcond}
		order by
			if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
			if(locate(%(_txt)s, customer_name), locate(%(_txt)s, customer_name), 99999),
			idx desc,
			name, customer_name
		limit %(start)s, %(page_len)s""".format(**{
			"fields": fields,
			"mcond": get_match_cond(doctype),
			"scond": searchfields,
			"fcond": get_filters_cond(doctype, filters, conditions).replace('%', '%%'),
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})

# searches for supplier
@frappe.whitelist()
def new_supplier_query(doctype, txt, searchfield, start, page_len, filters):
	supp_master_name = frappe.defaults.get_user_default("supp_master_name")
	if supp_master_name == "Supplier Name":
		fields = ["name"]
	else:
		fields = ["name"]
	fields = ", ".join(fields)

	return frappe.db.sql("""select {field} from `tabSupplier`
		where docstatus < 2
			and ({key} like %(txt)s
				or supplier_name like %(txt)s) and disabled=0
			{mcond}
		order by
			if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
			if(locate(%(_txt)s, supplier_name), locate(%(_txt)s, supplier_name), 99999),
			idx desc,
			name, supplier_name
		limit %(start)s, %(page_len)s """.format(**{
			'field': fields,
			'key': searchfield,
			'mcond':get_match_cond(doctype)
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})

@frappe.whitelist()	
def sales_order_query(doctype, txt, searchfield, start, page_len, filters):
	conditions = []

	so_searchfield = frappe.get_meta("Sales Order").get_search_fields()
	so_searchfields = " or ".join(["so.`" + field + "` like %(txt)s" for field in so_searchfield])

	soi_searchfield = frappe.get_meta("Sales Order Item").get_search_fields()
	soi_searchfield += ["item_code"]
	soi_searchfields = " or ".join(["soi.`" + field + "` like %(txt)s" for field in soi_searchfield])

	searchfield = so_searchfields + " or " + soi_searchfields

	return frappe.db.sql("""select so.name, so.status, so.transaction_date, so.customer, soi.item_code
			from `tabSales Order` so
		RIGHT JOIN `tabSales Order Item` soi ON (so.name = soi.parent)
		where so.docstatus = 1
			and so.status != "Closed"
			and so.customer = %(customer)s
			and ({searchfield})
		order by
			if(locate(%(_txt)s, so.name), locate(%(_txt)s, so.name), 99999)
		limit %(start)s, %(page_len)s """.format(searchfield=searchfield), {
			'txt': '%%%s%%' % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len,
			'customer': filters.get('customer')
		})
		
@frappe.whitelist()
def get_batch_no(doctype, txt, searchfield, start, page_len, filters):
	cond = ""

	meta = frappe.get_meta("Batch")
	searchfield = meta.get_search_fields()

	searchfields = " or ".join(["batch." + field + " like %(txt)s" for field in searchfield])

	if filters.get("posting_date"):
		cond = "and (batch.expiry_date is null or batch.expiry_date >= %(posting_date)s)"

	batch_nos = None
	args = {
		'item_code': filters.get("item_code"),
		'warehouse': filters.get("warehouse"),
		'posting_date': filters.get('posting_date'),
		'txt': "%{0}%".format(txt),
		"start": start,
		"page_len": page_len
	}

	if args.get('warehouse'):
		batch_nos = frappe.db.sql("""select sle.batch_no, batch.lot_no, batch.concentration,
		CASE
			WHEN i.maintain_as_is_stock=1 THEN round(sum(sle.actual_qty*batch.concentration)/100,2) ELSE round(sum(sle.actual_qty),2)
		END, 
		sle.stock_uom
				from `tabStock Ledger Entry` sle
					INNER JOIN `tabBatch` batch on sle.batch_no = batch.name
					JOIN `tabItem` as i on sle.item_code = i.name
				where
					sle.is_cancelled = 0 and
					i.has_batch_no = 1 and
					sle.item_code = %(item_code)s
					and sle.warehouse = %(warehouse)s
					and batch.docstatus < 2
					and (sle.batch_no like %(txt)s or {searchfields})
					{0}
					{match_conditions}
				group by batch_no having sum(sle.actual_qty) > 0
				order by batch.expiry_date, sle.batch_no desc
				limit %(start)s, %(page_len)s""".format(cond, match_conditions=get_match_cond(doctype), searchfields=searchfields), args)

	if batch_nos:
		return batch_nos
	else:
		return frappe.db.sql("""select name, lot_no, concentration, expiry_date from `tabBatch` batch
			where item = %(item_code)s
			and name like %(txt)s
			and docstatus < 2
			{0}
			{match_conditions}
			order by expiry_date, name desc
			limit %(start)s, %(page_len)s""".format(cond, match_conditions=get_match_cond(doctype)), args)
