import { useState } from 'react';

const Announcements = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const itemsPerPage = 5;
    const today = new Date().toISOString().split('T')[0];

    const [announcements, setAnnouncements] = useState([
        { title: 'Company Holiday Schedule 2024', author: 'HR Department', category: 'General', date: '2024-07-25', status: 'Published' },
        { title: 'New Employee Onboarding Process Updates', author: 'HR Department', category: 'HR', date: '2024-08-01', status: 'Published' },
        { title: 'Annual Company Picnic on August 20th', author: 'Events Committee', category: 'Events', date: '2024-08-10', status: 'Scheduled' },
        { title: 'Q3 Performance Review Period Opens', author: 'Management', category: 'Performance', date: '2024-08-15', status: 'Published' },
        { title: 'System Maintenance Window - August 28th', author: 'IT Department', category: 'IT', date: '2024-08-20', status: 'Scheduled' },
        { title: 'Office Renovation Project Begins', author: 'Facilities', category: 'General', date: '2024-08-22', status: 'Scheduled' },
        { title: 'Q3 Salary Review Completed', author: 'HR Department', category: 'HR', date: '2024-08-25', status: 'Published' },
        { title: 'Employee Recognition Program Launch', author: 'Management', category: 'General', date: '2024-09-01', status: 'Published' },
        { title: 'New Coffee Machine in Break Room', author: 'Admin', category: 'General', date: '2024-09-05', status: 'Published' },
        { title: 'September Team Building Event', author: 'HR Department', category: 'Events', date: '2024-09-10', status: 'Scheduled' },
        { title: 'Updated Remote Work Policy', author: 'Management', category: 'HR', date: '2024-09-15', status: 'Published' },
        { title: 'IT Security Training Mandatory', author: 'IT Department', category: 'IT', date: '2024-09-20', status: 'Scheduled' },
        { title: 'Annual Performance Appraisal Forms Available', author: 'HR Department', category: 'Performance', date: '2024-09-25', status: 'Published' },
    ]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePublish = () => {
        if (!formData.title || !formData.content || !formData.category) {
            alert('Please fill in all required fields');
            return;
        }

        const newAnnouncement = {
            title: formData.title,
            author: 'Current User',
            category: formData.category,
            date: formData.date,
            status: 'Published'
        };

        setAnnouncements([newAnnouncement, ...announcements]);
        setFormData({
            title: '',
            content: '',
            category: '',
            date: new Date().toISOString().split('T')[0]
        });
        alert('Announcement published successfully!');
    };

    const handleClear = () => {
        setFormData({
            title: '',
            content: '',
            category: '',
            date: today
        });
    };

    const handleDeleteAnnouncement = (index) => {
        const announcementToDelete = paginatedAnnouncements[index];
        if (confirm(`Delete "${announcementToDelete.title}"?`)) {
            setAnnouncements(announcements.filter((_, i) => i !== announcements.indexOf(announcementToDelete)));
            setActiveActionMenu(null);
        }
    };

    // Filter announcements
    const filteredAnnouncements = announcements.filter(ann => {
        const matchSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ann.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !filterStatus || ann.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

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
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter announcement title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Content</label>
                    <textarea 
                        className="form-control" 
                        rows="6" 
                        placeholder="Write your announcement here..."
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                    ></textarea>
                </div>

                <div className="input-group">
                    <label className="input-label">Category</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Select category (e.g., General, HR, Events)"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Publish Date</label>
                    <input 
                        type="date" 
                        className="form-control"
                        value={formData.date}
                        min={today}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                        className="btn" 
                        style={{ border: '1px solid #dee2e6' }}
                        onClick={handleClear}
                    >
                        Clear Form
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={handlePublish}
                    >
                        Publish Announcement
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>All Announcements</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Overview of all published and scheduled announcements.</p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search announcements..." 
                        style={{ flex: 2 }}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <select 
                        className="form-control" 
                        placeholder="Filter by status" 
                        style={{ flex: 1 }}
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
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
                        {paginatedAnnouncements.map((row, i) => (
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
                                <td style={{ padding: '1rem 0', position: 'relative' }}>
                                    <button
                                        onClick={() => setActiveActionMenu(activeActionMenu === i ? null : i)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.25rem',
                                            cursor: 'pointer',
                                            color: '#6c757d',
                                            padding: 0
                                        }}
                                    >
                                        ⋯
                                    </button>
                                    {activeActionMenu === i && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            backgroundColor: '#fff',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            zIndex: 10,
                                            minWidth: '120px'
                                        }}>
                                            <button
                                                onClick={() => alert(`View: ${row.title}\n\n${row.category} - ${row.date}`)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.9rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    color: '#0d6efd',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }}
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFormData({ title: row.title, content: row.title, category: row.category, date: row.date });
                                                    setActiveActionMenu(null);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.9rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    color: '#0056b3',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(i)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.9rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    color: '#dc3545'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Page {currentPage} of {totalPages} ({filteredAnnouncements.length} total)
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn"
                            style={{ 
                                border: '1px solid #dee2e6',
                                padding: '0.5rem 0.75rem',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                opacity: currentPage === 1 ? 0.5 : 1
                            }}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: currentPage === page ? '1px solid #0d6efd' : '1px solid #dee2e6',
                                    backgroundColor: currentPage === page ? '#0d6efd' : '#fff',
                                    color: currentPage === page ? '#fff' : '#000',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: currentPage === page ? '600' : '400'
                                }}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="btn"
                            style={{ 
                                border: '1px solid #dee2e6',
                                padding: '0.5rem 0.75rem',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                opacity: currentPage === totalPages ? 0.5 : 1
                            }}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
