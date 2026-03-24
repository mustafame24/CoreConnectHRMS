#!/usr/bin/env python
"""
Sprint 2 API Test Script
Test all endpoints without leaving the terminal
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"
TOKENS = {}

# ANSI Colors
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def print_header(title):
    print(f"\n{BLUE}{'='*60}")
    print(f"{title}")
    print(f"{'='*60}{RESET}\n")

def print_success(msg):
    print(f"{GREEN}[OK] {msg}{RESET}")

def print_error(msg):
    print(f"{RED}[ERROR] {msg}{RESET}")

def print_info(msg):
    print(f"{YELLOW}[INFO] {msg}{RESET}")

# ============================================
# 1. LOGIN & GET TOKENS
# ============================================
def test_login():
    print_header("1. AUTHENTICATION - Login & Get Tokens")
    
    credentials = {
        'admin': {'email': 'admin@hrms.com', 'password': 'Admin@123'},
        'hr': {'email': 'hr@hrms.com', 'password': 'HR@123'},
        'employee': {'email': 'employee@hrms.com', 'password': 'Employee@123'}
    }
    
    for role, creds in credentials.items():
        response = requests.post(f"{BASE_URL}/auth/login", json=creds)
        if response.status_code == 200:
            data = response.json()
            TOKENS[role] = data['token']
            print_success(f"{role.upper()} login successful")
            print(f"  Token: {TOKENS[role][:50]}...")
        else:
            print_error(f"Failed to login as {role}")
            print(f"  Response: {response.text}")

# ============================================
# 2. ADD NEW EMPLOYEE (Admin)
# ============================================
def test_add_employee():
    print_header("2. EMPLOYEE MANAGEMENT - Add New Employee (Admin)")
    
    headers = {'Authorization': f'Bearer {TOKENS["admin"]}'}
    timestamp = int(datetime.now().timestamp())
    new_employee = {
        'username': f'emp_new_{timestamp}',
        'email': f'newemployee{timestamp}@company.com',
        'password': 'NewEmp@123',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'department': 'Marketing',
        'designation': 'Marketing Manager',
        'hire_date': '2025-01-16',
        'phone_number': '555-1234',
        'address': '456 Oak Ave, Town, State'
    }
    
    response = requests.post(f"{BASE_URL}/employees", json=new_employee, headers=headers)
    if response.status_code == 201:
        data = response.json()
        print_success("Employee added successfully")
        emp_id = data['data']['id']
        emp_name = f"{data['data']['first_name']} {data['data']['last_name']}"
        print(f"  Employee ID: {emp_id}")
        print(f"  Name: {emp_name}")
        print(f"  Email: {data['data']['email']}")
        return emp_id
    else:
        print_error("Failed to add employee")
        print(f"  Response: {response.text}")
        return None

# ============================================
# 3. VIEW EMPLOYEE PROFILE
# ============================================
def test_view_profile(employee_id=3):
    print_header("3. EMPLOYEE MANAGEMENT - View Employee Profile")
    
    headers = {'Authorization': f'Bearer {TOKENS["employee"]}'}
    response = requests.get(f"{BASE_URL}/employees/{employee_id}", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        emp = data['data']
        print_success("Employee profile retrieved")
        print(f"  Name: {emp['first_name']} {emp['last_name']}")
        print(f"  Email: {emp['email']}")
        print(f"  Department: {emp['department']}")
        print(f"  Designation: {emp['designation']}")
        print(f"  Hire Date: {emp['hire_date']}")
    else:
        print_error("Failed to get employee profile")

# ============================================
# 4. EDIT EMPLOYEE INFO (HR)
# ============================================
def test_edit_employee(employee_id=3):
    print_header("4. EMPLOYEE MANAGEMENT - Edit Employee Info (HR)")
    
    headers = {'Authorization': f'Bearer {TOKENS["hr"]}'}
    updates = {
        'designation': 'Senior Software Engineer',
        'phone_number': '555-9999'
    }
    
    response = requests.put(f"{BASE_URL}/employees/{employee_id}", json=updates, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        emp = data['data']
        print_success("Employee info updated")
        print(f"  New Designation: {emp['designation']}")
        print(f"  New Phone: {emp['phone_number']}")
    else:
        print_error("Failed to update employee")

# ============================================
# 5. MARK ATTENDANCE (Employee)
# ============================================
def test_mark_attendance():
    print_header("5. ATTENDANCE - Mark Attendance (Employee)")
    
    headers = {'Authorization': f'Bearer {TOKENS["employee"]}'}
    attendance = {
        'status': 'present',
        'notes': 'Regular work day'
    }
    
    response = requests.post(f"{BASE_URL}/attendance/mark", json=attendance, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        print_success("Attendance marked successfully")
        print(f"  Date: {data['data']['date']}")
        print(f"  Status: {data['data']['status']}")
        print(f"  Check-in: {data['data']['check_in_time']}")
    elif response.status_code == 400 and 'already marked' in response.text:
        print_info("Attendance already marked for today (expected)")
    else:
        print_error("Failed to mark attendance")
        print(f"  Response: {response.text}")

# ============================================
# 6. ATTENDANCE SUMMARY (Admin)
# ============================================
def test_attendance_summary():
    print_header("6. ATTENDANCE - Daily Summary (Admin)")
    
    headers = {'Authorization': f'Bearer {TOKENS["admin"]}'}
    response = requests.get(f"{BASE_URL}/attendance/summary", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        summary = data['summary']
        print_success("Attendance summary retrieved")
        print(f"  Date: {data['date']}")
        print(f"  Total Employees: {summary['total_employees']}")
        print(f"  Marked: {summary['marked']}")
        print(f"  Not Marked: {summary['not_marked']}")
        print(f"  Present: {summary['present']}")
        print(f"  Absent: {summary['absent']}")
        print(f"  On Leave: {summary['on_leave']}")
    else:
        print_error("Failed to get attendance summary")

# ============================================
# 7. APPLY FOR LEAVE (Employee)
# ============================================
def test_apply_leave():
    print_header("7. LEAVE - Apply for Leave (Employee)")
    
    headers = {'Authorization': f'Bearer {TOKENS["employee"]}'}
    tomorrow = (datetime.now() + timedelta(days=1)).date()
    after_tomorrow = (datetime.now() + timedelta(days=3)).date()
    
    leave_request = {
        'leave_type': 'casual',
        'start_date': str(tomorrow),
        'end_date': str(after_tomorrow),
        'reason': 'Personal appointment'
    }
    
    response = requests.post(f"{BASE_URL}/leave/apply", json=leave_request, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        print_success("Leave request submitted")
        print(f"  Leave ID: {data['data']['id']}")
        print(f"  Type: {data['data']['leave_type']}")
        print(f"  From: {data['data']['start_date']}")
        print(f"  To: {data['data']['end_date']}")
        print(f"  Days: {data['data']['days_count']}")
        print(f"  Status: {data['data']['status']}")
        return data['data']['id']
    else:
        print_error("Failed to apply for leave")
        print(f"  Response: {response.text}")
        return None

# ============================================
# 8. VIEW LEAVE STATUS (Employee)
# ============================================
def test_view_leave_status():
    print_header("8. LEAVE - View Leave Status (Employee)")
    
    headers = {'Authorization': f'Bearer {TOKENS["employee"]}'}
    response = requests.get(f"{BASE_URL}/leave/status", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Leave requests retrieved ({data['count']} total)")
        for leave in data['data']:
            print(f"\n  Leave ID: {leave['id']}")
            print(f"    Type: {leave['leave_type']}")
            print(f"    Period: {leave['start_date']} to {leave['end_date']}")
            print(f"    Status: {leave['status']}")
            print(f"    Days: {leave['days_count']}")
    else:
        print_error("Failed to get leave status")

# ============================================
# 9. APPROVE LEAVE (HR)
# ============================================
def test_approve_leave(leave_id=1):
    print_header("9. LEAVE - Approve Leave (HR)")
    
    headers = {'Authorization': f'Bearer {TOKENS["hr"]}'}
    approval = {'action': 'approve'}
    
    response = requests.put(f"{BASE_URL}/leave/{leave_id}/approval", json=approval, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success("Leave approved")
        print(f"  Leave ID: {data['data']['id']}")
        print(f"  New Status: {data['data']['status']}")
        print(f"  Approved By: {data['data']['approved_by_name']}")
    elif response.status_code == 404:
        print_info("Leave request not found (create one first)")
    else:
        print_error("Failed to approve leave")
        print(f"  Response: {response.text}")

# ============================================
# 10. EXPORT ATTENDANCE REPORT (HR)
# ============================================
def test_attendance_report():
    print_header("10. ATTENDANCE - Export Report (HR)")
    
    headers = {'Authorization': f'Bearer {TOKENS["hr"]}'}
    params = {
        'start_date': (datetime.now() - timedelta(days=7)).date(),
        'end_date': datetime.now().date()
    }
    
    response = requests.get(f"{BASE_URL}/attendance/report", headers=headers, params=params)
    
    if response.status_code == 200:
        print_success("Attendance report generated (CSV format)")
        lines = response.text.split('\n')[:5]
        print("  Sample data:")
        for line in lines[:3]:
            print(f"    {line}")
    else:
        print_error("Failed to generate report")

# ============================================
# MAIN TEST RUNNER
# ============================================
def main():
    print(f"\n{BLUE}{'='*60}")
    print("SPRINT 2 - HRMS API TEST SUITE")
    print(f"{'='*60}{RESET}")
    print(f"Server: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        # Run tests
        test_login()
        
        new_emp_id = test_add_employee()
        test_view_profile(3)
        test_edit_employee(3)
        
        test_mark_attendance()
        test_attendance_summary()
        
        leave_id = test_apply_leave()
        test_view_leave_status()
        if leave_id:
            test_approve_leave(leave_id)
        
        test_attendance_report()
        
        print(f"\n{BLUE}{'='*60}")
        print("TEST SUITE COMPLETED")
        print(f"{'='*60}{RESET}\n")
        
    except Exception as e:
        print_error(f"Test execution error: {str(e)}")

if __name__ == "__main__":
    main()
