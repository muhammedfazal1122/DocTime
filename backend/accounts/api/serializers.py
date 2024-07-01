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



class DoctorSerializerAll(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"




class DoctorCustomIDSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['custom_id']       
        
class DoctorCustomIDSerializer(serializers.ModelSerializer):
    user = UserSerializer( read_only=True) 

    class Meta:
        model = Doctor
        fields = '__all__'   



class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class UserIsActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'doctor_user','is_active']



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
    patient_user=PatientSerializer(read_only=True)

    class Meta:
        model = User
        exclude = ('password','is_id_verified', 'is_email_verified', 'is_staff', 'is_superuser', 'user_type')

class UserDoctorCustomIDSerializer2(serializers.ModelSerializer):
    doctor_user=DoctorCustomIDSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id','first_name','doctor_user']     




class UserDoctorCustomIDSerializer(serializers.ModelSerializer):
    doctor_user = DoctorCustomIDSerializer()  

    class Meta:
        model = User
        fields = ['id', 'first_name', 'doctor_user','profile_picture','last_name','phone_number','gender','date_of_birth','state','city','country','zip_code','street']

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
        exclude = ('user',) # Exclude the 'user' field from the serializer

class AdminDocVerificationSerializer(serializers.ModelSerializer):
    docter = DoctorCustomIDSerializer
    class Meta:
        model = Verification
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class UserDetailsUpdateSerializer(serializers.ModelSerializer):
    doctor_user=DoctorCustomIDSerializer(read_only=True)
    class Meta:
        model = User
        exclude = ('password','is_staff','is_superuser','user_type')

class UserDetailsUpdateSerializerlistbooking(serializers.ModelSerializer):
    doctor_user=DoctorSerializer(read_only=True)
    class Meta:
        model = User
        exclude = ('password','is_staff','is_superuser')


class AdminDocUpdateSerializer(serializers.ModelSerializer):
    user=DOCUserSerializer()
    class Meta:
        model = Doctor
        fields='__all__'
        
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {}) # this is used to pop out the user object and if it is not existing then we will assign a {} to it as default
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        return super().update(instance, validated_data)

class AdminClientUpdateSerializer(serializers.ModelSerializer):
    user=DOCUserSerializer()
    class Meta:
        model = Patient
        fields='__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {}) # this is used to pop out the user object and if it is not existing then we will assign a {} to it as default
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        return super().update(instance, validated_data)


class AdminPatientUpdateSerializer(serializers.ModelSerializer):
    user=UserSerializer()
    class Meta:
        model = Patient
        fields='__all__' 
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {}) # this is used to pop out the user object and if it is not existing then we will assign a {} to it as default
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        return super().update(instance, validated_data)


class AdminDocVerificationSerializerApprove(serializers.ModelSerializer):
    user=DOCUserSerializer()
    class Meta:
        model = Verification
        fields = '__all__'

    def update(self, instance, validated_data):
        # Update Verification model fields
        instance.is_KYC_submitted = validated_data.get('is_KYC_submitted', instance.is_KYC_submitted)
        # Access the nested User instance and update its fields
        user_data = validated_data.pop('user', {})  # Extract user data from validated_data
        user_instance = instance.user  # Access the nested User instance

        # Update User model fields
        user_instance.approval_status = user_data.get('approval_status', user_instance.approval_status)
        print("User data:", user_data) # Debugging line
        print("User approval_status before save:", user_instance.approval_status) # Debugging line

        # Save both instances
        instance.save()
        user_instance.save()

        return instance



class PatientCustomIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['custom_id']    

        
class UserPatientCustomIDSerializer(serializers.ModelSerializer):
    patient_user=PatientCustomIDSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id','first_name','patient_user']