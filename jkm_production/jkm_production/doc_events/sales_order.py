import frappe
from frappe.utils import flt

def validate(self, method):
    custom_total_net_weight_exim_ = 0
    custom_gross_weight = 0
    custom_total_cbm = 0
    custom_total_packages = 0
    for row in self.items:
        if flt(row.qty) and flt(row.custom_packing_size):
            row.custom_no_of_package = flt(row.qty) / flt(row.custom_packing_size)
            custom_total_packages += row.custom_no_of_package

        if flt(row.custom_per_package_weight) and flt(row.custom_no_of_package):
            row.custom_total_weight_of_package = flt(row.custom_no_of_package) * flt(row.custom_per_package_weight)

        custom_total_net_weight_exim_ += flt(row.custom_net_weight)
        
        if flt(row.custom_total_weight_of_package) and flt(row.custom_no_of_package):
            row.custom_gross_weight = flt(row.custom_total_weight_of_package) + flt(row.custom_net_weight)
            custom_gross_weight += flt(row.custom_gross_weight)

        if flt(row.custom_no_of_package):
            row.custom_per_package_cbm = (flt(row.custom_height) * flt(row.custom_width) * flt(row.custom_length))/1000000 * flt(row.custom_no_of_package)
            row.custom_total_cbm_of_package =+ flt(row.custom_per_package_cbm) * (row.custom_no_of_package)
            custom_total_cbm += row.custom_total_cbm_of_package


    self.custom_total_net_weight_exim_ = custom_total_net_weight_exim_
    self.custom_gross_weight = custom_gross_weight
    self.custom_total_cbm = custom_total_cbm
    self.custom_total_packages = custom_total_packages