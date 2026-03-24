import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class JWTAuthentication(BaseAuthentication):
    """
    Custom JWT Authentication class
    """
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None
        
        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
            
            # Decode token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            if not user_id:
                raise AuthenticationFailed('Invalid token payload')
            
            user = User.objects.get(id=user_id)
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except (ValueError, User.DoesNotExist):
            raise AuthenticationFailed('Invalid authentication credentials')


def generate_access_token(user):
    """
    Generate JWT access token for user
    """
    payload = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role.name,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token
