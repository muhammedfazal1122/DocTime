# slots/serializers.py
from rest_framework import serializers
from booking.models import Slot,Transaction,Review,Prescription,TransactionCommission
from accounts.models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name']



class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = "__all__"


# Docotr bookin serializer
        
class RazorpayOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    currency = serializers.CharField()


class TranscationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [ 'payment_id', 'order_id', 'signature', 'amount', 'doctor_id', 'patient_id', 'day', 'start_time', 'end_time']


class TranscationModelList(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'




class ReviewSerializer(serializers.ModelSerializer):
    patient_full_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'doctor', 'patient', 'rating', 'comment', 'created_at', 'patient_full_name','subject']



class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['transaction_id', 'prescription_file']

# class PrescriptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Prescription
#         fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class TransactionCommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionCommission
        fields = '__all__'