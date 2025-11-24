from django.urls import path, include
from .views import ThreadAPIView, ThreadOneAPIVIew


urlpatterns = [
    path('comm/threads/', ThreadAPIView.as_view()),
    path("comm/edit-thread/<int:pk>/",ThreadOneAPIVIew.as_view())
]