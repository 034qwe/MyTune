from django.urls import path, include
from .views import ThreadAPView


urlpatterns = [
    path('comm/threads/', ThreadAPView.as_view()),
]