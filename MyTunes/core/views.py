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
    # def get_gueryset(self):
    #     pk = self.kwargs.get('pk')    
    #     music = Music.objects.get(pk=pk)
    #     if music.cover.name[-3:] != 'mp.4':
    #         print(music.cover.name[-3:])
    #         return Response({"error": "File must be an mp4."}, status=400)
    #     else:
    #         return Music.objects.all()
    serializer_class = MusicSerializer
    permission_classes = (IsAuthenticated,)
