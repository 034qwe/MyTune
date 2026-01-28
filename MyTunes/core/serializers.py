from rest_framework import serializers
from coolAuth.models import User
from .models import *
# import inspect

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MusicSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # cover = serializers.ImageField(max_length=None, use_url=True)
    category = serializers.SerializerMethodField()
    category_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    def get_category(self, obj):
        try:
            categ = obj.category_song
            bridges = Category_Bridge.objects.filter(song=categ)
            return [i.cat.cat_name for i in bridges]
        except:
            return []
    
    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        music = super().create(validated_data)
        
        if category_ids:
            # Create Category_Song linking to Music
            category_song, created = Category_Song.objects.get_or_create(which_music=music)
            
            # Create Bridges for each category
            for cat_id in category_ids:
                try:
                    category = Category.objects.get(id=cat_id)
                    Category_Bridge.objects.create(song=category_song, cat=category)
                except Category.DoesNotExist:
                    continue
                    
        return music

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
        return list(obj.music_set.values('id','title','tune','description'))
    

    class Meta:
        model = Album
        fields = '__all__'
    
    
 
