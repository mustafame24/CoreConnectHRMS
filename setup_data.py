#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreconnect_backend.settings')
django.setup()

from api.models import Role, User

# Create roles
roles = ['admin', 'hr', 'employee']
for role_name in roles:
    role, created = Role.objects.get_or_create(name=role_name)
    if created:
        print(f"✓ Created role: {role_name}")
    else:
        print(f"✓ Role already exists: {role_name}")

# Create test users
test_users = [
    {
        'username': 'admin_user',
        'email': 'admin@hrms.com',
        'password': 'Admin@123',
        'role_name': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'department': 'Administration',
        'designation': 'Administrator'
    },
    {
        'username': 'hr_user',
        'email': 'hr@hrms.com',
        'password': 'HR@123',
        'role_name': 'hr',
        'first_name': 'HR',
        'last_name': 'Manager',
        'department': 'Human Resources',
        'designation': 'HR Manager'
    },
    {
        'username': 'emp_user',
        'email': 'employee@hrms.com',
        'password': 'Employee@123',
        'role_name': 'employee',
        'first_name': 'John',
        'last_name': 'Doe',
        'department': 'Engineering',
        'designation': 'Software Engineer'
    }
]

for user_data in test_users:
    role_name = user_data.pop('role_name')
    role = Role.objects.get(name=role_name)
    password = user_data.pop('password')
    
    user, created = User.objects.get_or_create(
        username=user_data['username'],
        defaults={**user_data, 'role': role}
    )
    
    if created:
        user.set_password(password)
        user.save()
        print(f"✓ Created user: {user.username} ({role_name})")
    else:
        print(f"✓ User already exists: {user.username}")

print("\n✓ Setup completed!")
print("\nTest Credentials:")
print("=" * 50)
for user_data in test_users:
    print(f"Role: {user_data['role_name'].upper()}")
    print(f"  Email: {user_data['email']}")
    print(f"  Password: {user_data.get('password', 'Employee@123')}")
    print()
