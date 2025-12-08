from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Thread,
    Like_Comment,
    Like_Thread,
    Comment
    )
class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

        
class LikeThreadSerializer(serializers.ModelSerializer):
    who = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Like_Thread
        fields = "__all__"

class LikeCommentSerializer(serializers.ModelSerializer):
    who = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Like_Comment
        fields = '__all__'
    

class ThreadSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    comments  = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    

    def get_likes(self, obj):
        return len([i for i in Like_Thread.objects.filter(where__pk = obj.pk)])


    def get_comments(self, obj):

        comments_data = []
        for comment in Comment.objects.filter(about_w__pk = obj.pk):
            like_count = len([i for i in Like_Comment.objects.filter(where__pk = comment.pk)])
            comments_data.append({
                'id': comment.id,
                'text': comment.comment,
                'likes': like_count
            })
        return comments_data
    
    class Meta:
        model = Thread
        fields = '__all__'