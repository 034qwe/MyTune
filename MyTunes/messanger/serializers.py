from rest_framework import serializers
from .models import Room, Message
from coolAuth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'text', 'user', 'created_at']


class RoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['pk', 'name', 'host', 'messages', 'current_users', 'last_message']
        depth = 1
        read_only_fields = ['messages', 'last_message']

    def get_last_message(self, obj):
        last = obj.messages.order_by('created_at').last()
        if last:
            return MessageSerializer(last).data
        return None