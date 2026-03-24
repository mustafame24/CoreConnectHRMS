import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Leave = () => {
    const { token, user } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        leave_type: 'Annual Leave',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isHR = user?.role?.toLowerCase() === 'hr';
    const isEmployee = user?.role?.toLowerCase() === 'employee';
    const canApprove = isAdmin || isHR;

    useEffect(() => {
        fetchLeaveRequests();
    }, [token]);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/leave/status/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both old format (array) and new format (object with data property)
            const leaveData = response.data?.data || response.data || [];
            setLeaveRequests(Array.isArray(leaveData) ? leaveData : []);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to load leave requests');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitLeave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/leave/apply/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ leave_type: 'Annual Leave', start_date: '', end_date: '', reason: '' });
            fetchLeaveRequests();
            alert('Leave request submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit leave request');
            console.error('Error:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApproveReject = async (leaveId, action) => {
        try {
            await axios.put(`http://localhost:8000/api/leave/${leaveId}/approval/`, 
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLeaveRequests();
            alert(`Leave request ${action}d successfully!`);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.detail || `Failed to ${action} leave request`);
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Leave Management</h1>
            </div>

            {error && <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

            {/* Apply for Leave Section - Only for employees */}
            {isEmployee && (
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Apply for Leave</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in the details below to submit your leave request.</p>

                <form onSubmit={handleSubmitLeave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">Start Date</label>
                            <input type="date" name="start_date" className="form-control" value={formData.start_date} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">End Date</label>
                            <input type="date" name="end_date" className="form-control" value={formData.end_date} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Leave Type</label>
                        <select name="leave_type" className="form-control" value={formData.leave_type} onChange={handleInputChange}>
                            <option>Annual Leave</option>
                            <option>Sick Leave</option>
                            <option>Casual Leave</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Reason</label>
                        <textarea name="reason" className="form-control" rows="3" value={formData.reason} onChange={handleInputChange} placeholder="Briefly describe the reason for your leave..." required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
            )}

            {/* Leave History / All Leave Requests */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    {canApprove ? 'All Leave Requests' : 'Your Leave Requests'}
                </h3>

                {loading ? (
                    <p style={{ color: '#6c757d' }}>Loading leave requests...</p>
                ) : leaveRequests.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>No leave requests submitted yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                                {canApprove && <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Employee</th>}
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Start Date</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>End Date</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Leave Type</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Status</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Reason</th>
                                {canApprove && <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                    {canApprove && (
                                        <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>
                                            {row.user_name || `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim() || 'N/A'}
                                        </td>
                                    )}
                                    <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>{row.start_date}</td>
                                    <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>{row.end_date}</td>
                                    <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>
                                        {row.leave_type === 'annual' ? 'Annual Leave' :
                                         row.leave_type === 'sick' ? 'Sick Leave' :
                                         row.leave_type === 'casual' ? 'Casual Leave' :
                                         row.leave_type === 'unpaid' ? 'Unpaid Leave' :
                                         row.leave_type}
                                    </td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span style={{
                                            fontWeight: '600',
                                            fontSize: '0.8rem',
                                            color: row.status === 'rejected' || row.status === 'Rejected' ? '#dc3545' : 
                                                   (row.status === 'pending' || row.status === 'Pending' ? '#fd7e14' : '#198754'),
                                            backgroundColor: row.status === 'rejected' || row.status === 'Rejected' ? '#f8d7da' : 
                                                           (row.status === 'pending' || row.status === 'Pending' ? '#fff3cd' : '#d1e7dd'),
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            textTransform: 'capitalize'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.reason}</td>
                                    {canApprove && (
                                        <td style={{ padding: '1rem 0' }}>
                                            {(row.status === 'pending' || row.status === 'Pending') ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={() => handleApproveReject(row.id, 'approve')}
                                                        style={{ 
                                                            border: '1px solid #198754', 
                                                            background: '#198754', 
                                                            color: '#fff', 
                                                            padding: '0.25rem 0.5rem', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.75rem', 
                                                            cursor: 'pointer' 
                                                        }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApproveReject(row.id, 'reject')}
                                                        style={{ 
                                                            border: '1px solid #dc3545', 
                                                            background: '#dc3545', 
                                                            color: '#fff', 
                                                            padding: '0.25rem 0.5rem', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.75rem', 
                                                            cursor: 'pointer' 
                                                        }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                                                    {row.approved_by_name ? `By ${row.approved_by_name}` : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leave;
