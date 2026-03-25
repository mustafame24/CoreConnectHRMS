import { FileText, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Welcome, Alice Johnson!</h1>
                <p style={{ color: '#6c757d' }}>Here's a summary of your CoreConnect HRMS activity today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Leave Balance */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Leave Balance</h3>

                    {[
                        { label: 'Annual Leave', value: '15 days' },
                        { label: 'Sick Leave', value: '7 days' },
                        { label: 'Casual Leave', value: '3 days' },
                    ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span>{item.label}</span>
                            <span style={{ backgroundColor: '#0056b3', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                {item.value}
                            </span>
                        </div>
                    ))}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate('/leave')}>Apply for Leave</button>
                </div>

                {/* Attendance Summary */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Attendance Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: '#6c757d' }}>Last Check-In</span>
                        <span style={{ fontWeight: '600' }}>08:30 AM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f8f9fa', paddingBottom: '1rem' }}>
                        <span style={{ color: '#6c757d' }}>Last Check-Out</span>
                        <span style={{ fontWeight: '600' }}>05:00 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: '#6c757d' }}>Total Hours (Week)</span>
                        <span style={{ fontWeight: '600' }}>40.0h</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ color: '#6c757d' }}>Total Hours (Month)</span>
                        <span style={{ fontWeight: '600' }}>160.0h</span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <a onClick={() => navigate('/attendance-summary')} style={{ color: '#0056b3', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>View Detailed Attendance</a>
                    </div>
                </div>

                {/* Latest Announcements */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Latest Announcements</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Company Holiday Announcement</div>
                        <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.5rem' }}>2023-12-01</div>
                        <p style={{ fontSize: '0.9rem', color: '#495057' }}>Our offices will be closed on December 25th for the Christmas holiday...</p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>New Employee Onboarding Session</div>
                        <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.5rem' }}>2023-11-28</div>
                        <p style={{ fontSize: '0.9rem', color: '#495057' }}>A new onboarding session for recently hired employees is scheduled for next week...</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <a onClick={() => navigate('/announcements')} style={{ color: '#0056b3', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>View All Announcements</a>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ backgroundColor: '#fff', border: '1px solid #dee2e6' }} onClick={() => navigate('/payroll')}>
                        <FileText size={18} style={{ marginRight: '0.75rem' }} /> View Payslip
                    </button>
                    <button className="btn" style={{ backgroundColor: '#fff', border: '1px solid #dee2e6' }} onClick={() => navigate('/performance')}>
                        <MessageSquare size={18} style={{ marginRight: '0.75rem' }} /> Submit Performance Feedback
                    </button>
                    <button className="btn" style={{ backgroundColor: '#fff', border: '1px solid #dee2e6' }} onClick={() => navigate('/employee-profile')}>
                        <User size={18} style={{ marginRight: '0.75rem' }} /> Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
