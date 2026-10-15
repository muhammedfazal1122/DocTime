from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, Doctor, Patient
from booking.models import Slot, Transaction
from datetime import date, datetime, timedelta
from django.utils import timezone


class BookingSlotTests(APITestCase):
    def setUp(self):
        self.doc_user = User.objects.create_user(
            first_name='DrTest',
            email='drtest@example.com',
            phone_number='1234567891',
            password='Password123!',
            user_type='doctor',
            approval_status='APPROVED'
        )
        self.doc_user.is_active = True
        self.doc_user.save()
        self.doctor = Doctor.objects.get(user=self.doc_user)

    def test_get_doctor_slots_empty(self):
        url = f'/appointment/doctors/{self.doctor.custom_id}/slots/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_create_and_get_doctor_slot(self):
        now = timezone.now()
        slot = Slot.objects.create(
            doctor=self.doctor,
            day=now.date(),
            start_time=now,
            end_time=now + timedelta(hours=1),
            is_booked=False
        )
        url = f'/appointment/doctors/{self.doctor.custom_id}/slots/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_doctor_slot(self):
        now = timezone.now()
        slot = Slot.objects.create(
            doctor=self.doctor,
            day=now.date(),
            start_time=now,
            end_time=now + timedelta(hours=1),
            is_booked=False
        )
        delete_url = f'/appointment/doctors/{self.doctor.custom_id}/slots-delete/{slot.id}/'
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Slot.objects.filter(id=slot.id).count(), 0)
