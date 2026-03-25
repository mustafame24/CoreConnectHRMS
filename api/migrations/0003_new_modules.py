# Generated migration for new models

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_address_user_created_at_user_phone_number_and_more'),
    ]

    operations = [
        # Payroll Model
        migrations.CreateModel(
            name='Payroll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.DateField(help_text='Month and year of payroll')),
                ('basic_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('allowances', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('deductions', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('tax', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('net_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('processed', 'Processed'), ('paid', 'Paid'), ('cancelled', 'Cancelled')], default='draft', max_length=20)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payroll_records', to='api.user')),
            ],
            options={'unique_together': {('user', 'month')}, 'ordering': ['-month']},
        ),
        
        # SalaryComponent Model
        migrations.CreateModel(
            name='SalaryComponent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('component_type', models.CharField(choices=[('earning', 'Earning'), ('deduction', 'Deduction')], max_length=20)),
                ('description', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        
        # Benefits Model
        migrations.CreateModel(
            name='Benefits',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('health_insurance', models.BooleanField(default=False)),
                ('life_insurance', models.BooleanField(default=False)),
                ('provident_fund', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('gratuity', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('meal_allowance', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('transportation_allowance', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('bonus', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('bonus_frequency', models.CharField(choices=[('monthly', 'Monthly'), ('yearly', 'Yearly'), ('one_time', 'One Time')], default='yearly', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='benefits', to='api.user')),
            ],
        ),
        
        # PerformanceReview Model
        migrations.CreateModel(
            name='PerformanceReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_period_start', models.DateField()),
                ('review_period_end', models.DateField()),
                ('overall_rating', models.IntegerField(blank=True, choices=[(1, '1 Star'), (2, '2 Star'), (3, '3 Star'), (4, '4 Star'), (5, '5 Star')], null=True)),
                ('technical_skills', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=3)),
                ('communication_skills', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=3)),
                ('teamwork', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=3)),
                ('punctuality', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=3)),
                ('reliability', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=3)),
                ('strengths', models.TextField()),
                ('areas_for_improvement', models.TextField()),
                ('goals_for_next_period', models.TextField(blank=True, null=True)),
                ('comments', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('submitted', 'Submitted'), ('reviewed', 'Under Review'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='draft', max_length=20)),
                ('reviewed_date', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='performance_reviews', to='api.user')),
                ('reviewer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviews_given', to='api.user')),
            ],
            options={'ordering': ['-review_period_end']},
        ),
        
        # Announcement Model
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('content', models.TextField()),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')], default='medium', max_length=20)),
                ('published_date', models.DateTimeField(auto_now_add=True)),
                ('expiry_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='announcements_created', to='api.user')),
            ],
            options={'ordering': ['-published_date']},
        ),
        
        # AnnouncementRead Model
        migrations.CreateModel(
            name='AnnouncementRead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_at', models.DateTimeField(auto_now_add=True)),
                ('announcement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='read_by', to='api.announcement')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='announcements_read', to='api.user')),
            ],
            options={'unique_together': {('announcement', 'user')}},
        ),
        
        # HelpdeskTicket Model
        migrations.CreateModel(
            name='HelpdeskTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticket_id', models.CharField(max_length=20, unique=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('category', models.CharField(choices=[('leave', 'Leave Related'), ('payroll', 'Payroll Related'), ('attendance', 'Attendance Related'), ('benefits', 'Benefits Related'), ('general', 'General Query'), ('technical', 'Technical Issue'), ('other', 'Other')], default='general', max_length=20)),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')], default='medium', max_length=20)),
                ('status', models.CharField(choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('waiting', 'Waiting for Response'), ('resolved', 'Resolved'), ('closed', 'Closed')], default='open', max_length=20)),
                ('resolution', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tickets_assigned', to='api.user')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='helpdesk_tickets', to='api.user')),
            ],
            options={'ordering': ['-created_at']},
        ),
        
        # HelpdeskComment Model
        migrations.CreateModel(
            name='HelpdeskComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('commented_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
                ('ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.helpdeskticket')),
            ],
            options={'ordering': ['-created_at']},
        ),
        
        # TaxRecord Model
        migrations.CreateModel(
            name='TaxRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('financial_year', models.CharField(help_text='e.g., 2024-2025', max_length=20)),
                ('gross_income', models.DecimalField(decimal_places=2, max_digits=12)),
                ('tax_deducted', models.DecimalField(decimal_places=2, max_digits=12)),
                ('tax_rate', models.DecimalField(decimal_places=2, help_text='Tax rate in percentage', max_digits=5)),
                ('standard_deduction', models.DecimalField(decimal_places=2, default=50000, max_digits=12)),
                ('taxable_income', models.DecimalField(decimal_places=2, max_digits=12)),
                ('tax_status', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tax_records', to='api.user')),
            ],
            options={'unique_together': {('user', 'financial_year')}, 'ordering': ['-financial_year']},
        ),
        
        # JobPosting Model
        migrations.CreateModel(
            name='JobPosting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('requirements', models.TextField()),
                ('responsibilities', models.TextField()),
                ('department', models.CharField(max_length=100)),
                ('designation', models.CharField(max_length=100)),
                ('experience_required', models.IntegerField(help_text='Years of experience')),
                ('salary_range_min', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('salary_range_max', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('location', models.CharField(max_length=200)),
                ('job_type', models.CharField(choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('contract', 'Contract')], max_length=50)),
                ('posted_date', models.DateTimeField(auto_now_add=True)),
                ('closing_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('open', 'Open'), ('closed', 'Closed'), ('on_hold', 'On Hold')], default='draft', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('posted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='job_postings', to='api.user')),
            ],
            options={'ordering': ['-posted_date']},
        ),
        
        # Candidate Model
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('resume_url', models.URLField(blank=True, null=True)),
                ('cover_letter', models.TextField(blank=True, null=True)),
                ('experience_years', models.IntegerField(blank=True, null=True)),
                ('current_company', models.CharField(blank=True, max_length=200, null=True)),
                ('current_designation', models.CharField(blank=True, max_length=100, null=True)),
                ('expected_salary', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('status', models.CharField(choices=[('applied', 'Applied'), ('shortlisted', 'Shortlisted'), ('interview_scheduled', 'Interview Scheduled'), ('interviewed', 'Interviewed'), ('selected', 'Selected'), ('rejected', 'Rejected'), ('offer_sent', 'Offer Sent'), ('offer_accepted', 'Offer Accepted')], default='applied', max_length=30)),
                ('interview_date', models.DateTimeField(blank=True, null=True)),
                ('interview_feedback', models.TextField(blank=True, null=True)),
                ('rating', models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True)),
                ('applied_date', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('job_posting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidates', to='api.jobposting')),
            ],
            options={'ordering': ['-applied_date']},
        ),
    ]
