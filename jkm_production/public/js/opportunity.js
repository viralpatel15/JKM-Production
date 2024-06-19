
frappe.ui.form.on("Opportunity", {
    
    refresh:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);	
    },
    item_code:(frm, cdt, cdn)=>{
        frm.fields_dict['items'].grid.update_docfield_property('rate', 'reqd', 1);		
        frm.fields_dict['items'].grid.update_docfield_property('amount', 'reqd', 1);
    }
    
})