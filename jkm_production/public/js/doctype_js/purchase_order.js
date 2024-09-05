frappe.ui.form.on("Purchase Order",{
    setup:function(frm){
        frm.doc.items.forEach(e => {
            if(e.supplier_quotation_item){
                frappe.call({
                    method:"jkm_production.api.get_supplier_quotation_rate",
                    args:{
                        ref : e.supplier_quotation_item
                    },
                    callback:r=>{
                        frappe.model.set_value(e.doctype, e.docname, 'rate', r.message)
                        frm.refresh_field('items')
                    }
                })
            }
        });
    },
    custom_is_against_sales_order(frm){
        frm.set_query("custom_sales_order", function(doc) {
            return {
                query: "jkm_production.api.get_sales_order",
                filters: {
                    "company": doc.company,
                }
            }
        });
    },
    refresh(frm){
        frm.set_query("custom_sales_order", function(doc) {
            return {
                query: "jkm_production.api.get_sales_order",
                filters: {
                    "company": doc.company,
                }
            }
        });
    },

})

frappe.ui.form.on('Purchase Order Item', {
    qty:(frm, cdt, cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt,cdn, "custom_net_weight", d.qty)
    },
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
    }
})