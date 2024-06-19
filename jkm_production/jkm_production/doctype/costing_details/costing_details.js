// Copyright (c) 2024, viral@fosserp.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("Costing Details", {
    refresh:frm=>{
        frm.set_query("items_quotation", function () {
			return {
				filters: {
					docstatus: 1,
				},
			};
		});
        frm.set_query("supplier_quotation", function () {
			return {
				filters: {
					docstatus: 1,
                    supplier:frm.doc.supplier
				},
			};
		});
        cur_frm.fields_dict["export_charges"].grid.get_field("item_code").get_query = function (doc, cdt, cdn) {
            return {
                filters: { is_stock_item: 0 },
            };
        };
        frm.set_query("export_quotation", function () {
			return {
				filters: {
					docstatus: 1,
                    supplier:frm.doc.supplier_id
				},
			};
		});
        frm.set_query("supplier", function () {
			return {
				filters: {
					is_transporter: 1,
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
    items_quotation:frm=>{
        if(frm.doc.items_quotation){
            frappe.call({
                method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_item_details",
                args:{
                    docname : frm.doc.items_quotation
                },
                callback:e=>{
                    frm.doc.items = []
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
                        row.weight_per_unit=element.weight_per_unit
                        frm.refresh_field("items");
                    });
                    frm.set_value('total_quantity', e.message.total_qty)
                    frm.set_value('total_amount', e.message.total)
                    frm.set_value('total_taxes_and_charges_d', e.message.total_taxes_and_charges)
                    frm.set_value('grand_total_d', e.message.grand_total)
                }
            })
        }
        else{
            frm.doc.items = []
            frm.set_value('total_quantity', 0)
            frm.set_value('total_amount', 0)
            frm.set_value('total_taxes_and_charges_d', 0)
            frm.set_value('grand_total_d', 0)
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
                    frm.set_value('taxes_and_charges', e.message.total_taxes_and_charges)
                    frm.set_value('grand_total', e.message.grand_total)
                }
            })
        }
        else{
            frm.doc.shipping_charges = []
            frm.set_value('total_amount_domestic', 0)
            frm.set_value('taxes_and_charges', 0)
            frm.set_value('grand_total', 0)
            frm.refresh_field("shipping_charges");
        }
    },
    export_quotation:frm=>{
        if(frm.doc.export_quotation){
            frappe.call({
                method:"jkm_production.jkm_production.doctype.costing_details.costing_details.get_item_details",
                args:{
                    docname : frm.doc.export_quotation
                },
                callback:e=>{
                    frm.doc.export_charges = []
                    e.message.items.forEach(element => {
                        let row = frm.add_child("export_charges");
                        row.amount = element.amount
                        row.base_amount = element.base_amount
                        row.base_rate = element.base_rate
                        row.item_code = element.item_code
                        row.item_name = element.item_name
                        row.rate = element.rate
                        frm.refresh_field("export_charges");
                    });
                    frm.set_value('total_amount_e', e.message.total)
                    frm.set_value('total_taxes_and_charges', e.message.total_taxes_and_charges)
                    frm.set_value('grand_total_e', e.message.grand_total)
                }
            })
        }
        else{
            frm.doc.export_quotation = []
            frm.set_value('total_amount_e', 0)
            frm.set_value('total_taxes_and_charges', 0)
            frm.set_value('grand_total_e', 0)
            frm.refresh_field("export_charges");
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

frappe.ui.form.on("Export Charges", {
    rate:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'base_rate', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'base_amount', d.rate * d.exchange_rate)
        frappe.model.set_value(cdt, cdn, 'amount', d.rate)
        calculate_totals(frm, cdt, cdn)
    }, 
    amount:(frm,cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'base_amount', d.amount * d.exchange_rate)
        calculate_totals(frm, cdt, cdn)
    }
})

function calculate_totals(frm , cdt, cdn){
    let d = locals[cdt][cdn]
    total_amount_e = 0
    frm.doc.export_charges.forEach(r=>{
        total_amount_e += d.base_amount
    })
    frm.set_value("total_amount_e", total_amount_e)
    frm.set_value("grand_total_e", total_amount_e + flt(frm.doc.total_taxes_and_charges))
}

