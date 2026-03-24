import { useState } from 'react';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');

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
                            style={{ padding: '0.75rem 1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontWeight: '500', marginBottom: '0.5rem', cursor: 'pointer' }}
                        >
                            User Profile
                        </div>
                        <div style={{ padding: '0.75rem 1rem', color: '#6c757d', cursor: 'pointer' }}>
                            Department Management
                        </div>
                        <div style={{ padding: '0.75rem 1rem', color: '#6c757d', cursor: 'pointer' }}>
                            Roles & Permissions
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
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
            </div>
        </div>
    );
};

export default UserProfile;
