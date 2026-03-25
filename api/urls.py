from django.urls import path
from .views import (
    LoginView, RegisterView, UserProfileView,
    EmployeeListCreateView, EmployeeDetailView,
    AttendanceMarkView, AttendanceSummaryView, AttendanceReportView,
    LeaveApplyView, LeaveStatusView, LeaveApprovalView,
    PayrollListView, PayrollDetailView, BenefitsListView,
    PerformanceReviewListView, PerformanceReviewDetailView,
    AnnouncementListView, AnnouncementDetailView,
    HelpdeskTicketListView, HelpdeskTicketDetailView, HelpdeskCommentView,
    TaxRecordListView, TaxRecordDetailView,
    JobPostingListView, JobPostingDetailView,
    CandidateListView, CandidateDetailView
)

urlpatterns = [
    # ==================== AUTHENTICATION ====================
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # ==================== EMPLOYEE MANAGEMENT ====================
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:employee_id>/', EmployeeDetailView.as_view(), name='employee-detail'),
    
    # ==================== ATTENDANCE ====================
    path('attendance/mark/', AttendanceMarkView.as_view(), name='attendance-mark'),
    path('attendance/summary/', AttendanceSummaryView.as_view(), name='attendance-summary'),
    path('attendance/report/', AttendanceReportView.as_view(), name='attendance-report'),
    
    # ==================== LEAVE ====================
    path('leave/apply/', LeaveApplyView.as_view(), name='leave-apply'),
    path('leave/status/', LeaveStatusView.as_view(), name='leave-status'),
    path('leave/<int:leave_id>/approval/', LeaveApprovalView.as_view(), name='leave-approval'),
    
    # ==================== PAYROLL ====================
    path('payroll/', PayrollListView.as_view(), name='payroll-list'),
    path('payroll/<int:payroll_id>/', PayrollDetailView.as_view(), name='payroll-detail'),
    path('benefits/', BenefitsListView.as_view(), name='benefits-list'),
    
    # ==================== PERFORMANCE REVIEWS ====================
    path('performance-reviews/', PerformanceReviewListView.as_view(), name='performance-review-list'),
    path('performance-reviews/<int:review_id>/', PerformanceReviewDetailView.as_view(), name='performance-review-detail'),
    
    # ==================== ANNOUNCEMENTS ====================
    path('announcements/', AnnouncementListView.as_view(), name='announcement-list'),
    path('announcements/<int:announcement_id>/', AnnouncementDetailView.as_view(), name='announcement-detail'),
    
    # ==================== HR HELPDESK ====================
    path('helpdesk/tickets/', HelpdeskTicketListView.as_view(), name='helpdesk-ticket-list'),
    path('helpdesk/tickets/<int:ticket_id>/', HelpdeskTicketDetailView.as_view(), name='helpdesk-ticket-detail'),
    path('helpdesk/tickets/<int:ticket_id>/comments/', HelpdeskCommentView.as_view(), name='helpdesk-comment'),
    
    # ==================== TAX MANAGEMENT ====================
    path('tax-records/', TaxRecordListView.as_view(), name='tax-record-list'),
    path('tax-records/<int:tax_id>/', TaxRecordDetailView.as_view(), name='tax-record-detail'),
    
    # ==================== TALENT ACQUISITION ====================
    path('job-postings/', JobPostingListView.as_view(), name='job-posting-list'),
    path('job-postings/<int:job_id>/', JobPostingDetailView.as_view(), name='job-posting-detail'),
    path('candidates/', CandidateListView.as_view(), name='candidate-list'),
    path('candidates/<int:candidate_id>/', CandidateDetailView.as_view(), name='candidate-detail'),
]
