from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from backend.notifications.api import consumers

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': URLRouter([
        path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
    ]),
})
