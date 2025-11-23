from django.db import models
from core.models import Music, Album,Creator
from django.contrib.auth.models import User

# Create your models here.
class Thread(models.Model):
    title = models.CharField(max_length=150)
    time = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.title


class Comment(models.Model):
    comment = models.TextField()
    about_w = models.ForeignKey(Thread,on_delete=models.CASCADE)
    when =  models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.comment}({self.about_w.title})'

class Like_Thread(models.Model):
    who = models.ForeignKey(User, on_delete=models.CASCADE)
    where = models.ForeignKey(Thread, on_delete=models.CASCADE)


class Like_Comment(models.Model):
    who = models.ForeignKey(User, on_delete=models.CASCADE)
    where = models.ForeignKey(Comment, on_delete=models.CASCADE)


