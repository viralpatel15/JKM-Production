// Copyright (c) 2023, Finbyz Tech PVT LTD and contributors
// For license information, please see license.txt


frappe.ui.form.on("Journal Entry", {
    onload:function(frm){
        frm.ignore_doctypes_on_cancel_all = ["Forward Contract"];
    }
});