frappe.ui.form.on("Supplier Quotation", {
    refresh:(frm)=>{
        frm.doc.items.forEach(e => {
            console.log("gey")
            if(!e.custom_exchange_rate){
                console.log("enter")
                frappe.model.set_value(e.doctype, e.name, "custom_exchange_rate", 1)
            }
            if(!e.custom_currency){
                frappe.model.set_value(e.doctype, e.name, "custom_currency", 'INR')
            }
        });
        frm.refresh_field("items")
    }
})

frappe.ui.form.on("Supplier Quotation Item", {
    custom_rate_currency:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_rate_currency * d.custom_exchange_rate)
    },
    custom_exchange_rate:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt, cdn, 'rate', d.custom_rate_currency * d.custom_exchange_rate)
    },
    items_add:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        if(!d.custom_exchange_rate){
            console.log("enter")
            frappe.model.set_value(e.doctype, e.name, "custom_exchange_rate", 1)
        }
        if(!d.custom_currency){
            frappe.model.set_value(e.doctype, e.name, "custom_currency", 'INR')
        }
    },
    items_remove:(frm, cdt, cdn) => {
        let d = locals[cdt][cdn]
        if(!d.custom_exchange_rate){
            console.log("enter")
            frappe.model.set_value(e.doctype, e.name, "custom_exchange_rate", 1)
        }
        if(!d.custom_currency){
            frappe.model.set_value(e.doctype, e.name, "custom_currency", 'INR')
        }
    },
})