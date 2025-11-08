from django.shortcuts import render
from rest_framework import generics ,viewsets
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class MusicAPIVIew(generics.ListAPIView):
    
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

class MusicAPICreate(generics.CreateAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    permission_classes = (IsAuthenticated,)
