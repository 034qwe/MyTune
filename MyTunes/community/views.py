from django.shortcuts import render
from rest_framework import generics ,status 
from .serializers import ThreadSerializer, LikeCommentSerializer, LikeThreadSerializer
from .permissions import IsOwnerOrReadOnly
from .APIViews import CreateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import (
    Thread,
    Like_Comment,
    Like_Thread,
    Comment
    )

# Create your views here.

class ThreadAPIView(generics.ListCreateAPIView):
    serializer_class = ThreadSerializer
    queryset = Thread.objects.all()


class ThreadOneAPIVIew(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ThreadSerializer
    def get_queryset(self):
        return Thread.objects.filter(pk=self.kwargs.get('pk'))

    permission_classes =(IsOwnerOrReadOnly, )

class MyThreadsAPIView(generics.ListAPIView):
    def get_queryset(self):
        return Thread.objects.filter(author__pk=self.request.user.pk)
    
    serializer_class = ThreadSerializer
    permission_classes = (IsAuthenticated,)
    
class LikeCommentAPIVIew(CreateDestroyAPIView):
    queryset = Like_Comment.objects.all()
    serializer_class = LikeCommentSerializer
    permission_classes = (IsAuthenticated,)

class LikeThreadAPIView(CreateDestroyAPIView):
    queryset = Like_Thread.objects.all()
    serializer_class = LikeThreadSerializer
    permission_classes = (IsAuthenticated,)

    