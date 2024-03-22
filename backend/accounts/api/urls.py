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

    #  ********************************    Doctor Profile *****************************
    path("user/details/", views.UserDetails.as_view(), name="user-details"),
    path('doctor-update/<str:user>/', views.DoctorDetailsUpdate.as_view(), name='doctor-profile'),

    # for getting the Doctor cusom id using user id
    path("docdetailes/<str:pk>/",views.DoctorUserIdView.as_view(),name="user-id-doctor"),
    path("profilepic-update/", views.ProfilePicUpdate.as_view(), name="user-details"),

    #  ********************************   KycVerification *****************************

    path("KycVerification-upload/<str:user_id>/", views.KycVerificationUpload.as_view(), name="user-details"),


    #  ********************************   ADMIN  *****************************
    path("patient/details/", views.PatientUseDetailsUpdate.as_view(), name="patient-details"),
    path("admin/client/<str:pk>", views.AdminClientUpdate().as_view(), name="adminClient-Update"),

    path('admin/verification/doctor/<str:user__id>/', views.AdminDocVerificationView.as_view(), name='admin-verification-doctor'),

    path("admin/doctor/verication/list/", views.AdminDoctorApprovalListView.as_view(), name="admin-verification-doctor-list"),
    path("admin/doctor/list/", views.AdminDoctorListView.as_view(), name="admin-verification-doctor-list"),

    path("admin/doc/delete/<str:pk>/", views.AdminDocDelete.as_view(), name="admin-doctor-delete"),
    path("admin/doc/edit/<str:pk>/", views.AdminDocEdit.as_view(), name="admin-doctor-edit"),
    path("admin/doc/<str:pk>/", views.AdminISActive.as_view(), name="admin-doctor-isactive"),

    path("admin/patient-isactive/<str:pk>/", views.AdminISActivePatient.as_view(), name="admin-patient-isactive"),

    path("admin/doc/edit-varification/<str:pk>/", views.AdminDocVarification.as_view(), name="admin-doctor-varification-view"),

]