from django.db import models
from django.contrib.auth.models import User
from rest_framework.response import Response

# Create your models here.
def user_covers_path(instance,filename):
    return f'covers/{instance.owner.username}/{filename}'
    

def user_tunes_path(instance, filename):
    # if filename[-3:] != 'mp4':
    #     return Response({"error": "File must be an mp4."}, status=400)
    return f'tunes/{instance.owner.username}/{filename}'

class Music(models.Model):
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cover = models.ImageField(upload_to=user_covers_path,null=True,)
    title = models.CharField(max_length=300)
    description = models.TextField(null=True)
    tune  = models.FileField(upload_to=user_tunes_path)

    def __str__(self):
        return self.title

    


