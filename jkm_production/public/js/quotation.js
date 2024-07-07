
frappe.ui.form.on("Quotation", {
	refresh : function (frm){
        frm.add_custom_button(__("Request For Sample"), () => {
            frappe.model.open_mapped_doc({
                method: "jkm_production.api.make_courier_management",
                frm: frm,
            });
        },__("Create"));
    }
})