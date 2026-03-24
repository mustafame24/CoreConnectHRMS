from django.urls import path
from .views import (
    LoginView, RegisterView, UserProfileView,
    EmployeeListCreateView, EmployeeDetailView,
    AttendanceMarkView, AttendanceSummaryView, AttendanceReportView,
    LeaveApplyView, LeaveStatusView, LeaveApprovalView
)

urlpatterns = [
    # ==================== AUTHENTICATION ====================
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # ==================== EMPLOYEE MANAGEMENT ====================
    # 1. Add new employee & Get all employees
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    
    # 5. Edit employee info & 6. View employee profile
    path('employees/<int:employee_id>/', EmployeeDetailView.as_view(), name='employee-detail'),
    
    # ==================== ATTENDANCE ====================
    # 3. Mark attendance
    path('attendance/mark/', AttendanceMarkView.as_view(), name='attendance-mark'),
    
    # 4. Attendance summary (daily)
    path('attendance/summary/', AttendanceSummaryView.as_view(), name='attendance-summary'),
    
    # 2. Export attendance reports
    path('attendance/report/', AttendanceReportView.as_view(), name='attendance-report'),
    
    # ==================== LEAVE ====================
    # 7. Apply for leave
    path('leave/apply/', LeaveApplyView.as_view(), name='leave-apply'),
    
    # View leave status
    path('leave/status/', LeaveStatusView.as_view(), name='leave-status'),
    
    # Approve/Reject leave
    path('leave/<int:leave_id>/approval/', LeaveApprovalView.as_view(), name='leave-approval'),
]
