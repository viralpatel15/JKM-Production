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
            frm.refresh_field('custom_transporter_name')
        })
        if(frm.doc.custom_transporter){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_transporter_contact_detail",
                args:{
                    transporter : frm.doc.custom_transporter
                },
                callback:(r)=>{
                    frm.set_value(r.message)
                }
            })
        }
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
    },
    custom_contact:(frm)=>{
        if(!frm.doc.custom_contact){
            frm.set_value("custom_contact", '')
            frm.set_value("custom_contact_person_name", "")
            frm.set_value("custom_mobile_no", '')
            frm.set_value("custom_email_id",'')
        }
        if(frm.doc.custom_contact){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_contact_detail",
                args:{
                    contact : frm.doc.custom_contact
                },
                callback:(r)=>{
                    if(r.message){
                        frm.set_value(r.message)
                    }
                    else{
                        frm.set_value("custom_contact", '')
                        frm.set_value("custom_contact_person_name", "")
                        frm.set_value("custom_mobile_no", '')
                        frm.set_value("custom_email_id",'')
                    }
                }
            })
        }
    },
    custom_contact_1:(frm)=>{
        if(!frm.doc.custom_contact_1){
            frm.set_value("custom_contact_person_name_1", '')
            frm.set_value("custom_mobile_no_1", '')
            frm.set_value("custom_email_id_1",'')
        }
        if(frm.doc.custom_contact_1){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_contact_detail",
                args:{
                    contact : frm.doc.custom_contact_1
                },
                callback:(r)=>{
                    if(r.message){
                        console.log(r.message)
                        frm.set_value("custom_contact_person_name_1", r.message.custom_contact_person_name)
                        frm.set_value("custom_mobile_no_1", r.message.custom_mobile_no)
                        frm.set_value("custom_email_id_1",r.message.custom_email_id)
                    }
                    else{
                        frm.set_value("custom_contact_person_name_1", '')
                        frm.set_value("custom_mobile_no_1", '')
                        frm.set_value("custom_email_id_1",'')
                    }
                }
            })
        }
    },
    custom_transporter_1:(frm)=>{
        frappe.model.get_value("Supplier", frm.doc.custom_transporter_1, "supplier_name", r=>{
            frm.set_value("custom_transporter_name1", r.supplier_name)
            frm.refresh_field('custom_transporter_name1')
        })
        if(frm.doc.custom_transporter_1){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_transporter_contact_detail",
                args:{
                    transporter : frm.doc.custom_transporter_1
                },
                callback:(r)=>{
                    frm.set_value("custom_contact_1", r.message.custom_contact)
                    frm.refresh_field("custom_contact_1")
                }
            })
        }
    },
    custom_transporter_3:(frm)=>{
        frappe.model.get_value("Supplier", frm.doc.custom_transporter_3, "supplier_name", r=>{
            frm.set_value("custom_transporter_name_3", r.supplier_name)
            frm.refresh_field('custom_transporter_name_3')
        })
        if(frm.doc.custom_transporter_3){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_transporter_contact_detail",
                args:{
                    transporter : frm.doc.custom_transporter_3
                },
                callback:(r)=>{
                    frm.set_value("custom_contact_3", r.message.custom_contact)
                    frm.refresh_field("custom_contact_3")
                }
            })
        }
    },
    custom_contact_3:(frm)=>{
        if(!custom_contact_3){
            frm.set_value("custom_contact_person_name_3", '')
            frm.set_value("custom_mobile_no_3", '')
            frm.set_value("custom_email_id_3", '')
        }
        if(frm.doc.custom_contact_1){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_contact_detail",
                args:{
                    contact : frm.doc.custom_contact_1
                },
                callback:(r)=>{
                    if(r.message){
                        console.log(r.message)
                        frm.set_value("custom_contact_person_name_3", r.message.custom_contact_person_name)
                        frm.set_value("custom_mobile_no_3", r.message.custom_mobile_no)
                        frm.set_value("custom_email_id_3",r.message.custom_email_id)
                    }
                    else{
                        frm.set_value("custom_contact_person_name_3", '')
                        frm.set_value("custom_mobile_no_3", '')
                        frm.set_value("custom_email_id_3", '')
                    }
                }
            })
        }
    },


})

