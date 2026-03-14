from django.urls import path

from .consumers import MessageWSConsumer

ws_urlpatterns = [
    path('ws/messanger/',MessageWSConsumer.as_asgi())
]