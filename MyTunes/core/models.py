from django.db import models
from django.contrib.auth.models import User

# Create your models here.
def user_covers_path(instance,filename):
    return f'covers/{instance.owner.username}/{filename}'

def user_tunes_path(instance, filename):
    print(filename[3:])
    return f'tunes/{instance.owner.username}/{filename}'

class Music(models.Model):
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cover = models.ImageField(upload_to=user_covers_path,null=True,)
    title = models.CharField(max_length=300)
    description = models.TextField(null=True)
    tune  = models.FileField(upload_to=user_tunes_path)

    def get_user(self):
        return User.objects.filter(pk=self.pk)


