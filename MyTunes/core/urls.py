
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from .views import MusicAPIVIew, CreatorAPIAdd, MyMusicAPIView, AlbumAPIVIew


urlpatterns = [
    path('core/music/', MusicAPIVIew.as_view()),
    # path("core/musicadd/", MusicAPICreate.as_view()),
    path('core/creatoradd/', CreatorAPIAdd.as_view()),
    path('core/mymusic/', MyMusicAPIView.as_view()),
    path('core/albums/',AlbumAPIVIew.as_view())
    
]