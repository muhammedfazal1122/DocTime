from django.contrib import admin
from .models import Slot,Transaction,Review

# Register your models here.


admin.site.register(Slot)
admin.site.register(Transaction)
admin.site.register(Review)