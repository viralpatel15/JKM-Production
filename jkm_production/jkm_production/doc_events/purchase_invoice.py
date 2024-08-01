import frappe
from frappe.utils import flt

def validate(self,method):
    calc(self)
    
def calc(self):
    total_freight = 0
    total_fob = 0
    total_insurance = 0

    for row in self.items:
        total_freight += row.custom_freight
                
        total_insurance += row.custom_insurance
        
        total_fob += row.custom_fob_value_inr
        
    self.custom_total_freight = flt(total_freight)
    self.custom_insurance = flt(total_insurance)
    self.custom_total_fob_value = flt(total_fob)