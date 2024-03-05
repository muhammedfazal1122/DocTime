from rest_framework.views import APIView
from .serializers import User,UserRegisterSerializer,UserSerializer, OTPModel,DoctorSerializer
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
        send_mail(
            "OTP AUTHENTICATING DocTime",
            f"{random_num} -OTP",
            "ecomm.apps.info@gmail.com",
            [email],
            fail_silently=False,
            )
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
        

        content = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'isAdmin': user.is_superuser,
            'is_doctor': user.is_doctor(),
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
            # Check if the 'email' key is present in request.data
            if 'email' in request.data:
                user = User.objects.get(email=request.data['email'])
                print(user,'user+++++++++++++++++++')
                
                otp_object = OTPModel.objects.get(user=user)
                print(otp_object,'otp_object')
                if otp_object.otp == int(request.data['otp']):
                    user.is_active = True
                    user.save()
                    return Response("User successfully verified",status=200)
                else:
                    return Response("OTP is wrong",status=400)
            else:
                return Response("Email is required", status=400)
        except ObjectDoesNotExist:
            return Response("User does not exist or OTP not generated", status=404)
        
class DoctotRegister(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        serizer = DoctorSerializer.is_valid()
