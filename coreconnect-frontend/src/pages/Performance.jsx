import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const Performance = () => {
    const [activeTab, setActiveTab] = useState('review');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [reviewPeriod, setReviewPeriod] = useState('');
    const [comments, setComments] = useState('');
    const [ratings, setRatings] = useState({
        Technical: 0,
        Communication: 0,
        Teamwork: 0,
        Punctuality: 0,
        Reliability: 0,
        Overall: 0
    });

    // Sample employees data
    const sampleEmployees = [
        { id: 1, name: 'Alice Johnson', email: 'alice@hrms.com', department: 'HR' },
        { id: 2, name: 'Bob Williams', email: 'bob@hrms.com', department: 'IT' },
        { id: 3, name: 'Charlie Davis', email: 'charlie@hrms.com', department: 'Finance' },
        { id: 4, name: 'Diana Miller', email: 'diana@hrms.com', department: 'Sales' },
        { id: 5, name: 'Eve Martinez', email: 'eve@hrms.com', department: 'Operations' },
        { id: 6, name: 'Frank Johnson', email: 'frank@hrms.com', department: 'IT' },
    ];

    useEffect(() => {
        // In a real app, fetch employees from API
        // try {
        //     const token = localStorage.getItem('token');
        //     const response = await fetch('http://localhost:8000/api/employees/', {
        //         headers: { 'Authorization': `Bearer ${token}` }
        //     });
        //     const data = await response.json();
        //     setEmployees(data);
        // } catch (error) {
        //     console.error('Error fetching employees:', error);
        // }
        setEmployees(sampleEmployees);
    }, []);

    const handleRatingChange = (kpi, value) => {
        setRatings({
            ...ratings,
            [kpi]: parseInt(value)
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }

        // In a real app, submit to API
        console.log({
            employee: selectedEmployee,
            reviewPeriod,
            ratings,
            comments
        });

        alert('Review submitted successfully!');
        
        // Reset form
        setSelectedEmployee('');
        setReviewPeriod('');
        setComments('');
        setRatings({
            Technical: 0,
            Communication: 0,
            Teamwork: 0,
            Punctuality: 0,
            Reliability: 0,
            Overall: 0
        });
    };

    const kpis = ['Technical', 'Communication', 'Teamwork', 'Punctuality', 'Reliability', 'Overall'];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Performance Reviews</h1>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button 
                    className="btn" 
                    onClick={() => setActiveTab('review')}
                    style={{ 
                        backgroundColor: activeTab === 'review' ? '#f8f9fa' : 'transparent',
                        border: activeTab === 'review' ? '1px solid #dee2e6' : 'none',
                        marginRight: '0.5rem',
                        color: activeTab === 'review' ? '#000' : '#6c757d'
                    }}
                >
                    Review Management
                </button>
                <button 
                    className="btn" 
                    onClick={() => setActiveTab('evaluations')}
                    style={{ 
                        backgroundColor: activeTab === 'evaluations' ? '#f8f9fa' : 'transparent',
                        border: activeTab === 'evaluations' ? '1px solid #dee2e6' : 'none',
                        color: activeTab === 'evaluations' ? '#000' : '#6c757d'
                    }}
                >
                    My Evaluations
                </button>
            </div>

            {activeTab === 'review' && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Create New Review</h3>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Initiate a performance review for an employee.</p>

                    <form onSubmit={handleSubmitReview}>
                        <div className="input-group">
                            <label className="input-label">Employee</label>
                            <select 
                                className="form-control"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                            >
                                <option value="">Select an employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Review Period</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="e.g., Q1 2024"
                                value={reviewPeriod}
                                onChange={(e) => setReviewPeriod(e.target.value)}
                            />
                        </div>

                        <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Key Performance Indicators (KPIs)</h4>

                        {kpis.map((kpi) => (
                            <div key={kpi} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label className="input-label" style={{ marginBottom: 0 }}>{kpi}</label>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0056b3' }}>Rating: {ratings[kpi]}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10" 
                                    value={ratings[kpi]}
                                    onChange={(e) => handleRatingChange(kpi, e.target.value)}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                            </div>
                        ))}

                        <div className="input-group">
                            <label className="input-label">Comments</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="Add overall comments for the review"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Review</button>
                    </form>
                </div>
            )}

            {activeTab === 'review' && (
                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Pending Reviews</h3>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Reviews awaiting action or completion.</p>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Employee</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Reviewer</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Status</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Due Date</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Alice Johnson', reviewer: 'Manager A', status: 'Pending', date: '2024-12-31', statusColor: '#cfe2ff', statusText: '#084298' },
                                { name: 'Bob Williams', reviewer: 'Manager B', status: 'In Progress', date: '2025-01-15', statusColor: '#f8f9fa', statusText: '#6c757d' },
                                { name: 'Charlie Davis', reviewer: 'Manager C', status: 'Overdue', date: '2024-11-01', statusColor: '#f8d7da', statusText: '#842029' },
                                { name: 'Diana Miller', reviewer: 'Manager A', status: 'Pending', date: '2025-02-28', statusColor: '#cfe2ff', statusText: '#084298' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{row.name}</td>
                                    <td style={{ padding: '1rem 0' }}>{row.reviewer}</td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span style={{
                                            backgroundColor: row.statusColor,
                                            color: row.statusText,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0' }}>{row.date}</td>
                                    <td style={{ padding: '1rem 0' }}><Eye size={16} color="#6c757d" style={{ cursor: 'pointer' }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'evaluations' && (
                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>My Performance Evaluations</h3>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Reviews that have been completed for you.</p>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Reviewer</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Period</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Overall Rating</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Status</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { reviewer: 'Manager A', period: 'Q4 2024', rating: 4.2, status: 'Completed', statusColor: '#d1e7dd', statusText: '#0f5132' },
                                { reviewer: 'Manager B', period: 'Q3 2024', rating: 3.9, status: 'Completed', statusColor: '#d1e7dd', statusText: '#0f5132' },
                                { reviewer: 'Manager A', period: 'Q2 2024', rating: 4.5, status: 'Completed', statusColor: '#d1e7dd', statusText: '#0f5132' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{row.reviewer}</td>
                                    <td style={{ padding: '1rem 0' }}>{row.period}</td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span style={{ color: '#0056b3', fontWeight: '600' }}>{row.rating} / 5.0</span>
                                    </td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span style={{
                                            backgroundColor: row.statusColor,
                                            color: row.statusText,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0' }}><Eye size={16} color="#6c757d" style={{ cursor: 'pointer' }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Performance;
