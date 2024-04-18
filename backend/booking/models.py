from django.db import models
from accounts.models import Doctor,Patient
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


    def is_available(self):
        return not self.is_booked
    def is_cancelled(self):
        return self.is_cancelled





class Transaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    ]
    transaction_id = models.CharField(max_length=200, verbose_name="Transaction ID", unique=True, primary_key=True)
    payment_id = models.CharField(max_length=200, verbose_name="Payment ID")
    order_id = models.CharField(max_length=200, verbose_name="Order ID",null=True,blank=True)
    signature = models.CharField(max_length=500, verbose_name="Signature", blank=True, null=True)
    amount = models.IntegerField(verbose_name="Amount")
    doctor_id = models.CharField(max_length=200, verbose_name="Doctor ID")
    patient_id = models.CharField(max_length=200, verbose_name="Patient ID") 
    day = models.DateField()
    start_time = models.DateTimeField() # Changed from TimeField to DateTimeField
    end_time = models.DateTimeField() # Changed from TimeField to DateTimeField
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='COMPLETED')
    created_at = models.DateTimeField(auto_now_add=True)
    is_consultency_completed = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            # Auto-generate transaction ID greater than the last one
            last_transaction = Transaction.objects.order_by('-transaction_id').first()
            if last_transaction:
                last_id = int(last_transaction.transaction_id)
                self.transaction_id = str(last_id + 1)
            else:
                self.transaction_id = '121212'

        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.transaction_id)
    
class Review(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='patient_reviews')
    rating = models.IntegerField()
    comment = models.TextField()
    subject = models.TextField(default="Visited For Heart Surgery")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.full_name} reviewed {self.doctor.full_name}"
