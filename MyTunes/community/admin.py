from django.contrib import admin
from .models import Comment, Like_Comment,Like_Thread, Thread

# Register your models here.
admin.site.register(Comment)
admin.site.register(Like_Thread)
admin.site.register(Like_Comment)
admin.site.register(Thread)