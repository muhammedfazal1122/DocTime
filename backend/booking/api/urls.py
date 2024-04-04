from django.urls import path
from . import views
from .views import TransactionAPIView



urlpatterns = [

# -----------------------------------------Doctor------------------------------------------------------#

    path('doctors/<str:custom_id>/slots/', views.DoctorSlotListCreateView.as_view(), name='doctor-slots-create'),    

# -----------------------------------------Patient-------------------------------------------------------#

    path('patient/slotsview/<str:custom_id>/<str:date>/', views.PatientSlotView.as_view(), name='doctor-slots-view'),

    path('check-availability/',views.check_availability, name='check-availability'),

    path('create-order/', views.RazorpayOrderAPIView.as_view(), name='create_order'),

    path('complete-order/', TransactionAPIView.as_view(), name='complete_order'),

]
