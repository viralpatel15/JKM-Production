// Copyright (c) 2022, Finbyz Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on('Courier Agency', {
	address: function(frm) {
		frappe.call({
			method: "frappe.contacts.doctype.address.address.get_address_display",
			args: { address_dict: frm.doc['address'] },
			callback: function (r) {
				if (r.message) {
					frm.set_value('address_display', r.message);
				}
			},
		});
	},
	contact_details: function(frm) {
		frappe.call({
			method: "frappe.contacts.doctype.contact.contact.get_contact_details",
			args: { contact: frm.doc.contact_details },
			callback: function (r) {
				if (r.message) frm.set_value(r.message);
			},
		});
	}
});
