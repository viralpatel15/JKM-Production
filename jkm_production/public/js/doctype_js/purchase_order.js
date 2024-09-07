frappe.ui.form.on("Purchase Order",{
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
    supplier(frm){
        if(!frm.doc.supplier){
            frm.add_custom_button(__("Get Supplier"), () => {
                frm.doc.items.forEach(e => {
                    frappe.model.get_value("Supplier Quotation", e.supplier_quotation, 'supplier', r=>{
                        frm.set_value('supplier', r.supplier)
                    })
                });
            });
        }
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
    refresh(frm){
        if (!frm.doc.supplier){
            frm.add_custom_button(__("Get Supplier"), () => {
                frm.doc.items.forEach(e => {
                    frappe.model.get_value("Supplier Quotation", e.supplier_quotation, 'supplier', r=>{
                        frm.set_value('supplier', r.supplier)
                    })
                });
            });
        }
        frm.set_query("custom_sales_order", function(doc) {
            return {
                query: "jkm_production.api.get_sales_order",
                filters: {
                    "company": doc.company,
                }
            }
        });
        frm.set_query("custom_contact_1", function () {
			if (frm.doc.custom_transporter_1) {
				return {
					query: "frappe.contacts.doctype.contact.contact.contact_query",
					filters: {
						link_doctype: "Supplier",
						link_name: frm.doc.custom_transporter_1,
					},
				};
			}
		});
        frm.set_query("custom_contact", function () {
			if (frm.doc.custom_transporter) {
				return {
					query: "frappe.contacts.doctype.contact.contact.contact_query",
					filters: {
						link_doctype: "Supplier",
						link_name: frm.doc.custom_transporter,
					},
				};
			}
		});
        frm.set_query("custom_contact_3", function () {
			if (frm.doc.custom_transporter_3) {
				return {
					query: "frappe.contacts.doctype.contact.contact.contact_query",
					filters: {
						link_doctype: "Supplier",
						link_name: frm.doc.custom_transporter_3,
					},
				};
			}
		});
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
        if(!frm.doc.custom_contact_3){
            frm.set_value("custom_contact_person_name_3", '')
            frm.set_value("custom_mobile_no_3", '')
            frm.set_value("custom_email_id_3", '')
        }
        if(frm.doc.custom_contact_3){
            frappe.call({
                method:"jkm_production.jkm_production.doc_events.supplier_quotation.get_contact_detail",
                args:{
                    contact : frm.doc.custom_contact_3
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