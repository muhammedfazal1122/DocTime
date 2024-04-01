from django.urls import path
from . import views



urlpatterns = [

# -----------------------------------------Doctor------------------------------------------------------#

    path('doctors/<str:custom_id>/slots/', views.DoctorSlotListCreateView.as_view(), name='doctor-slots-create'),    

# -----------------------------------------Patient-------------------------------------------------------#

path('patient/slotsview/<str:custom_id>/<str:date>/', views.PatientSlotView.as_view(), name='doctor-slots-view'),


]
