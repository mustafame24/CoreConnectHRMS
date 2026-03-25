from rest_framework import serializers
from .models import (
    User, Role, Attendance, Leave, Payroll, SalaryComponent, Benefits,
    PerformanceReview, Announcement, AnnouncementRead, HelpdeskTicket, 
    HelpdeskComment, TaxRecord, JobPosting, Candidate
)
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


# ==================== PAYROLL SERIALIZERS ====================
class PayrollSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_department = serializers.CharField(source='user.department', read_only=True)
    
    class Meta:
        model = Payroll
        fields = ['id', 'user', 'user_name', 'user_email', 'user_department', 'month', 
                  'basic_salary', 'allowances', 'deductions', 'tax', 'net_salary', 
                  'payment_date', 'status', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SalaryComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryComponent
        fields = ['id', 'name', 'component_type', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class BenefitsSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Benefits
        fields = ['id', 'user', 'user_name', 'health_insurance', 'life_insurance', 
                  'provident_fund', 'gratuity', 'meal_allowance', 'transportation_allowance', 
                  'bonus', 'bonus_frequency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# ==================== PERFORMANCE REVIEW SERIALIZERS ====================
class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.username', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    
    class Meta:
        model = PerformanceReview
        fields = ['id', 'employee', 'employee_name', 'reviewer', 'reviewer_name', 
                  'review_period_start', 'review_period_end', 'overall_rating', 
                  'technical_skills', 'communication_skills', 'teamwork', 'punctuality', 
                  'reliability', 'strengths', 'areas_for_improvement', 'goals_for_next_period', 
                  'comments', 'status', 'reviewed_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'reviewed_date']


# ==================== ANNOUNCEMENT SERIALIZERS ====================
class AnnouncementReadSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AnnouncementRead
        fields = ['id', 'user', 'user_name', 'read_at']
        read_only_fields = ['id', 'read_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    read_by_count = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = ['id', 'created_by', 'created_by_name', 'title', 'description', 'content', 
                  'priority', 'published_date', 'expiry_date', 'is_active', 'read_by_count', 
                  'is_read', 'created_at', 'updated_at']
        read_only_fields = ['id', 'published_date', 'created_at', 'updated_at']
    
    def get_read_by_count(self, obj):
        return obj.read_by.count()
    
    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.read_by.filter(user=request.user).exists()
        return False


# ==================== HELPDESK SERIALIZERS ====================
class HelpdeskCommentSerializer(serializers.ModelSerializer):
    commented_by_name = serializers.CharField(source='commented_by.username', read_only=True)
    
    class Meta:
        model = HelpdeskComment
        fields = ['id', 'ticket', 'commented_by', 'commented_by_name', 'comment_text', 'created_at']
        read_only_fields = ['id', 'created_at', 'commented_by']


class HelpdeskTicketSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    comments = HelpdeskCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = HelpdeskTicket
        fields = ['id', 'ticket_id', 'employee', 'employee_name', 'assigned_to', 'assigned_to_name', 
                  'title', 'description', 'category', 'priority', 'status', 'resolution', 
                  'comments', 'created_at', 'updated_at', 'resolved_at']
        read_only_fields = ['id', 'ticket_id', 'created_at', 'updated_at', 'resolved_at']


# ==================== TAX RECORD SERIALIZERS ====================
class TaxRecordSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = TaxRecord
        fields = ['id', 'user', 'user_name', 'user_email', 'financial_year', 'gross_income', 
                  'tax_deducted', 'tax_rate', 'standard_deduction', 'taxable_income', 
                  'tax_status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# ==================== TALENT ACQUISITION SERIALIZERS ====================
class CandidateSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job_posting.title', read_only=True)
    
    class Meta:
        model = Candidate
        fields = ['id', 'job_posting', 'job_title', 'first_name', 'last_name', 'email', 'phone', 
                  'resume_url', 'cover_letter', 'experience_years', 'current_company', 
                  'current_designation', 'expected_salary', 'status', 'interview_date', 
                  'interview_feedback', 'rating', 'applied_date', 'updated_at']
        read_only_fields = ['id', 'applied_date', 'updated_at']


class JobPostingSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.CharField(source='posted_by.username', read_only=True)
    candidates_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobPosting
        fields = ['id', 'title', 'description', 'requirements', 'responsibilities', 'department', 
                  'designation', 'experience_required', 'salary_range_min', 'salary_range_max', 
                  'location', 'job_type', 'posted_by', 'posted_by_name', 'posted_date', 
                  'closing_date', 'status', 'is_active', 'candidates_count', 'updated_at']
        read_only_fields = ['id', 'posted_date', 'updated_at']
    
    def get_candidates_count(self, obj):
        return obj.candidates.count()
