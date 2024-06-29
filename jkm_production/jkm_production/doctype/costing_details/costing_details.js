// Copyright (c) 2024, viral@fosserp.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("Costing Details", {
    refresh:frm=>{
        frm.set_query("items_quotation", function () {
			return {
				filters: {
					docstatus: 1,
                    custom_quotation_request_for: "Product Quotation"
				},
			};
		});
        frm.set_query("supplier_quotation", function () {
			return {
				filters: {
					docstatus: 1,
                    custom_place_of_delivery:frm.doc.place_of_delivery,
                    custom_port_of_origin:frm.doc.port_of_origin,
                    custom_quotation_request_for: ['!=',"Product Quotation"]
				},
			};
		});
        cur_frm.fields_dict["export_charges"].grid.get_field("item_code").get_query = function (doc, cdt, cdn) {
            return {
                filters: { is_stock_item: 0 },
            };
        };
        cur_frm.fields_dict["shipping_charges"].grid.get_field("item_code").get_query = function (doc, cdt, cdn) {
            return {
                filters: { is_stock_item: 0 },
            };
        };
        frm.set_query("export_quotation", function () {
			return {
				filters: {
					docstatus: 1,
                    custom_port_of_origin :frm.doc.port_of_origin_e,
                    custom_port_of_destination :frm.doc.port_of_destination_e,
                    custom_quotation_request_for: ['!=',"Product Quotation"]
				},
			};
		});
        frm.set_query("supplier_id", function () {
			return {
				filters: {
					is_transporter: 1,
				},
			};
		});
    },
    fetch_details:frm=>{
        if(frm.doc.items_quotation){
            frappe.call({
                method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_item_details",
                args:{
                    docname : frm.doc.items_quotation
                },
                callback:e=>{
                    e.message.items.forEach(element => {
                        let row = frm.add_child("items");
                        row.amount = element.amount
                        row.base_amount = element.base_amount
                        row.base_net_amount = element.base_net_amount
                        row.base_net_rate = element.base_net_rate
                        row.base_price_list_rate = element.base_price_list_rate
                        row.base_rate = element.base_rate
                        row.cess_amount = element.cess_amount
                        row.cess_non_advol_amount = element.cess_non_advol_amount
                        row.cess_non_advol_rate = element.cess_non_advol_rate
                        row.cess_rate = element.cess_rate
                        row.cgst_amount = element.cgst_amount
                        row.cgst_rate = element.cgst_rate
                        row.conversion_factor = element.conversion_factor
                        row.cost_center = element.cost_center
                        row.description =element.description
                        row.discount_amount=element.discount_amount
                        row.discount_percentage= element.discount_percentage
                        row.gst_hsn_code = element.gst_hsn_code
                        row.igst_amount = element.igst_amount
                        row.igst_rate =element.igst_rate
                        row.is_free_item = element.is_free_item
                        row.is_ineligible_for_itc = element.is_ineligible_for_itc
                        row.item_code = element.item_code
                        row.item_group = element.item_group
                        row.item_name = element.item_name
                        row.item_tax_rate = element.item_tax_rate
                        row.item_tax_template = element.item_tax_template
                        row.lead_time_days = element.lead_time_days
                        row.net_amount = element.net_amount
                        row.net_rate = element.net_rate
                        row.pricing_rules = element.pricing_rules
                        row.qty = element.qty
                        row.rate = element.rate
                        row.sgst_amount=element.sgst_amount
                        row.sgst_rate=element.sgst_rate
                        row.stock_qty=element.stock_qty
                        row.stock_uom=element.stock_uom
                        row.taxable_value=element.taxable_value
                        row.total_weight=element.total_weight
                        row.uom=element.uom
                        row.warehouse= element.warehouse
                        row.currency = element.custom_currency
                        row.exchange_rate = element.custom_exchange_rate
                        row.custom_rate_currency = element.custom_rate_currency
                        row.rate = element.rate
                        row.custom_length = element.custom_length
                        row.custom_width = element.custom_width
                        row.custom_height = element.custom_height
                        row.custom_haz = element.custom_haz
                        row.custom_total_packages = element.custom_total_packages
                        row.custom_packing_size = element.custom_packing_size
                        row.weight_per_unit = element.weight_per_unit
                        row.custom_total_cbm= element.custom_total_cbm
                        row.custom_cbm_qty = element.custom_cbm_qty
                        row.custom_packing_type= element.custom_packing_type
                        frappe.model.get_value("Item", row.item_code, ['custom_length', 'custom_width', 'custom_height','custom_packing'], r=> {
                            frappe.model.set_value(row.doctype, row.name, 'custom_length', r.custom_length)
                            frappe.model.set_value(row.doctype, row.name, 'custom_width', r.custom_width)
                            frappe.model.set_value(row.doctype, row.name, 'custom_height', r.custom_height)
                            frappe.model.set_value(row.doctype, row.name, 'custom_packing_type', r.custom_packing)
                        })
                        frm.refresh_field("items");
                    });
                    frm.set_value('total_quantity', e.message.total_qty)
                    frm.set_value('total_amount', e.message.total)
                }
            })
            frm.set_value('items_quotation', '')
        }
        else{
            frm.doc.items = []
            frm.set_value('total_quantity', 0)
            frm.set_value('total_amount', 0)
            frm.refresh_field("items");
        }
    },
    supplier_quotation:frm=>{
        if(frm.doc.supplier_quotation){
            frappe.call({
                method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_item_details",
                args:{
                    docname : frm.doc.supplier_quotation
                },
                callback:e=>{
                    frm.doc.shipping_charges = []
                    e.message.items.forEach(element => {
                        let row = frm.add_child("shipping_charges");
                        row.amount = element.amount
                        row.base_amount = element.base_amount
                        row.base_rate = element.base_rate
                        row.item_code = element.item_code
                        row.item_name = element.item_name
                        row.rate = element.rate
                        frm.refresh_field("shipping_charges");
                    });
                    frm.set_value('total_amount_domestic', e.message.total)
                }
            })
        }
        else{
            frm.doc.shipping_charges = []
            frm.set_value('total_amount_domestic', 0)
            frm.refresh_field("shipping_charges");
        }
    },
    fetch_export_charges:frm=>{
        if(frm.doc.export_quotation){
            let quotation = frm.doc.export_quotation
            frappe.call({
                method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_item_details",
                args:{
                    docname : frm.doc.export_quotation
                },
                callback:e=>{
                    e.message.items.forEach(element => {
                        let row = frm.add_child("export_charges");
                        row.amount = element.amount
                        row.base_amount = element.base_amount
                        row.base_rate = element.base_rate
                        row.item_code = element.item_code
                        row.item_name = element.item_name
                        row.currency = element.custom_currency
                        row.exchange_rate = element.custom_exchange_rate
                        row.rate_currency = element.custom_rate_currency
                        row.rate = element.rate
                        row.quotation_id = quotation
                        frm.refresh_field("export_charges");
                    });
                    frm.set_value('total_amount_e', e.message.total)
                    total_amount_e = 0
                    total_fob_value = 0
                    total_cif_value = 0
                    frm.doc.export_charges.forEach(r=>{
                        console.log(r.base_amount)
                        total_amount_e += r.base_amount
                        if(r.include_in_fob_value){
                            total_fob_value += r.base_amount
                        }else{
                            total_cif_value += r.base_amount
                        }
                    })
                    frm.set_value("total_amount_e", total_amount_e)
                    frm.set_value("total_fob_value", total_fob_value)
                    frm.set_value("total_cif_value", total_cif_value)
                }
            })
            frm.set_value('export_quotation', '')
        }
    }
});


