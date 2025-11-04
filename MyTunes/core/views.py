from django.shortcuts import render
from rest_framework import generics ,viewsets
from .serializers import *
from .models import *

# Create your views here.
class MusicAPIVIew(generics.ListAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer