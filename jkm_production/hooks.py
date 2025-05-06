app_name = "jkm_production"
app_title = "JKM Production"
app_publisher = "viral@gmail.com"
app_description = "JKN Production"
app_email = "viral@gmail.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/jkm_production/css/jkm_production.css"
# app_include_js = "/assets/jkm_production/js/jkm_production.js"

# include js, css files in header of web template
# web_include_css = "/assets/jkm_production/css/jkm_production.css"
# web_include_js = "/assets/jkm_production/js/jkm_production.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "jkm_production/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "jkm_production/public/icons.svg"

# Home Pages
# ----------
doc_events = {
	"Lead":{
		"validate":"jkm_production.jkm_production.doc_events.lead.validate",
		"after_insert":"jkm_production.jkm_production.doc_events.lead.after_insert"
	},
	"Payment Entry": {
		"on_submit": "jkm_production.api.pe_on_submit",
		"before_cancel": "jkm_production.api.pe_on_cancel",
	},
	"Journal Entry": {
    	"on_cancel": "jkm_production.jkm_production.doc_events.journal_entry.before_cancel",
	},
    "Sales Order":{
        "validate": "jkm_production.jkm_production.doc_events.sales_order.validate"
	},
	"Duty DrawBack Claim":{
        "on_submit":"jkm_production.jkm_production.doctype.duty_drawback_claim.duty_drawback_claim.create_jv_on_submit"
    },
	"Rodtep Claim":{
        "on_submit":"jkm_production.jkm_production.doctype.rodtep_claim.rodtep_claim.create_jv_on_submit"
    },
    "Sales Invoice":{
        "validate":[
		"jkm_production.jkm_production.doc_events.sales_order.validate",
		"jkm_production.jkm_production.doc_events.sales_invoice.validate"
		],
		"on_submit": "jkm_production.api.si_on_submit",
        "on_cancel": "jkm_production.api.si_on_cancel"
	},
    "Delivery Note":{
        "validate": "jkm_production.jkm_production.doc_events.sales_order.validate"
	},
    "Purchase Invoice":{
        "validate": ["jkm_production.jkm_production.doc_events.purchase_order.validate","jkm_production.jkm_production.doc_events.purchase_invoice.validate"],
        "on_submit": "jkm_production.api.pi_on_submit",
        "on_cancel": "jkm_production.api.pi_on_cancel",
	},
    "Purchase Order":{
        "validate": [
            "jkm_production.jkm_production.doc_events.purchase_order.validate",
            ],
	},
    "Purchase Receipt":{
        "validate": "jkm_production.jkm_production.doc_events.purchase_order.validate"
	},
    "Request for Quotation":{
        "on_submit":[
            "jkm_production.jkm_production.doc_events.request_for_quotation.on_submit"
		],
        "on_update_after_submit":"jkm_production.jkm_production.doc_events.request_for_quotation.on_update_after_submit"
	},
    "Supplier Quotation":{
        "on_submit":[
            "jkm_production.jkm_production.doc_events.supplier_quotation.on_submit"
		],
        "validate":[
			"jkm_production.jkm_production.doc_events.supplier_quotation.validate"
		]
	},
    "Quotation":{
        "validate": "jkm_production.jkm_production.doc_events.quotation.validate",
    }
}

doctype_js = { 
	"Lead": "public/js/lead.js",
	"Opportunity": "public/js/opportunity.js",
    "Quotation": "public/js/quotation.js",
	"Supplier Quotation": "public/js/supplier_quotation.js",
	"Payment Entry": "public/js/doctype_js/payment_entry.js",
	"Sales Invoice": "public/js/doctype_js/sales_invoice.js",
    "Journal Entry": "public/js/doctype_js/journal_entry.js",
    "Sales Order" : "public/js/doctype_js/sales_order.js",
    "Delivery Note":"public/js/doctype_js/delivery_note.js",
    "Purchase Invoice":"public/js/doctype_js/purchase_invoice.js",
    "Purchase Order": "public/js/doctype_js/purchase_order.js",
    "Purchase Receipt": "public/js/doctype_js/purchase_receipt.js",
    "Request for Quotation":"public/js/request_for_quotation.js"
}




# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "jkm_production.jkm_production.doc_events.sales_order.generate_upi_qr_code"
# }

# Installation
# ------------

# before_install = "jkm_production.install.before_install"
# after_install = "jkm_production.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "jkm_production.uninstall.before_uninstall"
# after_uninstall = "jkm_production.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "jkm_production.utils.before_app_install"
# after_app_install = "jkm_production.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "jkm_production.utils.before_app_uninstall"
# after_app_uninstall = "jkm_production.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "jkm_production.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Supplier Quotation": "jkm_production.jkm_production.doc_events.supplier_quotation.jkmsupplierquotation",
    "Quality Inspection": "jkm_production.jkm_production.doc_events.quality_inspection.QualityInspectionJKM",
    "Request for Quotation": "jkm_production.jkm_production.doc_events.request_for_quotation.jkmrequestforquotation"
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

scheduler_events = {
	
	"daily": [
		"jkm_production.jkm_production.doctype.sample_batch_details.sample_batch_details.disable_batch"
	]
}

# Testing
# -------
from erpnext.buying.report.requested_items_to_order_and_receive import requested_items_to_order_and_receive
from jkm_production.jkm_production.requested_items_to_order_and_received import execute as execute_jkm
requested_items_to_order_and_receive.execute = execute_jkm
# before_tests = "jkm_production.install.before_tests"

# Overriding Methods
# ------------------------------
#
override_whitelisted_methods = {
	"erpnext.selling.doctype.quotation.quotation.make_sales_order": "jkm_production.jkm_production.doc_events.sales_order.make_sales_order",
    "erpnext.stock.doctype.material_request.material_request.make_purchase_order" : "jkm_production.jkm_production.doc_events.purchase_order.make_purchase_order"
}
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "jkm_production.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["jkm_production.utils.before_request"]
# after_request = ["jkm_production.utils.after_request"]

# Job Events
# ----------
# before_job = ["jkm_production.utils.before_job"]
# after_job = ["jkm_production.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"jkm_production.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

