import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Attendance = () => {
    const { token, user } = useAuth();
    const [status, setStatus] = useState('Not marked');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    
    // Check if user is an employee (only employees can mark attendance)
    const isEmployee = user?.role?.toLowerCase() === 'employee';

    useEffect(() => {
        fetchAttendanceSummary();
    }, [token]);

    const fetchAttendanceSummary = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/attendance/summary/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(response.data);
            if (response.data.today_status) {
                setStatus(response.data.today_status);
            }
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const markAttendance = async (attendanceStatus) => {
        try {
            setLoading(true);
            await axios.post('http://localhost:8000/api/attendance/mark/', 
                { status: attendanceStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus(attendanceStatus);
            setError(null);
            fetchAttendanceSummary();
            alert(`Attendance marked as ${attendanceStatus}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Attendance Management</h1>
            </div>

            {error && <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

            {/* Employee Actions - Only show for employees */}
            {isEmployee ? (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Mark Attendance</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => markAttendance('Present')} disabled={loading} style={{ width: '120px' }}>
                                {loading ? 'Marking...' : 'Check In'}
                            </button>
                            <button className="btn" onClick={() => markAttendance('Absent')} disabled={loading} style={{ width: '120px', border: '1px solid #dee2e6', backgroundColor: '#fff' }}>
                                {loading ? 'Marking...' : 'Mark Absent'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Today's Status:</span>
                            <span style={{ backgroundColor: status === 'Not marked' ? '#f8f9fa' : '#d1e7dd', color: status === 'Not marked' ? '#6c757d' : '#0f5132', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: '600', fontSize: '0.85rem' }}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#856404' }}>Attendance Management</h3>
                    <p style={{ color: '#856404', margin: 0 }}>
                        {user?.role?.toLowerCase() === 'admin' 
                            ? 'As an admin, you can view attendance summaries but cannot mark attendance. Please use the Attendance Summary page to view all employees\' attendance records.'
                            : 'Only employees can mark their attendance. Please contact your administrator if you need to update your attendance.'}
                    </p>
                </div>
            )}

            {/* Summary Stats */}
            {summary && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Monthly Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Total Working Days</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summary.total_working_days || '20'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Days Present</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summary.days_present || '0'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Days Absent</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summary.days_absent || '0'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Attendance Rate</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summary.attendance_rate || '0'}%</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
