from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .serializers import User,UserRegisterSerializer,UserDoctorCustomIDSerializer,UserSerializer, DoctorCustomIDSerializer,OTPModel,Patient,PatientUserSerializer,Doctor
from .serializers import VarificationSerializer,Verification,AdminDocVerificationSerializer,UserDetailsUpdateSerializer,AdminDocUpdateSerializer,AdminClientUpdateSerializer
from .serializers import UserIsActiveSerializer,UserDetailsUpdateSerializerlistbooking,AdminPatientUpdateSerializer,AdminDocVerificationSerializerApprove,DoctorSerializer,UserPatientCustomIDSerializer,UserDoctorCustomIDSerializer2
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ParseError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
import random
from django.utils import timezone
from datetime import datetime
from rest_framework import status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from rest_framework.generics import RetrieveUpdateAPIView
from django.db.models import Q
from django.http import Http404
from rest_framework import generics, permissions, filters
           


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            print(request.data)
            print(serializer)
            
            serializer.save()
            try:
                self.send_otp_email(serializer.data['email'])
                print(serializer.data['email'])

            except Exception as e:
                return Response({"Message": "Unknown error", "error": str(e)}, status=500)
        
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def send_otp_email(self, email):
        random_num = random.randint(1000, 9999)
        print(random_num)
        try:    
            send_mail(
                "OTP AUTHENTICATING DocTime",
                f"{random_num} -OTP",
                "ecomm.apps.info@gmail.com",
                [email],
                fail_silently=False,
                )
        except Exception as e:
            print("**********************8")
            print(e)
        otp_instance = OTPModel.objects.create(
            user=User.objects.get(email=email),
            otp=random_num,
            timestamp=datetime.now(),
        )
        otp_instance.save()


class UserLogin(APIView):

    def post(self, request):
        print(request.data)

        try:
            email = request.data['email']
            password = request.data['password']
            print(email, password)

        except KeyError:
            raise ParseError('All Fields Are Required')

        if not User.objects.filter(email=email).exists():
            # raise AuthenticationFailed('Invalid Email Address')
            return Response({'detail': 'Email Does Not Exist'}, status=status.HTTP_403_FORBIDDEN)

        if not User.objects.filter(email=email, is_active=True).exists():
            raise AuthenticationFailed(
                'You are blocked by admin ! Please contact admin')

        user = authenticate(username=email, password=password)
        if user is None:
            raise AuthenticationFailed('Invalid Password')

        refresh = RefreshToken.for_user(user)
        print(request.data)

        refresh["first_name"] = str(user.first_name)
        # refresh["is_admin"] = str(user.is_superuser)
        print("Ddddddddddddddddddddddddddd")

        content = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'isAdmin': user.is_superuser,
            'is_doctor': user.is_doctor(),
            'user_id': user.id
        }
        print(content)
        return Response(content, status=status.HTTP_200_OK)

