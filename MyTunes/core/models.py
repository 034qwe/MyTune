from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Music(models.Model):
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    cover = models.ImageField(upload_to='covers/',null=True)
    title = models.CharField(max_length=300)
    description = models.TextField(null=True)
    tune  = models.FileField(upload_to='tunes/')
