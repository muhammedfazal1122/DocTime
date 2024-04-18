# celery.py

from __future__ import absolute_import, unicode_literals
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

app = Celery('DocTime')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.beat_schedule = {
    'delete_expired_transactions_every_day': {
        'task': 'Booking.tasks.delete_expired_transactions',
        'schedule': crontab(hour=0, minute=0), # Run daily at midnight
    },
}
