"""
ASGI config for Backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns

# Ensure Django is set up before importing any Django-specific modules
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

# Import the ASGI application from Django
application = get_asgi_application()

# Define the ASGI application with routing for HTTP and WebSocket requests
application = ProtocolTypeRouter({
    "http": application,
    "websocket": URLRouter(websocket_urlpatterns),
})
