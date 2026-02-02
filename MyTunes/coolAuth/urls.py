from django.urls import path, include
from .views import MakeAdminAPIView, UsersListAPIView, UserMeAPIView


urlpatterns = [
    path('add/admin/',MakeAdminAPIView.as_view()),
    path('users/', UsersListAPIView.as_view()),
    path('auth/users/me/', UserMeAPIView.as_view()),
]
