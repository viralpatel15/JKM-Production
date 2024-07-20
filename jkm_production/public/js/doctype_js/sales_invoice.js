// Copyright (c) 2023, Finbyz Tech PVT LTD and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Invoice', {
	custom_notify_party_address:frm=>{
		erpnext.utils.get_address_display(frm, "custom_notify_party_address", "custom_notify_party_address_details", false);
	}
})

frappe.ui.form.on('Sales Invoice Item', {
	custom_packing_size:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_size > 0){
            frappe.model.set_value(cdt, cdn, "custom_no_of_package", d.qty/d.custom_packing_size)
        }
    },
    custom_per_package_weight:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_per_package_weight > 0){
            frappe.model.set_value(cdt, cdn, "custom_total_weight_of_package", flt(d.custom_no_of_package) * flt(d.custom_per_package_weight))
        }
    },
    custom_net_weight:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_net_weight > 0){
            frappe.model.set_value(cdt, cdn, "custom_gross_weight", flt(d.custom_total_weight_of_package) + flt(d.custom_net_weight))
        }
    },
    custom_length:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
    },
    custom_width:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
    },
    custom_height:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
    },
    custom_per_package_cbm:(frm,cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_total_cbm_of_package", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000 * d.custom_no_of_package)
    },
    freight:function(frm,cdt,cdn){
	
    calculate_total_fob_value(frm, cdt, cdn)
    },
    insurance:function(frm,cdt,cdn){
    
    calculate_total_fob_value(frm, cdt, cdn)
    },
    duty_drawback_rate:function(frm,cdt,cdn){
    
    calculate_total_fob_value(frm, cdt, cdn)
    },
    meis_rate:function(frm,cdt,cdn){
    
    calculate_total_fob_value(frm, cdt, cdn)
    },
})

function calculate_total_fob_value(frm, cdt, cdn){
	let d=locals[cdt][cdn]
	if(frm.doc.currency=='INR'){
		frappe.model.set_value(cdt,cdn,'fob_value',d.base_amount-(d.insurance+d.freight))
		frappe.model.set_value(cdt,cdn,'fob_value_inr',d.base_amount-(d.insurance+d.freight))
		frappe.model.set_value(cdt,cdn,'duty_drawback_amount',d.fob_value_inr*d.duty_drawback_rate/100)
		frappe.model.set_value(cdt,cdn,'meis_value',d.fob_value_inr*d.meis_rate/100)
	}
	if(frm.doc.currency != 'INR'){
		frappe.model.set_value(cdt,cdn,'fob_value',d.amount-(d.freight+d.insurance))
		frappe.model.set_value(cdt,cdn,'fob_value_inr',d.base_amount-(d.freight*frm.doc.conversion_rate+frm.doc.conversion_rate*d.insurance)) 
		frappe.model.set_value(cdt,cdn,'duty_drawback_amount',d.fob_value_inr*d.duty_drawback_rate/100)
		frappe.model.set_value(cdt,cdn,'meis_value',d.fob_value_inr*d.meis_rate/100)
	}

}
