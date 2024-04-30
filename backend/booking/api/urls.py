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

    path('update-order/<str:transaction_id>/', views.UpdateOrderAPIView.as_view(), name='update_order'),
    
    # for getting the booking details for the perticular patient for Patient side listing

    path('booking/details/patient/<str:patient_id>', views.PatientBookingDetailsAPIView, name='booking-details'),

    path('booking/details/doctor/<str:doctor_id>', views.DoctorBookingDetailsAPIView, name='booking-details'),

    path('booking/details/doctor/<str:doctor_id>/patient/<str:patient_id>', views.DoctorBookingDetailsAPIViewChat, name='booking-details'),
# ---------------------------------------------ADMIN--------------------------------------------------------

    path('detail/transaction/list/', TrasactionListAPIView.as_view(), name='doctor-slots-api'),

    path('detail/transaction/<str:pk>', TrasactionRetriveAPIView.as_view(), name='doctor-slots-api'),

    path('api/patient-transactions/', views.PatientTransactionsAPIView.as_view(), name='patient-transactions'),


    #  to get the single Patient details based on the custom id

    path('reviews/create/', views.ReviewCreateView.as_view(), name='review-create'),
    path('reviews/<str:doctor_id>/', views.ReviewListView.as_view(), name='review-list'),

    path('upload-prescription/<str:transaction_id>/', views.UploadPrescriptionView.as_view(), name='upload-prescription'),

    path("Notification/<str:pk>", views.PatientDetailList().as_view(), name="Doc-list"),

    path('api/doctor-transactions/', views.DoctorTransactionsAPIView.as_view(), name='doctor-transactions'),

    path('prescription/create/', views.PrescriptionCreateView.as_view(), name='prescription-create'),
    path('prescription/update/<int:pk>/', views.PrescriptionUpdateView.as_view(), name='prescription-update'),

    path('prescriptions/display/<str:transaction_id>/', views.PatientPrescriptionsView.as_view(), name='prescription-get'),
    
    path('transactionCommission/', views.TransactionCommissionView.as_view(), name='transaction_commission'),

    path('geting/transaction/<str:transaction_id>/', views.GetingTransaction.as_view(), name='transaction_'),

    ]
