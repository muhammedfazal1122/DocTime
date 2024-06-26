from django.contrib import admin
from .models import Slot,Transaction,Review,TransactionCommission,Prescription

# Register your models here.


admin.site.register(Slot)
admin.site.register(Transaction)
admin.site.register(TransactionCommission)
admin.site.register(Review)
admin.site.register(Prescription)


