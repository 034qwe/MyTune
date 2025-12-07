from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
import inspect

class MusicSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # cover = serializers.ImageField(max_length=None, use_url=True)
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        categ = obj.category_song

        bridges = Category_Bridge.objects.filter(song=categ)
        return [i.cat.cat_name for i in bridges]
    
    class Meta:
        model = Music
        fields = '__all__' 
        

class CreatorSerializer(serializers.ModelSerializer):
    account = serializers.HiddenField(default=serializers.CurrentUserDefault())
    

    class Meta:
        model = Creator
        fields = '__all__'

class AlbumSerializer(serializers.ModelSerializer):
    tracks = serializers.SerializerMethodField()
    creator =serializers.PrimaryKeyRelatedField(read_only=True)
    
    def get_tracks(self, obj):
        return list(obj.music_set.values_list('title', flat=True))
    

    class Meta:
        model = Album
        fields = '__all__'
    
    
 