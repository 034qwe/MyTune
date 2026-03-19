from django.shortcuts import render
from rest_framework import generics
from .models import Room , Message
from .serializers import MessageSerializer
# Create your views here.


class RoomHistoryAPIVIew(generics.ListAPIView):
    def get_queryset(self):
        room_name = self.kwargs['room_name']
        try:
            room = Room.objects.get(name=room_name)
            return room.messages.order_by('created_at')
        except Room.DoesNotExist:
            return Message.objects.none()
    
    serializer_class = MessageSerializer
        