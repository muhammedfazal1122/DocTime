from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from booking.models import Slot
from accounts.models import Doctor
from .serializers import SlotSerializer
from rest_framework import generics
from rest_framework import status
from django.utils.dateparse import parse_date
from datetime import datetime





class DoctorSlotListCreateView(APIView):
    serializer_class = SlotSerializer

    def post(self, request, custom_id):
        slots_data = request.data.get('slots')
        if not slots_data:
            return Response({'error': 'No slots data provided'}, status=status.HTTP_400_BAD_REQUEST)

        doctor = Doctor.objects.get(custom_id=custom_id)
        serializer = self.serializer_class(data=slots_data, many=True)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors) # Debugging log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



class PatientSlotView(APIView):
    serializer_class = SlotSerializer

    def get(self, request, custom_id, date):
        try:
            # Parse the date string into a date object
            selected_date = datetime.strptime(date, '%Y-%m-%d').date()
            # Filter slots based on the selected date
            slots = Slot.objects.filter(doctor__custom_id=custom_id, day=selected_date)
            if not slots.exists():
                return Response({'error': 'Slots not found for the selected date'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.serializer_class(slots, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)