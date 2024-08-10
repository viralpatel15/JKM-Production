frappe.ui.form.on("Supplier Quotation", {
    refresh:(frm)=>{

        frm.doc.items.forEach(e => {
            if(!e.custom_exchange_rate){
                frappe.model.set_value(e.doctype, e.name, "custom_exchange_rate", 1)
            }
            if(!e.custom_currency){
                frappe.model.set_value(e.doctype, e.name, "custom_currency", 'INR')
            }
        });
        frm.refresh_field("items")
    },
    custom_transporter:(frm)=>{
        frappe.model.get_value("Supplier", frm.doc.custom_transporter, "supplier_name", r=>{
            frm.set_value("custom_transporter_name", r.supplier_name)
        })
    },
    custom_transporter_changers_:(frm)=>{
        calculate_transporter_charges(frm)
    },
    custom_unloading_at_destination_:(frm)=>{
        calculate_transporter_charges(frm)
    },
    custom_local_transport_charges_at_designation:(frm)=>{
        calculate_transporter_charges(frm)
    },
    custom_local_transport_charges_at_origin:(frm)=>{
        calculate_transporter_charges(frm)
    },
    custom_loading_charges_at_origin:(frm)=>{
        calculate_transporter_charges(frm)
    },
    custom_other_charges:(frm)=>{
        calculate_transporter_charges(frm)
    }


})

cur_frm.fields_dict["custom_transporter"].get_query = function (doc) {
	// filter on Account
	return {
		filters: {
			is_transporter : 1
		},
	};
};
frappe.ui.form.on("Supplier Quotation Item", {
    custom_rate_currency:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_rate_currency * d.custom_exchange_rate)
    },
    custom_exchange_rate:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_rate_currency * d.custom_exchange_rate)
    },
    qty:(frm,cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_rate_currency * d.custom_exchange_rate)
        frappe.model.set_value(cdt, cdn, 'price_list_rate', d.custom_rate_currency * d.custom_exchange_rate)
        calculate_cbm(frm,cdt,cdn)
    },  
    custom_packing_type:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_type){
            frappe.model.get_value("Packing", d.custom_packing_type, 'package', r => {
                frappe.model.set_value(cdt, cdn, 'custom_packing_size', r.package)
            })
        }
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
        }
    },
    custom_length:(frm, cdt, cdn)=>{
        calculate_cbm(frm, cdt, cdn)
    },
    custom_width:(frm, cdt, cdn)=>{
        calculate_cbm(frm, cdt, cdn)
    },
    custom_height:(frm, cdt, cdn)=>{
        calculate_cbm(frm, cdt, cdn)
    },
    custom_cbm_qty:(frm, cdt, cdn)=>{
        calculate_cbm(frm, cdt, cdn)
    },
    custom_packing_size:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
        }
    },
    items_add:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        if(!d.custom_exchange_rate){
            frappe.model.set_value(d.doctype, d.name, "custom_exchange_rate", 1)
        }
        if(!d.custom_currency){
            frappe.model.set_value(d.doctype, d.name, "custom_currency", 'INR')
        }
        calculate_cbm(frm,cdt,cdn)
    },
    items_remove:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        if(!d.custom_exchange_rate){
            console.log("enter")
            frappe.model.set_value(d.doctype, d.name, "custom_exchange_rate", 1)
        }
        if(!d.custom_currency){
            frappe.model.set_value(d.doctype, d.name, "custom_currency", 'INR')
        }
        calculate_cbm(frm,cdt,cdn)
    },

})

function calculate_cbm(frm, cdt, cdn){
    let d = locals[cdt][cdn]
    if(d.parenttype == "Supplier Quotation"){
        let custom_total_cbm = (d.custom_length * d.custom_width * d.custom_height)/1000000 * d.custom_cbm_qty
        frappe.model.set_value(cdt, cdn, 'custom_total_cbm', custom_total_cbm)
        let total_cbm = 0
        frm.doc.items.forEach(r=>{
            total_cbm += r.custom_total_cbm  
        })
        frm.set_value("custom_total_cbm", total_cbm)
    }
}

function calculate_transporter_charges(frm){
    let ltch = flt(frm.doc.custom_local_transport_charges_at_origin)+flt(frm.doc.custom_transporter_changers_) + flt(frm.doc.custom_transporter_changers_) + flt(frm.doc.custom_local_transport_charges_at_designation) + flt(frm.doc.custom_local_transport_charges_at_designation) + flt(frm.doc.custom_loading_charges_at_origin) + flt(frm.doc.custom_other_charges) + flt(frm.doc.custom_unloading_at_destination_)
    frm.set_value('custom_total_transportation_expenses', ltch)
}