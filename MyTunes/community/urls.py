from django.urls import path, include
from .views import (
    ThreadAPIView,
    ThreadOneAPIVIew,
    MyThreadsAPIView,
    LikeCommentAPIVIew,
    LikeThreadAPIView,
    AddCommentAPIView
    )


urlpatterns = [
    path('comm/threads/', ThreadAPIView.as_view()),
    path("comm/edit-thread/<int:pk>/",ThreadOneAPIVIew.as_view()),
    path("comm/MyThreads/", MyThreadsAPIView.as_view()),
    path("comm/CommentLike/",LikeCommentAPIVIew.as_view()),
    path("comm/ThreadLike/", LikeThreadAPIView.as_view()),
    path('comm/comments/',AddCommentAPIView.as_view())
]
