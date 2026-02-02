from django.urls import path, include
from .views import MakeAdminAPIView


urlpatterns = [
    path('add/admin/',MakeAdminAPIView.as_view()),
]
