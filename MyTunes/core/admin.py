from django.contrib import admin
from .models import Music, Album, Creator
# Register your models here.

admin.site.register(Music)
admin.site.register(Creator)
admin.site.register(Album)