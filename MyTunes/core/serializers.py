from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Music

class MusicSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # cover = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Music
        fields = '__all__'

# class MusicCreateSerializer(serializers.ModelSerializer):
#     owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

#     class Meta:
#         model = Music
#         fields = '__all__'