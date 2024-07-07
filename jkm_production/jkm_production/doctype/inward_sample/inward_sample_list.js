// Copyright (c) 2015, Frappe Technologies Pvt. td. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings["Inward Sample"] = {
	add_fields: [
		"supplier_name"
	],
	get_indicator: function (doc) {
		if(doc.status == "Draft"){
			return [__(doc.status), "red", "status,=," + doc.status];
		}else if(doc.status == "Requested"){
			return [__(doc.status), "blue", "status,=," + doc.status];
		}else if(doc.status == "Ordered"){
			return [__(doc.status), "green", "status,=," + doc.status];
		}else if(doc.status == "Dispatched"){
			return [__(doc.status), "orange", "status,=," + doc.status];
		}else if(doc.status == "Delivered"){
			return [__(doc.status), "green", "status,=," + doc.status];
		}
	},
};