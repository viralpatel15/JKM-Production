// Copyright (c) 2015, Frappe Technologies Pvt. td. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings["Inward Sample"] = {
	add_fields: [
		"supplier_name"
	],
	get_indicator: function (doc) {
		const status_colors = {
			Draft: "red",
			'Requested':'blue',
            'Delivered':"black",
            'Expired':"grey"
		};
		return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
	},
};