# Generated by Django 5.0.2 on 2024-05-03 14:23

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('transaction_id', models.CharField(max_length=200, primary_key=True, serialize=False, unique=True, verbose_name='Transaction ID')),
                ('payment_id', models.CharField(max_length=200, verbose_name='Payment ID')),
                ('order_id', models.CharField(blank=True, max_length=200, null=True, verbose_name='Order ID')),
                ('signature', models.CharField(blank=True, max_length=500, null=True, verbose_name='Signature')),
                ('amount', models.IntegerField(verbose_name='Amount')),
                ('doctor_id', models.CharField(max_length=200, verbose_name='Doctor ID')),
                ('patient_id', models.CharField(max_length=200, verbose_name='Patient ID')),
                ('day', models.DateField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled'), ('REFUNDED', 'Refunded')], default='COMPLETED', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_consultency_completed', models.CharField(choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled'), ('REFUNDED', 'Refunded')], default='PENDING', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('comment', models.TextField()),
                ('subject', models.TextField(default='Visited For Heart Surgery')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='patient_reviews', to='accounts.patient')),
            ],
        ),
        migrations.CreateModel(
            name='Slot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.DateField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('is_booked', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(default=datetime.datetime.now)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.doctor')),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medicine_name', models.CharField(max_length=255)),
                ('dosage', models.CharField(default='500 mg', max_length=255)),
                ('times', models.CharField(default='2 times', max_length=55)),
                ('Age', models.IntegerField(default=21)),
                ('duration', models.CharField(default='1 week', max_length=55)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescriptions_given', to='accounts.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescriptions_received', to='accounts.patient')),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescriptions', to='booking.transaction')),
            ],
        ),
        migrations.CreateModel(
            name='TransactionCommission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('commission_rate', models.DecimalField(decimal_places=2, default=0.2, max_digits=5)),
                ('commission_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('doctor_commission_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('transaction', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='booking.transaction')),
            ],
        ),
    ]
