from django.urls import path

from .consumers import ThreadConsumer

ws_urlpatterns = [
    path('ws/messanger/',ThreadConsumer.as_asgi())
]