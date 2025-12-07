from django.shortcuts import render
from rest_framework import generics ,viewsets, status 
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from django.db import IntegrityError

# Create your views here.
class MusicAPIVIew(generics.ListCreateAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        
        creator = Creator.objects.get(account=self.request.user)
        serializer.save(owner=creator)

# class MusicAPICreate(generics.CreateAPIView):
#     # def get_gueryset(self):
#     #     pk = self.kwargs.get('pk')    
#     #     music = Music.objects.get(pk=pk)
#     #     if music.cover.name[-3:] != 'mp.4':
#     #         print(music.cover.name[-3:])
#     #         return Response({"error": "File must be an mp4."}, status=400)
#     #     else:
#     #         return Music.objects.all()
#     serializer_class = MusicSerializer
#     permission_classes = (IsAuthenticated,)

class MyMusicAPIView(generics.ListAPIView):
    def get_queryset(self):
        return Music.objects.filter(owner__account__pk=self.request.user.pk)

    serializer_class = MusicSerializer
    permission_classes = (IsAuthenticated,)

class AlbumAPIVIew(generics.ListCreateAPIView):
    def perform_create(self, serializer):
        creator = Creator.objects.get(account=self.request.user)
        serializer.save(creator=creator)

    def get_queryset(self):
        return Album.objects.filter(release=True)

    permission_classes = (IsAuthenticated,)
    serializer_class = AlbumSerializer  
    



class CreatorAPIAdd(APIView):
    permission_classes =(IsAuthenticated,)

    def post(self, request):  
        serializer = CreatorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                serializer.save()
            except IntegrityError:
                return Response(
                    {"detail": "Creator already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DiscographyAPIView(generics.ListAPIView):
    def get_queryset(self):
        return Album.objects.filter(creator__nickname=self.kwargs['creator_slug'].replace('_',' '),)
    
    serializer_class = AlbumSerializer
    
        






        
    # def get_queryset(self):
    #     if Creator.objects.filter(account__pk = self.kwargs.get('pk')):
    #         pass
    #     else: return Response('FAILURE')


    # queryset = Creator.objects.all()

    # serializer_class = CreatorSerializer
    

