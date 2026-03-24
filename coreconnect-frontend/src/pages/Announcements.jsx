import { useState } from 'react';

const Announcements = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Announcements Management</h1>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Create New Announcement</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in the details to publish a new company announcement.</p>

                <div className="input-group">
                    <label className="input-label">Announcement Title</label>
                    <input type="text" className="form-control" placeholder="Enter announcement title" />
                </div>

                <div className="input-group">
                    <label className="input-label">Content</label>
                    <textarea className="form-control" rows="6" placeholder="Write your announcement here..."></textarea>
                </div>

                <div className="input-group">
                    <label className="input-label">Category</label>
                    <input type="text" className="form-control" placeholder="Select category (e.g., General, HR, Events)" />
                </div>

                <div className="input-group">
                    <label className="input-label">Publish Date</label>
                    <input type="date" className="form-control" defaultValue="2025-11-08" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn" style={{ border: '1px solid #dee2e6' }}>Clear Form</button>
                    <button className="btn btn-primary">Publish Announcement</button>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>All Announcements</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Overview of all published and scheduled announcements.</p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input type="text" className="form-control" placeholder="Search announcements..." style={{ flex: 2 }} />
                    <input type="text" className="form-control" placeholder="Filter by status" style={{ flex: 1 }} />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Title</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Author</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Category</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Publication Date</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Status</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { title: 'Company Holiday Schedule 2024', author: 'HR Department', category: 'General', date: '2024-07-25', status: 'Published' },
                            { title: 'New Employee Onboarding Process Updates', author: 'HR Department', category: 'HR', date: '2024-08-01', status: 'Published' },
                            { title: 'Annual Company Picnic on August 20th', author: 'Events Committee', category: 'Events', date: '2024-08-10', status: 'Scheduled' },
                            { title: 'Q3 Performance Review Period Opens', author: 'Management', category: 'Performance', date: '2024-08-15', status: 'Published' },
                            { title: 'System Maintenance Window - August 28th', author: 'IT Department', category: 'IT', date: '2024-08-20', status: 'Scheduled' },
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                <td style={{ padding: '1rem 0', fontWeight: '500', maxWidth: '300px' }}>{row.title}</td>
                                <td style={{ padding: '1rem 0' }}>{row.author}</td>
                                <td style={{ padding: '1rem 0' }}>
                                    <span style={{ backgroundColor: '#f8f9fa', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{row.category}</span>
                                </td>
                                <td style={{ padding: '1rem 0' }}>{row.date}</td>
                                <td style={{ padding: '1rem 0' }}>
                                    <span style={{
                                        border: '1px solid #0d6efd',
                                        color: '#0d6efd',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 0' }}>...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>Page 1 of 3</div>
            </div>
        </div>
    );
};

export default Announcements;
