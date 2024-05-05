from django.urls import path
from . import consumers
from notifications.consumers import NotificationConsumer

websocket_urlpatterns = [
    path('ws/chat/<int:appointment_id>/', consumers.ChatConsumer.as_asgi()),
    path('ws/doctor-notification/<str:custom_id>/', NotificationConsumer.as_asgi()),

]