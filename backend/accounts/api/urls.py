from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

    #  ********************************Token*****************************

    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    #################################Register#############################
    path('register',views.RegisterView.as_view(), name="user-register"),
    path('login',views.UserLogin.as_view(), name="user-user-login"),
    path('logout', views.UserLogout.as_view(), name='user-logout'),
    path('verify-otp', views.OTPVerificationView.as_view(), name='verify-otp'),



]