// Copyright (c) 2015, Frappe Technologies Pvt. td. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings["Outward Sample"] = {
	add_fields: [
		"supplier_name"
	],
	get_indicator: function (doc) {
		const status_colors = {
			Draft: "grey",
			'Pending':'blue',
            'Approved':"green",
            'Fail':"red"
		};
		return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
	},
};