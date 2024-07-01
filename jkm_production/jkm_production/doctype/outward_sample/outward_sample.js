// Copyright (c) 2019, FinByz Tech Pvt. Ltd. and contributors
// For license information, please see license.txt

//fetch territory from party.
//cur_frm.add_fetch("party", "territory", "destination");

//fetch item name in child table.
cur_frm.add_fetch("inward_sample", "item_code", "item_name");
cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "stock_uom", "uom");
cur_frm.add_fetch("item_code", "item_group", "item_group");


frappe.ui.form.on('Outward Sample', {
	refresh:function(frm){
		frm.set_query("link_to", function () {
			return {
				filters: {
					name: ['in', "Customer, Opportunity, Lead, Quotation"],
				},
			}
		})
	},
	party: function (frm) {
		frm.set_query("contact_person", function (doc) {
			if (doc.party) {
				return {
					query: "frappe.contacts.doctype.contact.contact.contact_query",
					filters: {
						link_doctype: doc.link_to,
						link_name: doc.party,
					},
				};
			}
		});
		frappe.call({
			method: "jkm_production.api.get_party_details",
			args: {
				party: frm.doc.party,
				party_type: frm.doc.link_to
			},
			callback: function (r) {
				if (r.message) {
					frm.set_value('party_name', r.message.party_name);
				}
			}
		});
		frm.set_query("customer_address", function (doc) {
			if (!doc.party) {
				frappe.throw(__("Please set Party"));
			}

			return {
				query: "frappe.contacts.doctype.address.address.address_query",
				filters: {
					link_doctype: doc.link_to,
					link_name: doc.party,
				},
			};
		});
	},
	customer_address:function(frm){
			frappe.call({
				method: "frappe.contacts.doctype.address.address.get_address_display",
				args: { address_dict: frm.doc['customer_address'] },
				callback: function (r) {
					if (r.message) {
						frm.set_value('address_display', r.message);
					}
				},
			});
	},
	contact_person:frm =>{
		if(frm.doc.contact_person){
			frappe.call({
				method: "frappe.contacts.doctype.contact.contact.get_contact_details",
				args: { contact: frm.doc.contact_person },
				callback: function (r) {
					if (r.message) frm.set_value(r.message);
					console.log(r.message)
				},
			});
		}
	}
	
});


