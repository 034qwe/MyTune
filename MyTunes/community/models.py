from django.db import models
from core.models import Music, Album,Creator
from django.contrib.auth.models import User

# Create your models here.
class Thread(models.Model):
    time = models.DateTimeField(auto_now_add=True)
    author = models.OneToOneField(User,on_delete=models.CASCADE)
    text = models.TextField()


class Comment(models.Model):
    comment = models.TextField()
    about_w = models.ForeignKey(Thread,on_delete=models.CASCADE)
    when =  models.DateTimeField(auto_now_add=True)


class Like_Thread(models.Model):
    who = models.ForeignKey(User, on_delete=models.CASCADE)
    where = models.ForeignKey(Thread, on_delete=models.CASCADE)


class Like_Comment(models.Model):
    who = models.ForeignKey(User, on_delete=models.CASCADE)
    where = models.ForeignKey(Comment, on_delete=models.CASCADE)


