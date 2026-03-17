from channels.generic.websocket import WebsocketConsumer
from djangochannelsrestframework import mixins
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from community.models import Thread
from community.serializers import ThreadSerializer


class ThreadConsumer(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        mixins.PatchModelMixin,
        mixins.UpdateModelMixin,
        mixins.CreateModelMixin,
        mixins.DeleteModelMixin,
        GenericAsyncAPIConsumer,
):

    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer
