// Copyright (c) 2019, FinByz Tech Pvt. Ltd. and contributors
// For license information, please see license.txt

//fetch territory from party.
//cur_frm.add_fetch("party", "territory", "destination");

//fetch item name in child table.
cur_frm.add_fetch("inward_sample", "item_code", "item_name");
cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "stock_uom", "uom");
cur_frm.add_fetch("item_code", "item_group", "item_group");

cur_frm.fields_dict["details"].grid.get_field("batch_no").get_query = function (doc, cdt, cdn) {
	let d = locals[cdt][cdn]
	return {
		filters: {
			item_code : d.item_code,
			disabled : 0,
			qty : ['>', 0]
		},
	};
};

frappe.ui.form.on('Outward Sample', {
	setup:frm=>{
		if(frm.doc.party_type == "Opportunity" && frm.doc.party){
			frappe.call({
				method : "jkm_production.jkm_production.doctype.outward_sample.outward_sample.get_opportunity_party_details",
				args :{
					self : frm.doc
				},
				callback:r=>{
					if(frm.doc.docstatus ==0){
						frm.set_value(r.message)
					}
				}
			})
		}
		if(frm.doc.party_type == "Customer"){
			frappe.call({
				method: "jkm_production.api.get_party_details",
				args: {
					party: frm.doc.party,
					party_type: frm.doc.party_type
				},
				callback: function (r) {
					if (r.message && frm.doc.docstatus == 0) {
						frm.set_value(r.message);
					}
				}
			});
		}
		if(frm.doc.party_type == "Quotation"){
			frappe.call({
				method: "jkm_production.jkm_production.doctype.outward_sample.outward_sample.get_quotation_party_details",
				args: {
					self : frm.doc
				},
				callback: function (r) {
					if (r.message && frm.doc.docstatus ==0) {
						frm.set_value(r.message);
					}
				}
			});
		}
	},
	refresh:function(frm){
		if(!frm.doc.satatus){
			frm.set_value("status", 'Pending')
		}
		frm.set_query("party_type", function () {
			return {
				filters: {
					name: ['in', "Customer, Opportunity, Quotation"],
				},
			}
		})
		frm.add_custom_button(__('Create Courier'), function () {
			frappe.model.open_mapped_doc({
				method: "jkm_production.jkm_production.doctype.outward_sample.outward_sample.make_courier_management",
				frm: frm,
			});
		})
	},
	party: function (frm) {
		if(frm.doc.party_type == "Opportunity" && frm.doc.party){
			frappe.call({
				method : "jkm_production.jkm_production.doctype.outward_sample.outward_sample.get_opportunity_party_details",
				args :{
					self : frm.doc
				},
				callback:r=>{
					frm.set_value(r.message)
				}
			})
		}
		if(frm.doc.party_type == "Quotation"){
			frappe.model.get_value("Quotation", frm.doc.party,'customer_name', r=>{
				frm.set_value('party_name', r.customer_name)
			})
		}	
		if(frm.doc.party_type == "Lead"){
			frappe.model.get_value("Lead", frm.doc.party,['company_name', 'first_name', 'salutation'], r=>{
				if(r.company_name){
					frm.set_value('party_name', r.company_name)
				}
				else{
					frm.set_value('party_name', r.salutation + ' ' + r.first_name )
				}
			})
		}
		if(frm.doc.party_type == "Customer"){
			frappe.call({
				method: "jkm_production.api.get_party_details",
				args: {
					party: frm.doc.party,
					party_type: frm.doc.party_type
				},
				callback: function (r) {
					if (r.message) {
						frm.set_value(r.message);
					}
				}
			});
		}
		if(frm.doc.party_type == "Quotation"){
			frappe.call({
				method: "jkm_production.jkm_production.doctype.outward_sample.outward_sample.get_quotation_party_details",
				args: {
					self : frm.doc
				},
				callback: function (r) {
					if (r.message) {
						frm.set_value(r.message);
					}
				}
			});
		}
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
				},
			});
		}
	},
});


