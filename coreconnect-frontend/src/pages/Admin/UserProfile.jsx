import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Admin Settings</h1>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Settings Sidebar */}
                <div style={{ width: '250px' }}>
                    <div className="card" style={{ padding: '0.5rem' }}>
                        <div
                            onClick={() => setActiveTab('profile')}
                            style={{ 
                                padding: '0.75rem 1rem', 
                                backgroundColor: activeTab === 'profile' ? '#f8f9fa' : 'transparent',
                                borderRadius: '4px', 
                                fontWeight: '500', 
                                marginBottom: '0.5rem', 
                                cursor: 'pointer',
                                color: activeTab === 'profile' ? '#000' : '#6c757d',
                                transition: 'all 0.2s'
                            }}
                        >
                            User Profile
                        </div>
                        <div 
                            onClick={() => setActiveTab('departments')}
                            style={{ 
                                padding: '0.75rem 1rem', 
                                color: activeTab === 'departments' ? '#000' : '#6c757d', 
                                backgroundColor: activeTab === 'departments' ? '#f8f9fa' : 'transparent',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Department Management
                        </div>
                        <div 
                            onClick={() => setActiveTab('roles')}
                            style={{ 
                                padding: '0.75rem 1rem', 
                                color: activeTab === 'roles' ? '#000' : '#6c757d', 
                                backgroundColor: activeTab === 'roles' ? '#f8f9fa' : 'transparent',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                transition: 'all 0.2s'
                            }}
                        >
                            Roles & Permissions
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'profile' && (
                    <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>User Profile Settings</h2>

                    {/* Basic Information */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Basic Information</h3>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e9ecef', marginRight: '1rem' }}></div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Admin User</div>
                                <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>admin.user@coreconnect.com</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input type="text" className="form-control" defaultValue="Admin User" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input type="email" className="form-control" defaultValue="admin.user@coreconnect.com" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn" style={{ border: '1px solid #dee2e6' }}>Cancel</button>
                            <button className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>

                    {/* Update Password */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Update Password</h3>

                        <div className="input-group">
                            <label className="input-label">Current Password</label>
                            <input type="password" className="form-control" placeholder="Enter current password" />
                        </div>

                        <div className="input-group">
                            <label className="input-label">New Password</label>
                            <input type="password" className="form-control" placeholder="Enter new password" />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm New Password</label>
                            <input type="password" className="form-control" placeholder="Confirm new password" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button className="btn btn-primary">Update Password</button>
                        </div>
                    </div>
                    </div>
                    )}

                    {activeTab === 'departments' && (
                    <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Department Management</h2>
                    <div className="card">
                        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>Manage company departments, assign managers, and track employee distribution.</p>
                        <button
                            onClick={() => navigate('/departments')}
                            className="btn btn-primary"
                        >
                            Go to Departments Page
                        </button>
                    </div>
                    </div>
                    )}

                    {activeTab === 'roles' && (
                    <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Roles & Permissions</h2>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>System Roles</h3>
                        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>Configure user roles and their associated permissions.</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Role Name</th>
                                    <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Description</th>
                                    <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { role: 'Admin', desc: 'Full system access', perms: 'All' },
                                    { role: 'HR', desc: 'HR operations', perms: 'Payroll, Recruitment, Reviews' },
                                    { role: 'Employee', desc: 'Basic access', perms: 'Own records, Leave' },
                                ].map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: '500' }}>{item.role}</td>
                                        <td style={{ padding: '1rem 0' }}>{item.desc}</td>
                                        <td style={{ padding: '1rem 0' }}>{item.perms}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
