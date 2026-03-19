import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Message
from coolAuth.models import User


class MessageWSConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for a chat room.

    Connect:  ws://localhost:8000/ws/messanger/<room_name>/
    The client must send a JWT token as a query param for auth:
      ws://localhost:8000/ws/messanger/myroom/?token=<access_token>

    Message format (JSON) the client sends:
      { "message": "hello world" }

    Message format the server broadcasts back:
      {
        "message": "hello world",
        "user_email": "user@example.com",
        "created_at": "2026-03-17T12:00:00Z"
      }
    """

    async def connect(self):
        # 1. Get room name from the URL route
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # 2. Every room gets a channel group so all connected users receive messages
        self.room_group_name = f'chat_{self.room_name}'

        # 3. Authenticate the user via JWT token in query string
        self.user = await self.get_user_from_token()
        if self.user is None:
            # Reject the connection if auth fails
            await self.close(code=4001)
            return

        # 4. Join the channel group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # 5. Accept the WebSocket connection
        await self.accept()

        # 6. Add user to the room's current_users
        await self.add_user_to_room()

        # 7. Notify others that this user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_join',          # maps to the method user_join() below
                'user_email': self.user.email,
            }
        )

    async def disconnect(self, close_code):
        if not hasattr(self, 'room_group_name'):
            return

        # Remove user from the room's current_users
        await self.remove_user_from_room()

        # Notify others that this user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_leave',
                'user_email': self.user.email,
            }
        )

        # Leave the channel group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Called when the client sends a message over the WebSocket."""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
            return

        message_text = data.get('message', '').strip()
        if not message_text:
            await self.send(text_data=json.dumps({'error': 'Empty message'}))
            return

        # Save message to the database
        message = await self.save_message(message_text)

        # Broadcast message to everyone in the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',       # maps to the method chat_message() below
                'message': message_text,
                'user_email': self.user.email,
                'created_at': message.created_at.isoformat(),
            }
        )

    # -------------------------------------------------------------------------
    # Channel layer event handlers
    # These are called when group_send() dispatches an event of matching 'type'
    # -------------------------------------------------------------------------

    async def chat_message(self, event):
        """Sends a chat message to the WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'user_email': event['user_email'],
            'created_at': event['created_at'],
        }))

    async def user_join(self, event):
        """Notifies the client that someone joined the room."""
        await self.send(text_data=json.dumps({
            'type': 'user_join',
            'user_email': event['user_email'],
        }))

    async def user_leave(self, event):
        """Notifies the client that someone left the room."""
        await self.send(text_data=json.dumps({
            'type': 'user_leave',
            'user_email': event['user_email'],
        }))

    # -------------------------------------------------------------------------
    # Database helpers — must be async because consumers run in async context
    # database_sync_to_async wraps regular Django ORM calls
    # -------------------------------------------------------------------------

    @database_sync_to_async
    def get_user_from_token(self):
        """Parse the JWT access token from the query string and return the User."""
        from rest_framework_simplejwt.tokens import AccessToken
        from rest_framework_simplejwt.exceptions import TokenError

        query_string = self.scope.get('query_string', b'').decode()
        params = dict(p.split('=') for p in query_string.split('&') if '=' in p)
        token_str = params.get('token')

        if not token_str:
            return None

        try:
            token = AccessToken(token_str)
            user_id = token['user_id']
            return User.objects.get(id=user_id)
        except (TokenError, User.DoesNotExist):
            return None

    @database_sync_to_async
    def save_message(self, text):
        """Save a message to the database and return it."""
        room, _ = Room.objects.get_or_create(
            name=self.room_name,
            defaults={'host': self.user}
        )
        return Message.objects.create(room=room, user=self.user, text=text)

    @database_sync_to_async
    def add_user_to_room(self):
        room, _ = Room.objects.get_or_create(
            name=self.room_name,
            defaults={'host': self.user}
        )
        room.current_users.add(self.user)

    @database_sync_to_async
    def remove_user_from_room(self):
        try:
            room = Room.objects.get(name=self.room_name)
            room.current_users.remove(self.user)
        except Room.DoesNotExist:
            pass