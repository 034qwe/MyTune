from channels.generic.websocket import WebsocketConsumer


class MessageWSComsumer(WebsocketConsumer):
    def  connect(self):
        self.accept()
        