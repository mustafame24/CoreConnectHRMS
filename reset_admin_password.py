import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreconnect_backend.settings')
django.setup()

from api.models import User

def reset_admin_password():
    email = 'admin@coreconnect.com'
    new_password = 'password'
    
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)  # This will hash the password
        user.save()
        print(f"Password for {email} has been reset successfully!")
        print(f"New password: {new_password}")
    except User.DoesNotExist:
        print(f"User with email {email} not found.")

if __name__ == '__main__':
    reset_admin_password()

