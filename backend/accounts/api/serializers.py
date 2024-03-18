from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
from accounts.models import Doctor, Patient, User, Verification,OTPModel
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken, Token,AccessToken
from django.core.validators import RegexValidator


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        #  
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password' ,)



class DOCUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'id' ,'is_staff','is_superuser','user_type','email','profile_picture')






class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_active', 'first_name', 'last_name', 'user_type', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        
        return super(UserRegisterSerializer, self).create(validated_data)




class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'



class PatientUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password','is_id_verified', 'is_email_verified', 'is_staff', 'is_superuser', 'user_type')

class DoctorCustomIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'   

class UserDoctorCustomIDSerializer(serializers.ModelSerializer):
    doctor_user = DoctorCustomIDSerializer()  

    class Meta:
        model = User
        fields = ['id', 'first_name', 'doctor_user','profile_picture']

    def update(self, instance, validated_data):
        print("Before update:", instance.doctor_user)
        doctor_user_data = validated_data.pop('doctor_user', None)
        if doctor_user_data:
            doctor_serializer = DoctorCustomIDSerializer(
                instance=instance.doctor_user, data=doctor_user_data, partial=True)
            if doctor_serializer.is_valid():
                doctor_serializer.save()
            else:
                print("Validation errors:", doctor_serializer.errors)
                raise serializers.ValidationError(doctor_serializer.errors)

        # Update user fields
        # instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.save()
        print("After update:", instance.doctor_user)
        return instance


class VarificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)



class AdminDocVerificationSerializer(serializers.ModelSerializer):
    docter = DoctorCustomIDSerializer
    class Meta:
        model = Verification
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)












