from django.db import models
from accounts.models import User

# Create your models here.

class Notification(models.Model):
    
    RECEIVER_TYPE = [
        ('patient', 'PATIENT'),
        ('doctor', 'DOCTOR'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)
    receiver_type = models.CharField(choices=RECEIVER_TYPE, max_length=30, null=True)

    def __str__(self):
        return self.message