# Generated by Django 5.0.2 on 2024-04-01 09:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_slot_end_day_slot_start_day'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='slot',
            name='start_day',
        ),
    ]