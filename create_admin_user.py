import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreconnect_backend.settings')
django.setup()

from api.models import User, Role

def create_admin():
    # Create Role
    admin_role, created = Role.objects.get_or_create(name='Admin')
    if created:
        print("Created 'Admin' role.")
    else:
        print("'Admin' role already exists.")

    # Create User
    email = 'admin@coreconnect.com'
    password = 'password'
    
    if User.objects.filter(email=email).exists():
        print(f"User with email {email} already exists.")
    else:
        User.objects.create(
            username='Admin User',
            email=email,
            password=password, # Note: In a real app, hash this!
            role=admin_role,
            first_name='Admin',
            last_name='User',
            department='Management',
            designation='Administrator'
        )
        print(f"Created user {email} with password '{password}'")

if __name__ == '__main__':
    create_admin()
