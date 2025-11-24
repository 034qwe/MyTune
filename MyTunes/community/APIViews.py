from rest_framework import mixins, views
from rest_framework.generics import GenericAPIView

class CreateDestroyAPIView(
                                   mixins.CreateModelMixin,
                                   mixins.DestroyModelMixin,
                                   GenericAPIView):

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