frappe.ui.form.on("Other Charges", {
    charges_amount:frm=>{
        total_charges = 0
        frm.doc.other_charges.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('total_amount_charges', total_charges)
    },
    other_charges_add:frm=>{
        total_charges = 0
        frm.doc.other_charges.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('total_amount_charges', total_charges)
    },
    other_charges_remove:frm=>{
        total_charges = 0
        frm.doc.other_charges.forEach(r=>{
            total_charges += r.charges_amount
        })
        frm.set_value('total_amount_charges', total_charges)
    },
})

frappe.ui.form.on("Supplier Quotation Item", {
    item_code:function(frm, cdt, cdn){
        let d = locals[cdt][cdn]
        frappe.model.get_value("Item", d.item_code, 'stock_uom', r=>{
            if(!d.uom){
                frappe.model.set_value(cdt,cdn,'uom',r.stock_uom)
            }
        })
        frappe.model.get_value("Item", d.item_code, 'custom_packing', r=>{
            if(!d.uom){
                frappe.model.set_value(cdt,cdn,'custom_packing_type',r.custom_packing)
            }
        })
        calculate_cbm(frm, cdt, cdn)
    },
    uom:function(frm,cdt,cdn){
        get_uom_conversion(frm,cdt,cdn)
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
    custom_rate_currency:(frm,cdt,cdn) =>{
        calculate_product_totals(frm, cdt, cdn)
    },
    qty:(frm,cdt,cdn) =>{
        calculate_product_totals(frm, cdt, cdn)
    },
    items_add:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_packing_type){
            frappe.model.get_value("Packing", d.custom_packing_type, 'package', r => {
                frappe.model.set_value(cdt, cdn, 'custom_packing_size', r.package)
            })
        }
        if(d.custom_packing_size){
            frappe.model.set_value(cdt,cdn, 'custom_total_packages', d.qty/d.custom_packing_size)
            if(frm.doc.custom_cost_per_packages){
                frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', d.custom_cost_per_packages * d.custom_packing_size / d.qty)
            }
        }
        calculate_cbm(frm, cdt, cdn)
    },
    custom_cost_per_packages:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        if(d.custom_cost_per_packages && d.custom_total_packages){
            console.log('h')
            frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', (d.custom_cost_per_packages * d.custom_total_packages / d.qty))
        }
    },
    custom_packing_size:(frm, cdt , cdn) => {
        let d = locals[cdt][cdn]
        if(d.custom_cost_per_packages && d.custom_total_packages){
            frappe.model.set_value(cdt, cdn, 'custom_per_qty_pallet_cost', (d.custom_cost_per_packages * d.custom_total_packages / d.qty))
        }
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

})
function get_uom_conversion(frm,cdt,cdn){
    let d = locals[cdt][cdn]
    frappe.call({
        method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_items_conversion_fector",
        args:{
            uom : d.uom,
            item_code : d.item_code
        },
        callback:r=>{
            console.log(r.message)
            frappe.model.set_value(cdt,cdn,'conversion_factor', r.message)
            frappe.model.set_value(cdt,cdn,'stock_qty', r.message * d.qty)
        }
    })
}
function calculate_cbm(frm, cdt, cdn){
    let d = locals[cdt][cdn]
    if(d.parenttype == "Costing Details"){
        let custom_total_cbm = (d.custom_length * d.custom_width * d.custom_height)/1000000 * d.custom_cbm_qty
        frappe.model.set_value(cdt, cdn, 'custom_total_cbm', custom_total_cbm)
        let total_cbm = 0
        frm.doc.items.forEach(r=>{
            total_cbm += r.custom_total_cbm  
        })
        frm.set_value("total_cbm", total_cbm)
    }
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
    export_charges_add:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    export_charges_remove:(frm, cdt, cdn)=>{
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
    export_charges_remove:(frm, cdt, cdn)=>{
        calculate_totals(frm, cdt, cdn)
    },
    export_charges_add:(frm, cdt, cdn)=>{
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
    frm.doc.export_charges.forEach(r=>{
        total_amount_e += r.base_amount
        if(r.include_in_fob_value){
            total_fob_value += r.base_amount
        }else{
            total_cif_value += r.base_amount
        }
    })
    frm.set_value("total_amount_e", total_amount_e)
    frm.set_value("total_fob_value", total_fob_value)
    frm.set_value("total_cif_value", total_cif_value)
}

frappe.ui.form.on('Local Transport Charges', {
    rate:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.amount)
        total_amount_domestic = 0 
        frm.doc.shipping_charges.forEach(r=>{
            total_amount_domestic += r.base_amount
        })
        frm.set_value('total_amount_domestic', total_amount_domestic)
    },
    shipping_charges_add:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        total_amount_domestic = 0 
        frm.doc.shipping_charges.forEach(r=>{
            total_amount_domestic += r.base_amount
        })
        frm.set_value('total_amount_domestic', total_amount_domestic)
    },
    shipping_charges_remove:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        total_amount_domestic = 0 
        frm.doc.shipping_charges.forEach(r=>{
            total_amount_domestic += r.base_amount
        })
        frm.set_value('total_amount_domestic', total_amount_domestic)
    }
    
})

function calculate_product_totals(frm, cdt, cdn){
    let d = locals[cdt][cdn]
    if(d.parenttype == "Costing Details"){
    if(!d.custom_currency){
        frappe.model.set_value(cdt, cdn, 'custom_currency', 'INR') 
    }
    if(!d.custom_exchange_rate){
        frappe.model.set_value(cdt, cdn, 'custom_exchange_rate', 1) 
    }
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_exchange_rate * d.custom_rate_currency)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate * d.qty)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.amount)
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate) 
        frappe.model.set_value(cdt, cdn, 'net_rate', d.rate) 
        frappe.model.set_value(cdt, cdn, 'net_amount', d.amount)
        frappe.model.set_value(cdt, cdn, 'base_net_amount', d.net_amount)
        frappe.model.set_value(cdt, cdn, 'base_net_rate', d.net_rate)
        frappe.model.set_value(cdt, cdn, 'taxable_value', d.base_net_amount)
    }
}
