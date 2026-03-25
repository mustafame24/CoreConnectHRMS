@echo off
cd "c:\Users\786 Computers\Desktop\CoreConnectHRMS"
"C:\Users\786 Computers\AppData\Local\Python\pythoncore-3.14-64\python.exe" manage.py makemigrations
"C:\Users\786 Computers\AppData\Local\Python\pythoncore-3.14-64\python.exe" manage.py migrate
echo Migrations completed!
pause
