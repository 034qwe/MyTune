from django.views.decorators.cache import cache_page
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from .views import (
    MusicAPIVIew, CreatorAPIAdd, MyMusicAPIView,
    AlbumAPIVIew, DiscographyAPIView, MyAlbumaPIView
)


urlpatterns = [
    path('core/music/', cache_page(60)(MusicAPIVIew.as_view())),
    # path("core/musicadd/", MusicAPICreate.as_view()),
    path('core/creatoradd/', CreatorAPIAdd.as_view()),
    path('core/mymusic/', cache_page(60)(MyMusicAPIView.as_view())),
    path('core/albums/',cache_page(60)(AlbumAPIVIew.as_view())),
    path('core/discography/<slug:creator_slug>/',DiscographyAPIView.as_view()),
    path('core/myalbums/', MyAlbumaPIView.as_view())
    
]