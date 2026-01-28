from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from .models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view
import logging

logger = logging.getLogger(__name__)

@api_view(["POST"])
def google_auth(request):
    token = request.data.get("token")
    
    if not token:
        return Response(
            {"error": "Token not provided", "status": False}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        id_info = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_OAUTH_CLIENT_ID
        )
        
        # Extract user information
        email = id_info.get('email')
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        
        if not email:
            return Response(
                {"error": "Email not found in token", "status": False},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'registration_method': 'google',
                'is_active': True
            }
        )
        
        # If user exists but registered with email
        if not created and user.registration_method != 'google':
            return Response({
                "error": "This email is already registered with email/password. Please use email login.",
                "status": False
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Update user info if it was created or if it's a returning Google user
        if created or user.registration_method == 'google':
            user.first_name = first_name
            user.last_name = last_name
            user.is_active = True
            if created:
                user.set_unusable_password()
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "status": True
        }, status=status.HTTP_200_OK)
            
    except ValueError as e:
        logger.error(f"Google token verification failed: {str(e)}")
        return Response(
            {"error": "Invalid token", "status": False}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Google auth error: {str(e)}")
        return Response(
            {"error": "Authentication failed", "status": False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    if not email or not password:
        return Response(
            {"error": "Email and password are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "User with this email already exists"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    try:
        user = User.objects.create_user(email=email, password=password)
        user.is_active = True
        user.save()
        
        return Response(
            {"message": "User created successfully"}, 
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response(
            {"error": "Registration failed"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )