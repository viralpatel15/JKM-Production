
frappe.ui.form.on("Opportunity", {
    
    refresh:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);
        frm.save()	
    },
    item_code:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);
    },
    setup:frm=>{
		frm.trigger('party_name')
	},
	party_name:frm=>{
		if(frm.doc.opportunity_from == "Lead"){
			console.log('get')
			frappe.model.get_value("Lead", frm.doc.party_name, ['custom_mobile_number', 'email_id', 'custom_designation'],  r=>{
                if(!frm.doc.contact_email){
                    frm.set_value('contact_email', r.email_id)
                }
                if(!frm.doc.contact_mobile){
                    frm.set_value('contact_mobile', r.custom_mobile_number)
                }
                if(!frm.doc.job_title){
                    frm.set_value('job_title', r.custom_designation)
                }
			})
		}
	}
    
})