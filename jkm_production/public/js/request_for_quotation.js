frappe.ui.form.on("Request for Quotation", {
	refresh: function (frm, cdt, cdn) {
		if (!frappe.user.has_role('Sales JKM')){
			frm.add_custom_button(('Quotation Analisys JKM'), () => {
				let url = frappe.urllib.get_full_url(`/app/query-report/Quotation%20Analysis%20JKM?request_for_quotation=${frm.doc.name}&group_by=Group+by+Supplier`)
				// window.open(`https://chem.fosscrm.com/app/query-report/Quotation%20Analysis%20JKM?request_for_quotation=${frm.doc.name}&group_by=Group+by+Supplier`)
				window.open(url)
			},("View"))
		}
		if(frappe.user.has_role('Sales JKM')){
			frm.remove_custom_button("Link To Material Requests", "Tools")
			frm.remove_custom_button("Get Suppliers", "Tools")
		}
	},
	onload:(frm)=>{
		if(frappe.user.has_role('Sales JKM')){
			frm.remove_custom_button("Link To Material Requests", "Tools")
			frm.remove_custom_button("Get Suppliers", "Tools")
		}
	}
});
frappe.ui.form.on("Request for Quotation Supplier", {
	suppliers_add:function(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.supplier){
			fetch_contact(frm,cdt,cdn)
		}
	},
	supplier: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.call({
			method: "erpnext.accounts.party.get_party_details",
			args: {
				party: d.supplier,
				party_type: "Supplier",
			},
			callback: function (r) {
				if (r.message) {
					console.log(r.message)
					frappe.model.set_value(cdt, cdn, "contact", r.message.contact_person);
					frappe.model.set_value(cdt, cdn, "email_id", r.message.contact_email);
					frappe.model.set_value(cdt, cdn, "custom_mobile_no", r.message.contact_mobile);
				}
			},
		});
	},
});

function fetch_contact(frm,cdt,cdn){
	var d = locals[cdt][cdn];
		frappe.call({
			method: "erpnext.accounts.party.get_party_details",
			args: {
				party: d.supplier,
				party_type: "Supplier",
			},
			callback: function (r) {
				if (r.message) {
					console.log(r.message.contact_phone)
					frappe.model.set_value(cdt, cdn, "contact", r.message.contact_person);
					frappe.model.set_value(cdt, cdn, "email_id", r.message.contact_email);
					frappe.model.set_value(cdt, cdn, "custom_mobile_no", r.message.contact_mobile);
					
				}
			},
		});
}