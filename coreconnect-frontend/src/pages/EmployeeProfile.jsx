import { useState } from 'react';

const EmployeeProfile = () => {
    const [activeTab, setActiveTab] = useState('Personal Info');

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Employee Profile</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e9ecef' }}>
                {['Personal Info', 'Attendance', 'Leaves', 'Payroll', 'Performance'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid #000' : 'none',
                            fontWeight: activeTab === tab ? '600' : '400',
                            color: activeTab === tab ? '#000' : '#6c757d',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Personal Information */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Personal Information</h3>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#d1e7dd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e9ecef', overflow: 'hidden' }}>
                            {/* Placeholder for avatar image */}
                            <img src="https://via.placeholder.com/150" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Full Name</div>
                                <div>John David Doe</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email</div>
                                <div>john.doe@coreconnect.com</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Department</div>
                                <div>Product Development</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Hire Date</div>
                                <div>2022-08-01</div>
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Employee ID</div>
                                <div>CC00123</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Phone Number</div>
                                <div>+1 (555) 123-4567</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Job Title</div>
                                <div>Software Engineer</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Date of Birth</div>
                                <div>1990-07-15</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact & Emergency Information */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact & Emergency Information</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Home Address</div>
                            <div>123 Main St, Anytown, CA 90210</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Emergency Contact Phone</div>
                            <div>+1 (555) 987-6543</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Emergency Contact Name</div>
                            <div>Jane Doe</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Relationship</div>
                            <div>Spouse</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
