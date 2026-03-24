from rest_framework import serializers
from .models import User, Role, Attendance, Leave
from datetime import datetime, date

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.IntegerField(write_only=True, required=False)
    name = serializers.CharField(write_only=True, required=False)  # Frontend sends 'name'
    phone = serializers.CharField(write_only=True, required=False)  # Frontend sends 'phone' instead of 'phone_number'
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 
                  'designation', 'hire_date', 'phone_number', 'address', 'role', 'role_id', 'name', 'phone']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        """Handle name and phone field mapping"""
        name = validated_data.pop('name', '')
        phone = validated_data.pop('phone', None)
        role_id = validated_data.pop('role_id', None)
        
        # Map phone to phone_number
        if phone:
            validated_data['phone_number'] = phone
        
        # Split name into first and last name
        if name:
            parts = name.split(' ', 1)
            validated_data['first_name'] = parts[0]
            validated_data['last_name'] = parts[1] if len(parts) > 1 else ''
        
        # Set role_id if provided
        if role_id:
            validated_data['role_id'] = role_id
        
        # Generate username from email if not provided
        if 'username' not in validated_data or not validated_data['username']:
            email = validated_data.get('email', '')
            validated_data['username'] = email.split('@')[0]
        
        return super().create(validated_data)


class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 
                  'designation', 'hire_date', 'phone_number', 'address', 'role', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'user', 'user_name', 'user_email', 'date', 'status', 
                  'check_in_time', 'check_out_time', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class AttendanceReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_department = serializers.CharField(source='user.department', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['user', 'user_name', 'user_email', 'user_department', 'date', 'status', 
                  'check_in_time', 'check_out_time']


class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    days_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Leave
        fields = ['id', 'user', 'user_name', 'leave_type', 'start_date', 'end_date', 
                  'reason', 'status', 'approved_by', 'approved_by_name', 'approval_date', 
                  'days_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'approved_by', 'approval_date']
    
    def get_days_count(self, obj):
        """Calculate number of days for the leave"""
        delta = obj.end_date - obj.start_date
        return delta.days + 1
    
    def to_internal_value(self, data):
        """Map frontend leave types to model choices"""
        if 'leave_type' in data:
            leave_type_map = {
                'Annual Leave': 'annual',
                'Sick Leave': 'sick',
                'Casual Leave': 'casual',
                'Unpaid Leave': 'unpaid',
            }
            data = data.copy()
            data['leave_type'] = leave_type_map.get(data['leave_type'], data['leave_type'].lower())
        return super().to_internal_value(data)


class LeaveApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ['id', 'status', 'approved_by', 'approval_date']
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    class Meta:
        fields = ['email', 'password']
