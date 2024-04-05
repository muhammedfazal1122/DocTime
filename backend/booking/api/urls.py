from django.urls import path
from . import views
from .views import TransactionAPIView,TrasactionListAPIView,TrasactionRetriveAPIView



urlpatterns = [

# -----------------------------------------Doctor------------------------------------------------------#

    path('doctors/<str:custom_id>/slots/', views.DoctorSlotListCreateView.as_view(), name='doctor-slots-create'),    

# -----------------------------------------Patient-------------------------------------------------------#

    path('patient/slotsview/<str:custom_id>/<str:date>/', views.PatientSlotView.as_view(), name='doctor-slots-view'),

    path('check-availability/',views.check_availability, name='check-availability'),

    path('create-order/', views.RazorpayOrderAPIView.as_view(), name='create_order'),

    path('complete-order/', TransactionAPIView.as_view(), name='complete_order'),

    
    # for getting the booking details for the perticular patient for Patient side listing

    path('booking/details/patient/<str:patient_id>', views.PatientBookingDetailsAPIView, name='booking-details'),

# ---------------------------------------------ADMIN--------------------------------------------------------

    path('detail/transaction/list/', TrasactionListAPIView.as_view(), name='doctor-slots-api'),

    path('detail/transaction/<str:pk>', TrasactionRetriveAPIView.as_view(), name='doctor-slots-api'),



]
