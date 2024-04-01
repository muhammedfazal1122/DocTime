from django.db import models
from accounts.models import Doctor
import datetime

class Slot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    day = models.DateField()
    # end_day = models.DateField(default=datetime.datetime.now)
    start_time = models.DateTimeField() # Changed from TimeField to DateTimeField
    end_time = models.DateTimeField() # Changed from TimeField to DateTimeField
    is_booked = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.datetime.now)

    