import { Users, Calendar, ClipboardCheck, UserPlus, Megaphone, DollarSign, Clock, FileText } from 'lucide-react';

const HRDashboard = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">HR Manager Dashboard</h1>
                <p style={{ color: '#6c757d' }}>Overview of key HR operations and pending actions.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Team Summary</h3>
                        <Users size={20} color="#6c757d" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0056b3', marginBottom: '0.5rem' }}>55</div>
                    <div style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Across all departments</div>
                    <button className="btn" style={{ width: '100%', border: '1px solid #dee2e6' }}>View Directory</button>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Pending Leaves</h3>
                        <Calendar size={20} color="#6c757d" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0056b3', marginBottom: '0.5rem' }}>8</div>
                    <div style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Requests awaiting approval</div>
                    <button className="btn" style={{ width: '100%', border: '1px solid #dee2e6' }}>Review Requests</button>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Performance Reviews</h3>
                        <ClipboardCheck size={20} color="#6c757d" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0056b3', marginBottom: '0.5rem' }}>12</div>
                    <div style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Outstanding review tasks</div>
                    <button className="btn" style={{ width: '100%', border: '1px solid #dee2e6' }}>Manage Reviews</button>
                </div>

                <div className="card" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#fff', border: '1px solid #dee2e6' }}>
                            <UserPlus size={18} style={{ marginRight: '0.75rem' }} /> Add New Employee
                        </button>
                        <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#fff', border: '1px solid #dee2e6' }}>
                            <Megaphone size={18} style={{ marginRight: '0.75rem' }} /> Create Announcement
                        </button>
                        <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#fff', border: '1px solid #dee2e6' }}>
                            <DollarSign size={18} style={{ marginRight: '0.75rem' }} /> Process Payroll
                        </button>
                    </div>
                </div>
            </div>

            {/* Latest Activity */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Latest Activity</h3>

                {[
                    { icon: Calendar, text: 'John Doe submitted a leave request for annual leave (3 days).', time: '2 hours ago' },
                    { icon: Megaphone, text: 'New company-wide policy on remote work published.', time: 'Yesterday' },
                    { icon: ClipboardCheck, text: 'Performance review cycle initiated for Q3. Deadline: Sep 30.', time: '3 days ago' },
                    { icon: UserPlus, text: 'New employee Sarah Lee onboarded as Marketing Specialist.', time: '5 days ago' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: i < 3 ? '1px solid #f8f9fa' : 'none' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <item.icon size={20} color="#6c757d" />
                        </div>
                        <div>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{item.text}</div>
                            <div style={{ color: '#6c757d', fontSize: '0.85rem' }}>{item.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HRDashboard;
