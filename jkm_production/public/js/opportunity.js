
frappe.ui.form.on("Opportunity", {
    
    refresh:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);	
    },
    item_code:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);
    },
    setup:frm=>{
		frm.trigger('party_name')
	},
	party_name:frm=>{
		console.log("eee")
		if(frm.doc.opportunity_from == "Lead"){
			console.log('get')
			frappe.model.get_value("Lead", frm.doc.party_name, ['custom_mobile_number', 'email_id', 'custom_designation'],  r=>{
                frm.set_value('contact_email', r.email_id)
                frm.set_value('contact_mobile', r.custom_mobile_number)
                frm.set_value('job_title', r.custom_designation)
			})
		}
	}
    
})