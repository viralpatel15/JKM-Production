// Copyright (c) 2024, viral@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("LC Details", {
	validate(frm) {
        let amount = 0
        let qty = 0
        frm.doc.lc_item_details.forEach(r => {
            amount += r.amount
            qty += r.lc_qty
        });
        frm.set_value("total_lc_amount", amount)
        frm.set_value("total_lc_qty", qty)
	},
});

frappe.ui.form.on("LC Item Details", {
	lc_rate:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt,cdn, "amount", flt(d.lc_rate)*flt(d.lc_qty))
	},
    lc_qty:(frm,cdt,cdn)=>{
        let d = locals[cdt][cdn]
        frappe.model.set_value(cdt,cdn, "amount", flt(d.lc_rate)*flt(d.lc_qty))
    }
});
