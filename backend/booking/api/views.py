from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from booking.models import Slot,Review
from accounts.models import Doctor,Patient
from .serializers import SlotSerializer,TransactionCommission,TransactionCommissionSerializer,PrescriptionSerializer,RazorpayOrderSerializer,TranscationModelSerializer,Transaction,TranscationModelList,ReviewSerializer,TransactionSerializer,Prescription
from rest_framework import generics
from rest_framework import status
from django.utils.dateparse import parse_date
from datetime import datetime
from rest_framework import viewsets
from booking.api.razorpay.main import RazorpayClient
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from datetime import datetime
import pytz
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.http import Http404



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




class UpdateOrderAPIView(APIView):


    def patch(self, request, transaction_id):
        # Retrieve the order object using the transaction_id
        order = get_object_or_404(Transaction, transaction_id=transaction_id)

        # Update the order's status
        order.is_consultency_completed = 'COMPLETED' # Assuming 'completed' is a valid status
        order.save()

        # Serialize the updated order
        serializer = TranscationModelList(order)

        # Return the serialized order data
        return Response(serializer.data, status=status.HTTP_200_OK)
    





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
    

# ----------------------------------------------Doctor------------------------------------------------------




@api_view(['GET'])
def DoctorBookingDetailsAPIView(request, doctor_id):
    try:
        transactions = Transaction.objects.filter(doctor_id=doctor_id)
        serializer = TranscationModelList(transactions, many=True)
        response = {
                "status_code": status.HTTP_200_OK,
                "data": serializer.data
            }
        return Response(response, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def DoctorBookingDetailsAPIViewChat(request, doctor_id, patient_id):
    try:
        print(doctor_id,patient_id,'kooooooooooooooooooooooooiiiiiiiiiiiiiiiii')
        # Filter transactions by both doctor_id and patient_id
        transactions = Transaction.objects.filter(doctor_id=doctor_id, patient_id=patient_id)
        print(transactions,'ooooooooooooooooooooooooooooooooooooo')
        if not transactions.exists():
            # If no transactions are found, return a custom message
            return Response({"message": "You have to consult this doctor at least once!"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TranscationModelList(transactions, many=True)
        response = {
            "status_code": status.HTTP_200_OK,
            "data": serializer.data,
            "message": "transactions.exists"
        }
        return Response(response, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

# ----------------------------------------------ADMIN------------------------------------------------------


class TrasactionListAPIView(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TranscationModelList
    pagination_class = PageNumberPagination    
    filter_backends = [SearchFilter]
    search_fields = ['transaction_id', 'doctor_id','patient_id', 'booked_date']


class TrasactionRetriveAPIView(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TranscationModelList
    lookup_field = 'pk'


class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return Review.objects.filter(doctor_id=doctor_id)
    
class PatientTransactionsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        patient_id = request.query_params.get('patient_id', None)
        doctor_custom_id = request.query_params.get('doctor_custom_id', None)

        if not patient_id or not doctor_custom_id:
            return Response({'error': 'Patient ID and Doctor Custom ID are required in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            patient = Patient.objects.get(custom_id=patient_id)
            doctor = Doctor.objects.get(custom_id=doctor_custom_id)
        except (Patient.DoesNotExist, Doctor.DoesNotExist, ValueError):
            raise Http404("Patient or Doctor not found or invalid ID")

        # Find the common transaction between the patient and doctor
        common_transaction = Transaction.objects.filter(patient_id=patient_id, doctor_id=doctor_custom_id, status='COMPLETED').first()
        print(common_transaction,'cccccoooooooooooooooooo')

        if not common_transaction:
            return Response({'error': 'No completed transaction found between this patient and doctor'}, status=status.HTTP_404_NOT_FOUND)

        transaction_data = {
            "transaction_id": common_transaction.transaction_id,
            "payment_id": common_transaction.payment_id,
            "order_id": common_transaction.order_id,
            "signature": common_transaction.signature,
            "amount": common_transaction.amount,
            "doctor_id": common_transaction.doctor_id,
            "patient_id": common_transaction.patient_id,
            "doctor_name": doctor.user.first_name,
            "doctor_profile_picture": (
                request.build_absolute_uri('/')[:-1] + doctor.user.profile_picture.url
            ) if doctor.user.profile_picture else "",
            "booked_date": common_transaction.day,
            "booked_from_time": common_transaction.start_time,
            "booked_to_time": common_transaction.end_time,
            "status": common_transaction.status,
            "created_at": common_transaction.created_at,
        }

        return Response(transaction_data, status=status.HTTP_200_OK)

class DoctorTransactionsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        doctor_id = request.query_params.get('doctor_id', None)

        if not doctor_id:
            return Response({'error': 'Doctor ID is required in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            doctor = Doctor.objects.get(custom_id=doctor_id)
        except (Doctor.DoesNotExist, ValueError):
            raise Http404("Doctor not found or invalid ID")

        transactions = Transaction.objects.filter(doctor_id=doctor_id, status='COMPLETED')

        processed_patient_ids = set()
        data = []

        for transaction in transactions:
            # Check if the patient ID has been processed before
            if transaction.patient_id in processed_patient_ids:
                continue

            patient = Patient.objects.get(custom_id=transaction.patient_id)
            transaction_data = {
                "transaction_id": transaction.transaction_id,
                "payment_id": transaction.payment_id,
                "order_id": transaction.order_id,
                "signature": transaction.signature,
                "amount": transaction.amount,
                "doctor_id": transaction.doctor_id,
                "patient_id": transaction.patient_id,
                "patient_name": patient.user.first_name,
                "patient_profile_picture": (
                    request.build_absolute_uri('/')[:-1] + patient.user.profile_picture.url
                ) if patient.user.profile_picture else None,
                "booked_date": transaction.day,
                "booked_from_time": transaction.start_time,
                "booked_to_time": transaction.end_time,
                "status": transaction.status,
                "created_at": transaction.created_at,
            }

            processed_patient_ids.add(transaction.patient_id)
            data.append(transaction_data)

        return Response(data, status=status.HTTP_200_OK)



class UploadPrescriptionView(APIView):
    def get(self, request, transaction_id):
        transaction = Transaction.objects.get(transaction_id=transaction_id)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def post(self, request, transaction_id):
        transaction = Transaction.objects.get(transaction_id=transaction_id)
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PrescriptionCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionUpdateView(APIView):
    def get_object(self, pk):
        try:
            return Prescription.objects.get(pk=pk)
        except Prescription.DoesNotExist:
            raise Http404

    def patch(self, request, pk, *args, **kwargs):
        prescription = self.get_object(pk)
        serializer = PrescriptionSerializer(prescription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class PatientPrescriptionsView(generics.ListAPIView):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        transaction_id = self.kwargs['transaction_id']
        return Prescription.objects.filter(transaction=transaction_id)
    
class TransactionCommissionView(APIView):
    def post(self, request):
        serializer = TransactionCommissionSerializer(data=request.data)
        if serializer.is_valid():
            # Attempt to get the object, or create it if it doesn't exist
            transaction_commission, created = TransactionCommission.objects.get_or_create(
                transaction_id=serializer.validated_data['transaction'],
                defaults=serializer.validated_data
            )
            if created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # If the object already exists, update it with the new data
                for attr, value in serializer.validated_data.items():
                    setattr(transaction_commission, attr, value)
                transaction_commission.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class GetingTransaction(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TranscationModelList  # Replace with your serializer

    def get_object(self):
        transaction_id = self.kwargs['transaction_id']
        try:
            return self.queryset.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            return None
