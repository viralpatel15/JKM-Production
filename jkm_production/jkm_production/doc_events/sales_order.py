import frappe
from frappe.utils import flt, getdate, nowdate
from erpnext.selling.doctype.quotation.quotation import _make_sales_order
from frappe import _

def validate(self, method):
	custom_total_net_weight_exim_ = 0
	custom_gross_weight = 0
	custom_total_cbm = 0
	custom_total_packages = 0
	for row in self.items:
		if flt(row.qty) and flt(row.custom_packing_size):
			row.custom_no_of_package = flt(row.qty) / flt(row.custom_packing_size)
			custom_total_packages += row.custom_no_of_package

		if flt(row.custom_per_package_weight) and flt(row.custom_no_of_package):
			row.custom_total_weight_of_package = flt(row.custom_no_of_package) * flt(row.custom_per_package_weight)

		custom_total_net_weight_exim_ += flt(row.custom_net_weight)
		
		if flt(row.custom_total_weight_of_package) and flt(row.custom_no_of_package):
			row.custom_gross_weight = flt(row.custom_total_weight_of_package) + flt(row.custom_net_weight)
			custom_gross_weight += flt(row.custom_gross_weight)

		if flt(row.custom_no_of_package):
			row.custom_per_package_cbm = (flt(row.custom_height) * flt(row.custom_width) * flt(row.custom_length))/1000000
			row.custom_total_cbm_of_package = flt(row.custom_per_package_cbm) * (row.custom_no_of_package)
			custom_total_cbm += row.custom_total_cbm_of_package


	self.custom_total_net_weight_exim_ = custom_total_net_weight_exim_
	self.custom_gross_weight = custom_gross_weight
	self.custom_total_cbm = custom_total_cbm
	self.custom_total_packages = custom_total_packages
	if self.doctype == "Sales Order":
		self.custom_qr = generate_upi_qr_code(upi_id = "mavanidhaval24@okhdfcbank", payee_name = self.customer, amount=self.grand_total)


@frappe.whitelist()
def make_sales_order(source_name: str, target_doc=None):
	confirm = frappe.db.get_value("Quotation", source_name, "custom_is_paid_or_order_confirm")

	if not confirm:
		frappe.throw("This quotation is not confirm or paid please contact to Admin")
		
	if not frappe.db.get_singles_value(
		"Selling Settings", "allow_sales_order_creation_for_expired_quotation"
	):
		quotation = frappe.db.get_value(
			"Quotation", source_name, ["transaction_date", "valid_till"], as_dict=1
		)
		if quotation.valid_till and (
			quotation.valid_till < quotation.transaction_date or quotation.valid_till < getdate(nowdate())
		):
			frappe.throw(_("Validity period of this quotation has ended."))

	return _make_sales_order(source_name, target_doc)

import urllib.parse

def generate_upi_url(upi_id, payee_name, amount):
	base_url = "upi://pay"
	query_params = {
		"pa": upi_id,  # Payee UPI ID
		"pn": payee_name,  # Payee Name
		"am": f"{amount:.2f}",  # Amount (2 decimal places)
		"cu": "INR"  # Currency
	}
	frappe.throw(str(f"{base_url}?{urllib.parse.urlencode(query_params)}"))
	return f"{base_url}?{urllib.parse.urlencode(query_params)}"


import qrcode
import base64
from io import BytesIO

@frappe.whitelist()
def generate_upi_qr_code(upi_id = "mavanidhaval24@okhdfcbank", payee_name = "supplier", amount=0):
	upi_url = generate_upi_url(upi_id, payee_name, amount)
	
	# Generate the QR code
	qr = qrcode.QRCode(box_size=10, border=4)
	qr.add_data(upi_url)
	qr.make(fit=True)
	
	# Convert QR code to an image
	img = qr.make_image(fill="black", back_color="white")
	frappe.throw(str(img))
	# Save to a BytesIO stream
	buffer = BytesIO()
	img.save(buffer, format="PNG")
	buffer.seek(0)
	
	# Convert the image to a base64 string
	img_base64 = base64.b64encode(buffer.read()).decode('utf-8')

	return img_base64

