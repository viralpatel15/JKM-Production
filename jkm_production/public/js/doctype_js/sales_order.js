// Copyright (c) 2023, Finbyz Tech PVT LTD and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Order', {
	refresh:frm=>{

    }
})


frappe.ui.form.on('Sales Order Item', {
	custom_packing_size:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        console.log("he;llo")
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
        frappe.model.set_value(cdt, cdn, "custom_total_cbm_of_package", flt(d.custom_per_package_cbm) * (d.custom_no_of_package))
    }
})

