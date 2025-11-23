
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from .views import MusicAPIVIew, MusicAPICreate,CreatorAPIAdd


urlpatterns = [
    path('core/music/', MusicAPIVIew.as_view()),
    path("core/musicadd/", MusicAPICreate.as_view()),
    path('core/creatoradd/', CreatorAPIAdd.as_view())
    
]