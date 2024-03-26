from django.urls import path
from . import views


urlpatterns = [


    path('create-slots/', views.CreateSlotsView.as_view(), name='create_slots'),


]
