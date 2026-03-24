from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.db.models import Q
import csv
from datetime import datetime, timedelta

from .models import User, Role, Attendance, Leave
from .serializers import (
    UserSerializer, UserDetailSerializer, AttendanceSerializer,
    AttendanceReportSerializer, LeaveSerializer, LeaveApprovalSerializer,
    LoginSerializer, RoleSerializer
)
from .authentication import JWTAuthentication, generate_access_token
from .permissions import IsAdmin, IsHR, IsEmployee, IsAdminOrHR


# ==================== AUTHENTICATION ====================
class LoginView(APIView):
    """
    User login endpoint
    """
    permission_classes = []  # Allow unauthenticated access
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
                
                # Check password using the model's check_password method
                if user.check_password(password):
                    token = generate_access_token(user)
                    return Response({
                        'status': 'success',
                        'token': token,
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'role': user.role.name,
                            'department': user.department,
                            'designation': user.designation
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            
            except User.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'User not found'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    User registration endpoint (optional - for admin to create users)
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        data = request.data.copy()
        
        # Extract password and role_id
        password = data.pop('password', None)
        role_id = data.get('role_id')
        
        if not password:
            return Response({
                'status': 'error',
                'message': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Invalid role'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data['role'] = role_id
        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(password)
            user.save()
            
            return Response({
                'status': 'success',
                'message': 'User created successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== EMPLOYEE MANAGEMENT ====================
class EmployeeListCreateView(APIView):
    """
    1. Add new employee (POST) - Admin only
    2. Get all employees (GET) - Admin & HR
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all employees (all authenticated users can view)"""
        if not request.user or not hasattr(request.user, 'role'):
            return Response({
                'status': 'error',
                'message': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)

        employees = User.objects.filter(role__name='employee').select_related('role')
        serializer = UserDetailSerializer(employees, many=True)
        response = {
            'status': 'success',
            'data': serializer.data,
            'count': employees.count()
        }
        # Add a flag to indicate if user can add employees
        if request.user.role.name.lower() in ['admin', 'hr']:
            response['can_add_employee'] = True
        else:
            response['can_add_employee'] = False
        return Response(response, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Add new employee"""
        if not request.user or not hasattr(request.user, 'role'):
            return Response({
                'status': 'error',
                'message': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if request.user.role.name.lower() != 'admin':
            return Response({
                'status': 'error',
                'message': 'Only admins can add employees'
            }, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        password = data.pop('password', None)

        # Map frontend field names to backend field names
        if 'name' in data:
            name_parts = data.pop('name', '').split(' ', 1)
            data['first_name'] = name_parts[0]
            data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''

        if 'phone' in data:
            data['phone_number'] = data.pop('phone')

        # Ensure username is set
        if 'username' not in data or not data['username']:
            data['username'] = data.get('email', '').split('@')[0]

        # Set role to employee
        try:
            employee_role = Role.objects.get(name='employee')
            data['role_id'] = employee_role.id
        except Role.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Employee role not found'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generate a simple unique password if not provided
        if not password:
            email = data.get('email', '')
            initials = ''.join([part[0].lower() for part in email.split('@')[0].split('.') if part])
            if not initials:
                initials = email[:2].lower()
            base_password = f"temp{initials}@123"
            # Ensure uniqueness by checking for existing users with this password (not secure, but for demo)
            # In real systems, never check password like this, but here we want to avoid same temp password for same initials
            similar_users = User.objects.filter(password__startswith=base_password[:8])
            if similar_users.exists():
                password = f"{base_password}{similar_users.count()+1}"
            else:
                password = base_password

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(password)
            user.save()

            return Response({
                'status': 'success',
                'message': 'Employee added successfully',
                'data': UserDetailSerializer(user).data,
                'generated_password': password,
                'email': user.email
            }, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    """
    5. Edit employee info (PUT) - HR only
    6. View employee profile (GET)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, employee_id):
        """View employee profile"""
        try:
            employee = User.objects.get(id=employee_id, role__name='employee')
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Employee not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permission: admin, hr, or the employee themselves
        if request.user.role.name.lower() not in ['admin', 'hr'] and request.user.id != employee_id:
            return Response({
                'status': 'error',
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserDetailSerializer(employee)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request, employee_id):
        """Edit employee info - Employee can edit own info, Admin can edit anyone's info"""
        try:
            employee = User.objects.get(id=employee_id)
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Employee not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Permission check: Employee can only edit their own info, Admin can edit anyone's
        user_role = request.user.role.name.lower()
        if user_role == 'employee':
            if request.user.id != employee_id:
                return Response({
                    'status': 'error',
                    'message': 'You can only edit your own information'
                }, status=status.HTTP_403_FORBIDDEN)
        elif user_role != 'admin':
            return Response({
                'status': 'error',
                'message': 'Only employees can edit their own info and admins can edit anyone\'s info'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Prevent employees from changing certain fields (like role, email, username)
        if user_role == 'employee':
            # Remove fields that employees shouldn't be able to change
            restricted_fields = ['role', 'role_id', 'email', 'username']
            for field in restricted_fields:
                request.data.pop(field, None)
        
        serializer = UserSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Employee updated successfully',
                'data': UserDetailSerializer(employee).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ==================== ATTENDANCE ====================
class AttendanceMarkView(APIView):
    """
    3. Mark attendance (POST) - Employee only
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsEmployee]
    
    def post(self, request):
        """Mark attendance for current day"""
        from datetime import date, time
        
        today = date.today()
        user = request.user
        
        # Check if already marked today
        existing = Attendance.objects.filter(user=user, date=today).first()
        if existing:
            return Response({
                'status': 'error',
                'message': 'Attendance already marked for today'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        status_value = request.data.get('status', 'present')  # present, absent, leave
        
        # Create attendance record
        attendance = Attendance.objects.create(
            user=user,
            date=today,
            status=status_value,
            check_in_time=datetime.now().time() if status_value == 'present' else None,
            notes=request.data.get('notes', '')
        )
        
        serializer = AttendanceSerializer(attendance)
        return Response({
            'status': 'success',
            'message': 'Attendance marked successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class AttendanceSummaryView(APIView):
    """
    4. Attendance summary (GET) - Admin only
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        """Get daily attendance summary - Shows all employees with their attendance status"""
        from datetime import date
        
        today = date.today()
        
        # Get all employees
        all_employees = User.objects.filter(role__name__iexact='employee').select_related('role')
        
        # Get all attendance records for today
        today_attendance = Attendance.objects.filter(date=today).select_related('user')
        
        # Create a dictionary of user_id -> attendance record for quick lookup
        attendance_dict = {att.user_id: att for att in today_attendance}
        
        # Build response data with all employees
        employee_attendance_data = []
        for employee in all_employees:
            attendance_record = attendance_dict.get(employee.id)
            if attendance_record:
                # Employee has marked attendance
                serializer = AttendanceSerializer(attendance_record)
                employee_attendance_data.append(serializer.data)
            else:
                # Employee hasn't marked attendance yet
                employee_attendance_data.append({
                    'id': None,
                    'user': employee.id,
                    'user_name': employee.username,
                    'user_email': employee.email,
                    'date': today.isoformat(),
                    'status': 'not_marked',
                    'check_in_time': None,
                    'check_out_time': None,
                    'notes': None,
                    'created_at': None
                })
        
        # Count by status
        present_count = today_attendance.filter(status='present').count()
        absent_count = today_attendance.filter(status='absent').count()
        leave_count = today_attendance.filter(status='leave').count()
        not_marked_count = len(all_employees) - len(today_attendance)
        
        return Response({
            'status': 'success',
            'date': today.isoformat(),
            'summary': {
                'total_employees': len(all_employees),
                'marked': len(today_attendance),
                'not_marked': not_marked_count,
                'present': present_count,
                'absent': absent_count,
                'on_leave': leave_count
            },
            'data': employee_attendance_data
        }, status=status.HTTP_200_OK)


class AttendanceReportView(APIView):
    """
    2. Attendance report (GET) - Employee can view own report, Admin can view all reports
    Supports both JSON and CSV export formats
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get attendance report - JSON by default, CSV if format=csv"""
        user_role = request.user.role.name.lower()
        
        # Get query parameters for filtering
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        employee_id = request.query_params.get('employee_id')
        format_type = request.query_params.get('format', 'json')  # 'json' or 'csv'
        
        # Build query
        if user_role == 'employee':
            # Employee can only see their own attendance
            query = Attendance.objects.select_related('user').filter(user=request.user)
        elif user_role == 'admin':
            # Admin can see all attendance
            query = Attendance.objects.select_related('user').all()
            
            # Filter by employee if provided
            if employee_id:
                query = query.filter(user_id=employee_id)
        else:
            return Response({
                'status': 'error',
                'message': 'Permission denied. Only employees and admins can view attendance reports'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Apply date filters
        if start_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                query = query.filter(date__gte=start)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid start_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if end_date:
            try:
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                query = query.filter(date__lte=end)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid end_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        query = query.order_by('-date')
        
        # Return CSV format if requested
        if format_type.lower() == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="attendance_report.csv"'
            
            writer = csv.writer(response)
            writer.writerow(['Employee ID', 'Employee Name', 'Email', 'Department', 'Date', 'Status', 'Check-in', 'Check-out'])
            
            for record in query:
                full_name = f"{record.user.first_name} {record.user.last_name}".strip() or record.user.username
                writer.writerow([
                    record.user.id,
                    full_name,
                    record.user.email,
                    record.user.department or 'N/A',
                    record.date,
                    record.status,
                    record.check_in_time.strftime('%H:%M:%S') if record.check_in_time else 'N/A',
                    record.check_out_time.strftime('%H:%M:%S') if record.check_out_time else 'N/A'
                ])
            
            return response
        
        # Return JSON format (default)
        serializer = AttendanceReportSerializer(query, many=True)
        return Response({
            'status': 'success',
            'count': query.count(),
            'data': serializer.data
        }, status=status.HTTP_200_OK)


# ==================== LEAVE ====================
class LeaveApplyView(APIView):
    """
    7. Apply for leave (POST) - Employee only
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsEmployee]
    
    def post(self, request):
        """Apply for leave"""
        data = request.data.copy()
        data['user'] = request.user.id
        
        serializer = LeaveSerializer(data=data)
        if serializer.is_valid():
            leave = serializer.save()
            return Response({
                'status': 'success',
                'message': 'Leave request submitted successfully',
                'data': LeaveSerializer(leave).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LeaveStatusView(APIView):
    """
    View leave status and history
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get leave requests"""
        user_role = request.user.role.name.lower()
        if user_role == 'employee':
            # Employee can only see their own leaves
            leaves = Leave.objects.filter(user=request.user).order_by('-created_at')
        elif user_role in ['hr', 'admin']:
            # HR/Admin can see all leaves
            leaves = Leave.objects.select_related('user', 'approved_by').order_by('-created_at')
            
            # Filter by status if provided
            status_filter = request.query_params.get('status')
            if status_filter:
                leaves = leaves.filter(status=status_filter)
            
            # Filter by employee if provided
            employee_id = request.query_params.get('employee_id')
            if employee_id:
                leaves = leaves.filter(user_id=employee_id)
        else:
            return Response({
                'status': 'error',
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = LeaveSerializer(leaves, many=True)
        return Response({
            'status': 'success',
            'count': leaves.count(),
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class LeaveApprovalView(APIView):
    """
    Approve or reject leave requests (HR/Admin only)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminOrHR]
    
    def put(self, request, leave_id):
        """Approve or reject leave"""
        try:
            leave = Leave.objects.get(id=leave_id)
        except Leave.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Leave request not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if leave.status != 'pending':
            return Response({
                'status': 'error',
                'message': f'Leave is already {leave.status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        action = request.data.get('action')  # 'approve' or 'reject'
        if action not in ['approve', 'reject']:
            return Response({
                'status': 'error',
                'message': 'Invalid action. Use "approve" or "reject"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if action == 'approve':
            leave.status = 'approved'
        else:
            leave.status = 'rejected'
        
        leave.approved_by = request.user
        leave.approval_date = datetime.now()
        leave.save()
        
        serializer = LeaveSerializer(leave)
        return Response({
            'status': 'success',
            'message': f'Leave {action}ed successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)


# ==================== ADDITIONAL UTILITIES ====================
class UserProfileView(APIView):
    """
    Get current logged-in user profile
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user profile"""
        serializer = UserDetailSerializer(request.user)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

