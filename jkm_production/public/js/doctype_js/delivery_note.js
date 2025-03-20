frappe.ui.form.on('Delivery Note', {
    validate: function(frm) {
        frm.doc.items.forEach(function(d) {
            if (d.qty > 0 && d.custom_package > 0) {
                frappe.model.set_value(d.doctype, d.name, "custom_no_of_package", d.qty / d.custom_package);
            }
        });
    }
})

frappe.ui.form.on('Delivery Note Item', {
	// custom_packing_size:(frm, cdt, cdn)=>{
    //     let d = locals[cdt][cdn]
    //     if(d.custom_packing_size > 0){
    //         frappe.model.set_value(cdt, cdn, "custom_no_of_package", d.qty/d.custom_packing_size)
    //     }
    // },
    qty:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        if(d.qty > 0){
            frappe.model.set_value(cdt, cdn, "custom_no_of_package", d.qty/d.custom_package)
        }
    },
    custom_packing: function(frm, cdt, cdn) {
        let d = locals[cdt][cdn];
        if (d.custom_packing) {
            frappe.db.get_value('Packing', d.custom_packing, 'package')
                .then(r => {
                    if (r.message && r.message.package) {
                        frappe.model.set_value(cdt, cdn, "custom_package", r.message.package);
                    }
                });
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
    }
})