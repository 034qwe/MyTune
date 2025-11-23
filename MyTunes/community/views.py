from django.shortcuts import render
from rest_framework import generics ,status 
from .serializers import ThreadSerializer
from .models import (
    Thread,
    Like_Comment,
    Like_Thread,
    Comment
    )

# Create your views here.

class ThreadAPView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    queryset = Thread.objects.all()
