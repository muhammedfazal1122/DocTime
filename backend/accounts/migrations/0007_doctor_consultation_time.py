# Generated by Django 5.0.2 on 2024-03-25 06:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_doctor_experience_alter_doctor_specializations'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='consultation_time',
            field=models.TextField(default='10AM to 5PM', max_length=50),
        ),
    ]