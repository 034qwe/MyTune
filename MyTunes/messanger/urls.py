from django.urls import path

from .views import RoomHistoryAPIVIew

urlpatterns = [
    path('messanger/history/<str:room_name>/', RoomHistoryAPIVIew.as_view()),

]