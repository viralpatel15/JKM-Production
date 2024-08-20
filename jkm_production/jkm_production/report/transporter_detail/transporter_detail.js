// Copyright (c) 2024, viral@gmail.com and contributors
// For license information, please see license.txt

frappe.query_reports["Transporter Detail"] = {
	"filters": [
		{
			"label":"Transporter",
			"fieldname":"supplier",
			"fieldtype":"Link",
			"options":"Supplier",
			get_query: function () {
				return {
					filters: [["is_transporter", "=", 1]],
				};
			},
			

		},
		{
			"label":"Branch",
			"fieldname":"branch",
			"fieldtype":"Link",
			"options":"City",
		},

	]
};
