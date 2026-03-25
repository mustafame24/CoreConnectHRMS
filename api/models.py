from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from datetime import date
from django.utils import timezone

class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    
    # Employee Information
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=50, blank=True, null=True)
    hire_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
    
    def set_password(self, raw_password):
        """Hash and set password"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Check if raw password matches hashed password"""
        return check_password(raw_password, self.password)
    
    @property
    def is_authenticated(self):
        """Return True as custom user is always authenticated when instantiated"""
        return True


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'On Leave'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    check_in_time = models.TimeField(blank=True, null=True)
    check_out_time = models.TimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"


class Leave(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    LEAVE_TYPE_CHOICES = [
        ('sick', 'Sick Leave'),
        ('casual', 'Casual Leave'),
        ('annual', 'Annual Leave'),
        ('unpaid', 'Unpaid Leave'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    approval_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.leave_type} - {self.start_date} to {self.end_date}"


# ==================== PAYROLL & BENEFITS ====================
class Payroll(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payroll_records')
    month = models.DateField(help_text="Month and year of payroll")
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'month')
        ordering = ['-month']
    
    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')}"


class SalaryComponent(models.Model):
    COMPONENT_TYPE = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]
    
    name = models.CharField(max_length=100)
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPE)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.component_type})"


class Benefits(models.Model):
    FREQUENCY = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='benefits')
    health_insurance = models.BooleanField(default=False)
    life_insurance = models.BooleanField(default=False)
    provident_fund = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gratuity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    meal_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transportation_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus_frequency = models.CharField(max_length=20, choices=FREQUENCY, default='yearly')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Benefits - {self.user.username}"


# ==================== PERFORMANCE REVIEWS ====================
class PerformanceReview(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performance_reviews')
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews_given')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    overall_rating = models.IntegerField(choices=[(i, f"{i} Star") for i in range(1, 6)], blank=True, null=True)
    
    # Performance Ratings
    technical_skills = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], default=3)
    communication_skills = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], default=3)
    teamwork = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], default=3)
    punctuality = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], default=3)
    reliability = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], default=3)
    
    strengths = models.TextField()
    areas_for_improvement = models.TextField()
    goals_for_next_period = models.TextField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    reviewed_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-review_period_end']
    
    def __str__(self):
        return f"Review - {self.employee.username} ({self.review_period_start} to {self.review_period_end})"


# ==================== ANNOUNCEMENTS ====================
class Announcement(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements_created')
    title = models.CharField(max_length=200)
    description = models.TextField()
    content = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    published_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-published_date']


class AnnouncementRead(models.Model):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name='read_by')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements_read')
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('announcement', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.announcement.title}"


# ==================== HR HELPDESK ====================
class HelpdeskTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting', 'Waiting for Response'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('leave', 'Leave Related'),
        ('payroll', 'Payroll Related'),
        ('attendance', 'Attendance Related'),
        ('benefits', 'Benefits Related'),
        ('general', 'General Query'),
        ('technical', 'Technical Issue'),
        ('other', 'Other'),
    ]
    
    ticket_id = models.CharField(max_length=20, unique=True)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='helpdesk_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_assigned')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.ticket_id} - {self.title}"
    
    class Meta:
        ordering = ['-created_at']


class HelpdeskComment(models.Model):
    ticket = models.ForeignKey(HelpdeskTicket, on_delete=models.CASCADE, related_name='comments')
    commented_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment on {self.ticket.ticket_id}"
    
    class Meta:
        ordering = ['-created_at']


# ==================== TAX MANAGEMENT ====================
class TaxRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tax_records')
    financial_year = models.CharField(max_length=20, help_text="e.g., 2024-2025")
    gross_income = models.DecimalField(max_digits=12, decimal_places=2)
    tax_deducted = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Tax rate in percentage")
    standard_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=50000)
    taxable_income = models.DecimalField(max_digits=12, decimal_places=2)
    tax_status = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'financial_year')
        ordering = ['-financial_year']
    
    def __str__(self):
        return f"Tax - {self.user.username} ({self.financial_year})"


# ==================== TALENT ACQUISITION ====================
class JobPosting(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('on_hold', 'On Hold'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    experience_required = models.IntegerField(help_text="Years of experience")
    salary_range_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salary_range_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=200)
    job_type = models.CharField(max_length=50, choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('contract', 'Contract')])
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_postings')
    posted_date = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-posted_date']


class Candidate(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interviewed', 'Interviewed'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
        ('offer_sent', 'Offer Sent'),
        ('offer_accepted', 'Offer Accepted'),
    ]
    
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='candidates')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    resume_url = models.URLField(blank=True, null=True)
    cover_letter = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    current_company = models.CharField(max_length=200, blank=True, null=True)
    current_designation = models.CharField(max_length=100, blank=True, null=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    interview_date = models.DateTimeField(blank=True, null=True)
    interview_feedback = models.TextField(blank=True, null=True)
    rating = models.IntegerField(choices=[(i, f"{i}") for i in range(1, 6)], blank=True, null=True)
    applied_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.job_posting.title}"
    
    class Meta:
        ordering = ['-applied_date']
