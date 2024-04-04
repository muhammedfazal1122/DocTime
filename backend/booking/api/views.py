from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from booking.models import Slot
from accounts.models import Doctor,Patient
from .serializers import SlotSerializer,RazorpayOrderSerializer,TranscationModelSerializer,Transaction,TranscationModelList
from rest_framework import generics
from rest_framework import status
from django.utils.dateparse import parse_date
from datetime import datetime
from booking.api.razorpay.main import RazorpayClient
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from datetime import datetime
import pytz




class DoctorSlotListCreateView(APIView):
    serializer_class = SlotSerializer

    def get(self, request, custom_id):
        try:
            doctor = Doctor.objects.get(custom_id=custom_id)
            slots = Slot.objects.filter(doctor=doctor)
            serializer = self.serializer_class(slots, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        
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


rz_client = RazorpayClient()


@api_view(['POST'])
def check_availability(request):
    doctor_id = request.data.get('doctor_id')
    selected_from_time = request.data.get('selected_from_time')
    selected_to_time = request.data.get('selected_to_time')
    selected_day = request.data.get('selected_day')
    # Check if any of the required fields are None
    print(f"Querying for doctor_id={doctor_id}, selected_day={selected_day}, start_time__lte={selected_from_time}, end_time__gte={selected_to_time}")

    if not doctor_id or not selected_from_time or not selected_to_time or not selected_day:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        doctor_availability = get_object_or_404(Slot, doctor_id=doctor_id, day=selected_day, start_time__lte=selected_from_time, end_time__gte=selected_to_time)
        available = not doctor_availability.is_booked
        return Response({'available': available}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





class RazorpayOrderAPIView(APIView):
    """This API will create an order"""
    
    def post(self, request):
        razorpay_order_serializer = RazorpayOrderSerializer(
            data=request.data
        )
        if razorpay_order_serializer.is_valid():
            order_response = rz_client.create_order(
                amount=razorpay_order_serializer.validated_data.get("amount"),
                currency=razorpay_order_serializer.validated_data.get("currency")
            )
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "order created",
                "data": order_response
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": razorpay_order_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
class TransactionAPIView(APIView):
    """This API will complete order and save the transaction"""
    
    def post(self, request):
        transaction_serializer = TranscationModelSerializer(data=request.data)
        if transaction_serializer.is_valid():
            print('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
            rz_client.verify_payment_signature(
                razorpay_payment_id=transaction_serializer.validated_data.get("payment_id"),
                razorpay_order_id=transaction_serializer.validated_data.get("order_id"),
                razorpay_signature=transaction_serializer.validated_data.get("signature")
            )
            try:
                print("ddddddddddddddddddddddddddddddddddddddddddddddddd")
                doctor_id = transaction_serializer.validated_data.get("doctor_id")
                patient_id=transaction_serializer.validated_data.get("patient_id")
                start_time = request.data.get('start_time')
                end_time = request.data.get('end_time')
                day = request.data.get('day')
                # Check if any of the required fields are None
                print(f"Querying for doctor_id={doctor_id}, selected_day={day}, start_time__lte={start_time}, end_time__gte={end_time}")

            
                doctor_availability = get_object_or_404(Slot, doctor_id=doctor_id, day=day, start_time__lte=start_time, end_time__gte=end_time)
                doctor_availability.is_booked=True
                doctor_availability.save()
    
            except Exception as e:
                print(e)
                return Response({"error": "Doctor availability not found"}, status=status.HTTP_404_NOT_FOUND)
    
            transaction_serializer.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created"
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": transaction_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def PatientBookingDetailsAPIView(request, patient_id):
    try:
        transactions = Transaction.objects.filter(patient_id=patient_id)
        serializer = TranscationModelList(transactions, many=True)
        response = {
                "status_code": status.HTTP_200_OK,
                "data": serializer.data
            }
        return Response(response, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

