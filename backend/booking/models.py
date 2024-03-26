
from django.db import models

class Slot(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # Add any other fields you need
