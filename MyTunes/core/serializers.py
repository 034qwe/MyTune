from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class MusicSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # cover = serializers.ImageField(max_length=None, use_url=True)
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        cat_song = obj.category_song

   
        bridges = Category_Bridge.objects.filter(song=cat_song)


        return [b.cat.cat_name for b in bridges]
   

    


    class Meta:
        model = Music
        fields = '__all__' 

class CreatorSerializer(serializers.ModelSerializer):
    account = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Creator
        fields = '__all__'