from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, Doctor, Patient, OTPModel
from booking.models import Slot
from datetime import date, datetime, timedelta
import pytz


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            first_name='TestUser',
            email='testuser@example.com',
            phone_number='1234567890',
            password='TestPassword123!',
            user_type='patient'
        )
        self.user.is_active = True
        self.user.save()

    def test_login_success(self):
        url = '/auth/login'
        data = {
            'email': 'testuser@example.com',
            'password': 'TestPassword123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_password(self):
        url = '/auth/login'
        data = {
            'email': 'testuser@example.com',
            'password': 'WrongPassword!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout(self):
        login_url = '/auth/login'
        login_data = {
            'email': 'testuser@example.com',
            'password': 'TestPassword123!'
        }
        login_response = self.client.post(login_url, login_data, format='json')
        access_token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        logout_url = '/auth/logout'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(logout_url, {'refresh_token': refresh_token}, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_205_RESET_CONTENT)


class DoctorPatientModelTests(TestCase):
    def test_doctor_and_patient_creation(self):
        doc_user = User.objects.create_user(
            first_name='Alice',
            email='alice@example.com',
            phone_number='1112223334',
            password='Password123!',
            user_type='doctor'
        )
        doctor = Doctor.objects.get(user=doc_user)
        self.assertTrue(doctor.custom_id.startswith('D'))

        pat_user = User.objects.create_user(
            first_name='Bob',
            email='bob@example.com',
            phone_number='5556667778',
            password='Password123!',
            user_type='patient'
        )
        patient = Patient.objects.get(user=pat_user)
        self.assertTrue(patient.custom_id.startswith('P'))