cur_frm.fields_dict["custom_transporter_1"].get_query = function (doc) {
	// filter on Account
	return {
		filters: {
			is_transporter : 1
		},
	};
};
cur_frm.fields_dict["custom_transporter_3"].get_query = function (doc) {
	// filter on Account
	return {
		filters: {
			is_transporter : 1
		},
	};
};
cur_frm.fields_dict["custom_transporter"].get_query = function (doc) {
	// filter on Account
	return {
		filters: {
			is_transporter : 1
		},
	};
};
frappe.ui.form.on("Supplier Quotation Item", {
    items_add:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
            if(frm.doc.custom_cost_per_packages){
                frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', d.custom_cost_per_packages * d.custom_packing_size / d.qty)
            }
        }
        calculate_cbm(frm, cdt, cdn)
    },
    custom_length:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
        calculate_cbm(frm,cdt,cdn)
    },
    custom_width:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
        calculate_cbm(frm,cdt,cdn)
    },
    custom_height:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, "custom_per_package_cbm", (flt(d.custom_length)*flt(d.custom_width)*flt(d.custom_height))/1000000)
        calculate_cbm(frm,cdt,cdn)
    },
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
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
        }
    },
   
    custom_cbm_qty:(frm, cdt, cdn)=>{
        calculate_cbm(frm, cdt, cdn)
    },
    custom_packing_size:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
        }
        if(d.custom_cost_per_packages && d.custom_total_packages){
            frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', (d.custom_cost_per_packages * d.custom_total_packages / d.qty))
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
            frappe.model.set_value(d.doctype, d.name, "custom_exchange_rate", 1)
        }
        if(!d.custom_currency){
            frappe.model.set_value(d.doctype, d.name, "custom_currency", 'INR')
        }
        calculate_cbm(frm,cdt,cdn)
    },
    custom_cost_per_packages:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_cost_per_packages && d.custom_total_packages){
            frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', (d.custom_cost_per_packages * d.custom_total_packages / d.qty))
        }
    },
    custom_interest_in_percentage:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        custom_total_fob_value = flt(d.rate) + flt(d.custom_local_transport_charges) + flt(d.custom_other_charges) + flt(d.custom_shipping_fob)
        frappe.model.set_value(cdt,cdn,'custom_interest_', (custom_total_fob_value * d.custom_interest_in_percentage/100))
        custom_total_fob_value = flt(d.rate) + flt(d.custom_local_transport_charges) + flt(d.custom_interest_) + flt(d.custom_other_charges) + flt(d.custom_shipping_fob)
        frappe.model.set_value(cdt,cdn,'custom_total_fob_value',custom_total_fob_value)
        frappe.model.set_value(cdt,cdn,"custom_total_cif_value",(flt(d.custom_total_fob_value) + flt(d.custom_cif_charges)))
        frappe.model.set_value(cdt,cdn,"custom_final_rate", (d.custom_margin+d.custom_total_cif_value))
    },
    custom_interest_:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        custom_total_fob_value = flt(d.rate) + flt(d.custom_local_transport_charges) + flt(d.custom_interest_) + flt(d.custom_other_charges) + flt(d.custom_shipping_fob)
        frappe.model.set_value(cdt,cdn,'custom_total_fob_value',custom_total_fob_value)
        frappe.model.set_value(cdt,cdn,"custom_total_cif_value",(flt(d.custom_total_fob_value) + flt(d.custom_cif_charges)))
        frappe.model.set_value(cdt,cdn,"custom_final_rate", (d.custom_margin+d.custom_total_cif_value))
    },
    custom_margin:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt,cdn, "custom_final_rate", d.custom_margin + d.custom_total_cif_value)
    }
})

function calculate_cbm(frm, cdt, cdn){
    let d = locals[cdt][cdn]
        let custom_total_cbm = (d.custom_length * d.custom_width * d.custom_height)/1000000
        frappe.model.set_value(cdt, cdn, 'custom_per_package_cbm', custom_total_cbm)
        frappe.model.set_value(cdt , cdn, "custom_total_cbm_of_package", (flt(custom_total_cbm) * flt(d.custom_total_packages)))
        let total_cbm = 0
        frm.doc.items.forEach(r=>{
            total_cbm += r.custom_total_cbm_of_package  
        })
        frm.set_value("custom_total_cbm", total_cbm)
    
}

function calculate_transporter_charges(frm){
    let ltch = flt(frm.doc.custom_local_transport_charges_at_origin) + flt(frm.doc.custom_transporter_changers_) + flt(frm.doc.custom_local_transport_charges_at_designation)  + flt(frm.doc.custom_loading_charges_at_origin) + flt(frm.doc.custom_other_charges) + flt(frm.doc.custom_unloading_at_destination_)
    frm.set_value('custom_total_transportation_expenses', ltch)
}


frappe.ui.form.on("Export Charges", {
    rate:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.rate_currency)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.rate * d.exchange_rate )
        calculate_totals(frm, cdt, cdn)
    }, 
    amount:(frm,cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'base_amount', d.amount * d.exchange_rate)
        calculate_totals(frm, cdt, cdn)
    },
    rate_currency:function(frm,cdt, cdn){
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.rate_currency)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.amouont * d.exchange_rate)
        calculate_totals(frm, cdt, cdn)
    },
    custom_export_charges_add:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    custom_export_charges_add:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    exchange_rate:(frm, cdt, cdn) =>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.rate_currency)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.rate * d.exchange_rate)
        calculate_totals(frm, cdt, cdn)
    },
    custom_rate:(frm, cdt, cdn) =>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.rate_currency)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.rate * d.exchange_rate)
        calculate_totals(frm, cdt, cdn)
    },
    custom_export_charges_add:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    custom_export_charges_add:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    include_in_fob_value:(frm,cdt,cdn)=>{
        calculate_totals(frm, cdt, cdn)
    }
})

function calculate_totals(frm , cdt, cdn){
    let d = locals[cdt][cdn]
    total_amount_e = 0
    total_fob_value = 0
    total_cif_value = 0
    frm.doc.custom_export_charges.forEach(r=>{
        total_amount_e += r.base_amount
        if(r.include_in_fob_value){
            total_fob_value += r.base_amount
        }else{
            total_cif_value += r.base_amount
        }
    })
    frm.set_value("custom_total_amount_e", total_amount_e)
    frm.set_value("custom_total_fob_value", total_fob_value)
    frm.set_value("custom_total_cif_value", total_cif_value)
}

frappe.ui.form.on("Other Charges", {
    charges_amount:frm=>{
        total_charges = 0
        frm.doc.custom_packing_chagres.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('custom_total_packing_charges', total_charges)
    },
    custom_packing_chagres_add:frm=>{
        total_charges = 0
        frm.doc.custom_packing_chagres.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('custom_total_packing_charges', total_charges)
    },
    custom_packing_chagres_remove:frm=>{
        total_charges = 0
        frm.doc.custom_packing_chagres.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('custom_total_packing_charges', total_charges)
    },
})