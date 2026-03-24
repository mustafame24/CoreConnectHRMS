import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AttendanceSummary = () => {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token && user?.role?.toLowerCase() === 'admin') {
      fetchSummary();
    }
  }, [token, user]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/attendance/summary/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data.summary);
      setRecords(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance summary');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role?.toLowerCase() !== 'admin') {
    return <div style={{ padding: '2rem', color: '#856404', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px' }}>Attendance summary is only available to admins.</div>;
  }

  return (
    <div>
      <h1 className="page-title">Attendance Summary (Today)</h1>
      {error && <div style={{ color: '#721c24', background: '#f8d7da', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : summary ? (
        <>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            <div><b>Total Employees:</b> {summary.total_employees}</div>
            <div><b>Marked:</b> {summary.marked}</div>
            <div><b>Not Marked:</b> {summary.not_marked}</div>
            <div><b>Present:</b> {summary.present}</div>
            <div><b>Absent:</b> {summary.absent}</div>
            <div><b>On Leave:</b> {summary.on_leave}</div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Today's Attendance Records</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={5} style={{ color: '#6c757d' }}>No attendance records for today.</td></tr>
                ) : records.map((rec, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td>{rec.user_name || 'N/A'}</td>
                    <td>{rec.user_email || 'N/A'}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: rec.status === 'present' ? '#d1e7dd' : 
                                        rec.status === 'absent' ? '#f8d7da' : 
                                        rec.status === 'leave' ? '#fff3cd' : '#e9ecef',
                        color: rec.status === 'present' ? '#0f5132' : 
                               rec.status === 'absent' ? '#721c24' : 
                               rec.status === 'leave' ? '#856404' : '#6c757d'
                      }}>
                        {rec.status === 'not_marked' ? 'Not Marked' : rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                      </span>
                    </td>
                    <td>{rec.check_in_time || '-'}</td>
                    <td>{rec.check_out_time || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AttendanceSummary;
