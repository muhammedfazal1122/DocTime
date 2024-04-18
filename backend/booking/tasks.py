# tasks.py

from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.utils import timezone
from .models import Transaction

@shared_task
def delete_expired_transactions():
    # Get the current date
    now = timezone.now()
    # Delete all transactions where the consultation date is before the current date
    Transaction.objects.filter(consultation_date__lt=now).delete()
