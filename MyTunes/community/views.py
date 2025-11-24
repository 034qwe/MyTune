from django.shortcuts import render
from rest_framework import generics ,status 
from .serializers import ThreadSerializer
from .permissions import IsOwnerOrReadOnly
from .models import (
    Thread,
    Like_Comment,
    Like_Thread,
    Comment
    )

# Create your views here.

class ThreadAPIView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    queryset = Thread.objects.all()


class ThreadOneAPIVIew(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ThreadSerializer
    def get_queryset(self):
        return Thread.objects.filter(pk=self.kwargs.get('pk'))

    permission_classes =(IsOwnerOrReadOnly, )

    