from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from ..models import Notification
from .serializer import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
