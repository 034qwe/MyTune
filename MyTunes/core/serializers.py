from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Music

class MusicSerializer(serializers.ModelSerializer):
    # owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Music
        fields = '__all__'