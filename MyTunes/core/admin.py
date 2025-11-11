from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Music)
admin.site.register(Creator)
admin.site.register(Album)
admin.site.register(Category)
admin.site.register(Category_Song)
admin.site.register(Category_Bridge)