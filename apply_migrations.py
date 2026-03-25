#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, r'c:\Users\786 Computers\Desktop\CoreConnectHRMS')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreconnect_backend.settings')
django.setup()

from django.core.management import execute_from_command_line

# Run makemigrations
print("Creating migrations...")
execute_from_command_line(['manage.py', 'makemigrations'])

# Run migrate
print("\nApplying migrations...")
execute_from_command_line(['manage.py', 'migrate'])

print("\nMigrations completed successfully!")