class UserLogout(APIView):
    permission_classes = (IsAuthenticated)
    def post(self, request):
        try:    
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            content = {'massage':"ok"}
            return Response (content,status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response (status=status.HTTP_401_UNAUTHORIZED)
        
class OTPVerificationView(APIView):
    def post(self, request):
        try:
            print("otttttttpppppppp")
            # Check if the 'email' key is present in request.data
            if 'email' in request.data:
                user = User.objects.get(email=request.data['email'])
                print(user,'user+++++++++++++++++++')
                
                otp_object = OTPModel.objects.get(user=user)
                print(otp_object,'otp_object')
                if otp_object.otp == int(request.data['otp']):
                    print("otp is correcrt")
                    user.is_active = True
                    user.save()
                    # ----------------------------------------------------------
                    # Delete the OTP instance after successful verification
                    otp_object.delete()
                    return Response("User successfully verified",status=200)
                else:
                    return Response("OTP is wrong",status=400)
            else:
                return Response("Email is required", status=400)
        except ObjectDoesNotExist:
            return Response("User does not exist or OTP not generated", status=404)
        


class DoctorDetailsUpdate(generics.UpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorCustomIDSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user'  

    def get_object(self):
        return self.queryset.get(user=self.request.user)


class DoctorUserIdView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserDoctorCustomIDSerializer
    permission_classes = [IsAuthenticated]    
    lookup_field = 'pk'



class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class ProfilePicUpdate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KycVerificationUpload(APIView):
    serializer_class = VarificationSerializer

    def get_object(self, user_id):
        try:
            return Verification.objects.get(user_id=user_id)
        except Verification.DoesNotExist:
            return None
        
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        verification = self.get_object(user_id)
        if verification is None:
            return Response({"status": "error", "message": "No KYC data found for this user"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(verification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        verification = self.get_object(user_id)
        if verification is None:
            # If no Verification instance exists for this user_id, create a new one
            serializer = self.serializer_class(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user_id=user_id)
                return Response({"status": "success", "message": "KYC submitted successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If a Verification instance already exists, update it
            serializer = self.serializer_class(verification, data=request.data, context={'request': request}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"status": "success", "message": "KYC updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDocVerificationView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminDocVerificationSerializer
    lookup_field = 'user_id'
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user_verificaion = get_object_or_404(Verification, user__id = user_id)
        return Verification.objects.filter(user = user_verificaion.user )
        



class AdminDoctorApprovalListView(generics.ListAPIView):
    queryset = User.objects.filter( Q(user_type='doctor') )
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAdminUser]
    serializer_class = UserDetailsUpdateSerializer


class DoctorListViewlistbooking(generics.ListAPIView):
    queryset = User.objects.filter( Q(user_type='doctor') )
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = UserDetailsUpdateSerializerlistbooking


class AdminDoctorApprovalListView(generics.ListAPIView):
    queryset = User.objects.filter( Q(user_type='doctor') )
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAdminUser]
    serializer_class = UserDetailsUpdateSerializer




class AdminDoctorListView(generics.ListAPIView):
    queryset = User.objects.filter( Q(user_type='doctor') & Q(approval_status='APPROVED'))
    # print(queryset,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAdminUser]
    serializer_class = UserDetailsUpdateSerializer


class AdminDocDelete(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'
    

class AdminDocEdit(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AdminDocUpdateSerializer
    lookup_field = 'pk'


class AdminClientUpdate(generics.RetrieveUpdateAPIView):
    queryset=Patient.objects.all()
    serializer_class = AdminClientUpdateSerializer
    lookup_field = 'pk'
    


    
class PatientUseDetailsUpdate(generics.ListAPIView):
    queryset = User.objects.filter(user_type='patient')
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PatientUserSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']

class AdminISActive(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AdminDocUpdateSerializer
    lookup_field = 'pk'


class AdminISActivePatient(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AdminPatientUpdateSerializer
    lookup_field = 'pk'


class AdminDocVarification(generics.RetrieveUpdateAPIView):
    queryset = Verification.objects.all()
    serializer_class = AdminDocVerificationSerializerApprove
    lookup_field = 'pk'


class UserDetailsUpdate(generics.ListAPIView):
    queryset = User.objects.filter( Q(user_type='doctor') & Q(approval_status='APPROVED'))
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = UserDetailsUpdateSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter based on gender
        gender = self.request.query_params.get('gender', None)
        if gender:
            queryset = queryset.filter(gender=gender)

        # Filter based on specialization
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(doctor_user__specializations__icontains=specialization)

        return queryset



class AdminDocUpdate(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AdminDocUpdateSerializer
    lookup_field = 'pk'

class ClientDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PatientUserSerializer
    lookup_field = 'pk'    



class DocDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = UserDetailsUpdateSerializer
    lookup_field = 'pk'
    

class PatientDetailList(generics.RetrieveAPIView):
    queryset = Patient.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = AdminPatientUpdateSerializer
    lookup_field = 'pk'


class DoctorListSpecialization(generics.ListAPIView):
    serializer_class = DoctorCustomIDSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'user__phone_number']

    def get_queryset(self):
        queryset = Doctor.objects.filter(user__user_type='doctor', user__approval_status='APPROVED')

        # Filter based on gender
        gender = self.request.query_params.get('gender', None)
        if gender:
            queryset= queryset.filter(user__gender=gender)

        # Use the specialization from the URL path
        specialization = self.kwargs.get('specialization', None)
        if specialization:
            queryset = queryset.filter(specializations__icontains=specialization)

        return queryset


class PatientCustomIdView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserPatientCustomIDSerializer
    lookup_field = 'pk'    


class DoctorCustomIdView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDoctorCustomIDSerializer2
    lookup_field = 'pk' 
