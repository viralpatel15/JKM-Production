// Copyright (c) 2018, Finbyz Tech Pvt Ltd and contributors
// For license information, please see license.txt
//fetch territory from party.
// cur_frm.add_fetch("party", "territory", "destination");
cur_frm.fields_dict["sample_details"].grid.get_field("batch_no").get_query = function (doc, cdt, cdn) {
	let d = locals[cdt][cdn]
	return {
		filters: {
			item_code : d.item_code
		},
	};
};
frappe.ui.form.on('Inward Sample', {
	refresh: function (frm) {
		frm.set_query("supplier_address", function (doc) {
			if(!frm.doc.supplier){
				frappe.throw("Please set first supplier")
			}
			return {
				query: "frappe.contacts.doctype.address.address.address_query",
				filters: { link_doctype: "Supplier", link_name: doc.supplier }
			};
		});
		if(frm.doc.docstatus == 1){
			frm.add_custom_button(
				__("Create Outward Sample"),
				function () {
					frappe.model.open_mapped_doc({
						method: "jkm_production.jkm_production.doctype.inward_sample.inward_sample.create_outward_sample",
						frm: frm,
					});
				},
			);
		}
	},
	party: function (frm) {
		if (frm.doc.supplier) {
			frappe.call({
				method: "jkm_production.api.get_party_details",
				args: {
					party: frm.doc.supplier,
					party_type: "Supplier"
				},
				callback: function (r) {
					if (r.message) {
						frm.set_value('contact_person', r.message.contact_person)
						frm.set_value('contact_display', r.message.contact_display)
						frm.set_value('contact_mobile', r.message.contact_mobile)
						frm.set_value('contact_email', r.message.contact_email)
						frm.set_value('address_display', r.message.address_display)
						frm.set_value('supplier_name', r.message.party_name)
						frm.set_value('supplier_address', r.message.supplier_address)
					}
				}
			});
		}
	},
	supplier:frm=>{
		frm.set_query("contact_person", function (doc) {
			return {
				query: "frappe.contacts.doctype.contact.contact.contact_query",
				filters: { link_doctype: "Supplier", link_name: doc.supplier }
			};
		});
		frm.set_query('supplier_address', erpnext.queries.address_query);
		frm.set_query("supplier_address", function (doc) {
			return {
				query: "frappe.contacts.doctype.address.address.address_query",
				filters: { link_doctype: "Supplier", link_name: doc.supplier }
			};
		});
		frm.trigger("party")
	},
	contact_person: erpnext.utils.get_contact_details,
	supplier_address(frm) {
		if(!frm.doc.supplier){
			frappe.throw("Please set first supplier")
		}
		erpnext.utils.get_address_display(frm);
	}
});


frappe.ui.form.on('Inward Sample Details', {
	create_qc: (frm, cdt, cdn)=>{
		let d = locals[cdt][cdn]
		frappe.new_doc("Quality Inspection",{
			"reference_name" : d.parent,
			"reference_type" : "Inward Sample",
			"item_code" : d.item_code,
			"item_name" : d.item_name,
			"custom_table_ref":d.name,
			"inspected_by":frappe.session.user,
			"custom_batch_no_ref":d.batch_no
		})
	}
})

