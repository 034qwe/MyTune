from django.db import models
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.urls import reverse


# Create your models here.
def user_covers_path(instance,filename):
    return f'covers/{instance.creator.nickname}/{filename}'
    
def  user_icon_path(instance, filename):
    return f'icons/{instance.account.username}/{filename}'

def user_tunes_path(instance, filename):
    # if filename[-3:] != 'mp4':
    #     return Response({"error": "File must be an mp4."}, status=400)
    return f'tunes/{instance.owner.nickname}/{filename}'

class Creator(models.Model):
    account = models.OneToOneField(User,on_delete=models.CASCADE)
    icon = models.ImageField(null = True, upload_to=user_icon_path)
    description = models.TextField()
    nickname = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nickname

class Album(models.Model):
    create_time = models.DateField(auto_now_add=True)
    creator = models.ForeignKey(Creator,on_delete=models.CASCADE)
    cover_album = models.ImageField(upload_to=user_covers_path,null=True,)
    name = models.TextField(max_length=300)
    release = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse('cr', kwargs={'creator_slug':self.creator})

    

    def __str__(self):
        return self.name
    

class Music(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(Creator, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    description = models.TextField(null=True)
    tune  = models.FileField(upload_to=user_tunes_path)

    def __str__(self):
        return self.title

class Category_Song(models.Model):
    which_music = models.OneToOneField(Music,on_delete=models.CASCADE)

    def __str__(self):
        return self.which_music.title
    

class Category(models.Model):
    cat_name = models.CharField(max_length=100)


    def __srt__(self):
        return self.cat_name

class Category_Bridge(models.Model):
    song = models.ForeignKey(Category_Song,on_delete=models.CASCADE)
    cat = models.ForeignKey(Category,on_delete=models.CASCADE)

    def __srt__(self):
        return self.song__which_music.title
    
    






