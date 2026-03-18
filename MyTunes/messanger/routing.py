from django.urls import path

from consumers import MessageWSConsumer
from views import RoomHistoryAPIVIew

ws_urlpatterns = [
    path('ws/messanger/<str:room_name>/', MessageWSConsumer.as_asgi()),
    path('messanger/history/<str:room_name>/', RoomHistoryAPIVIew.as_view()),

]