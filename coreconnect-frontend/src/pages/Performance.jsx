import { useState } from 'react';
import { Eye } from 'lucide-react';

const Performance = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Performance Reviews</h1>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button className="btn" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', marginRight: '0.5rem' }}>Review Management</button>
                <button className="btn" style={{ backgroundColor: 'transparent', color: '#6c757d' }}>My Evaluations</button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Create New Review</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Initiate a performance review for an employee.</p>

                <div className="input-group">
                    <label className="input-label">Employee</label>
                    <select className="form-control">
                        <option>Select an employee</option>
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label">Review Period</label>
                    <input type="text" className="form-control" />
                </div>

                <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Key Performance Indicators (KPIs)</h4>

                {['Innovation', 'Teamwork', 'Problem Solving', 'Communication', 'Efficiency'].map((kpi) => (
                    <div key={kpi} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label className="input-label" style={{ marginBottom: 0 }}>{kpi}</label>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Rating: 0</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input type="text" className="form-control" placeholder={`Achieve ${kpi} targets`} style={{ flex: 1 }} />
                            <input type="range" min="0" max="10" style={{ width: '200px' }} />
                        </div>
                    </div>
                ))}

                <div className="input-group">
                    <label className="input-label">Comments</label>
                    <textarea className="form-control" rows="4" placeholder="Add overall comments for the review"></textarea>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }}>Submit Review</button>
            </div>

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
                            { name: 'Alice Johnson', reviewer: 'Manager A', status: 'Pending', date: '2023-12-31', statusColor: '#cfe2ff', statusText: '#084298' },
                            { name: 'Bob Williams', reviewer: 'Manager B', status: 'In Progress', date: '2024-01-15', statusColor: '#f8f9fa', statusText: '#6c757d' },
                            { name: 'Charlie Davis', reviewer: 'Manager C', status: 'Overdue', date: '2023-11-01', statusColor: '#f8d7da', statusText: '#842029' },
                            { name: 'Diana Miller', reviewer: 'Manager A', status: 'Pending', date: '2024-02-28', statusColor: '#cfe2ff', statusText: '#084298' },
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
                                <td style={{ padding: '1rem 0' }}><Eye size={16} color="#6c757d" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Performance;
