import { useState } from 'react';

const Payroll = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Payroll Management</h1>
                <p style={{ color: '#6c757d' }}>Manage employee compensation, deductions, and payslips.</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Salary & Deductions Setup</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Configure base salary, allowances, and standard deductions for employees.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Base Salary (USD)</label>
                        <input type="text" className="form-control" defaultValue="60,000" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Housing Allowance (USD)</label>
                        <input type="text" className="form-control" defaultValue="5,000" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Transport Allowance (USD)</label>
                        <input type="text" className="form-control" defaultValue="2,000" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Deduction Type</label>
                        <select className="form-control">
                            <option>Provident Fund (PF)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Deduction Amount (USD)</label>
                        <input type="text" className="form-control" defaultValue="1,500" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary">Save Settings</button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Monthly Payroll Processing</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Manage and process employee salaries for the current payroll cycle.</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontWeight: '500' }}>Current Payroll Period: June 2024</div>
                    <button className="btn btn-primary">Process Monthly Payroll</button>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Payroll Batches</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Batch ID</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Payroll Period</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Status</th>
                            <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Processed On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'PB001', period: 'January 2024', status: 'Completed', date: '2024-01-25', color: '#198754' },
                            { id: 'PB002', period: 'February 2024', status: 'Completed', date: '2024-02-24', color: '#198754' },
                            { id: 'PB003', period: 'March 2024', status: 'Completed', date: '2024-03-22', color: '#198754' },
                            { id: 'PB004', period: 'April 2024', status: 'Pending', date: 'N/A', color: '#fd7e14' },
                            { id: 'PB005', period: 'May 2024', status: 'Pending', date: 'N/A', color: '#fd7e14' },
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                <td style={{ padding: '1rem 0', fontWeight: '500' }}>{row.id}</td>
                                <td style={{ padding: '1rem 0' }}>{row.period}</td>
                                <td style={{ padding: '1rem 0' }}>
                                    <span style={{
                                        backgroundColor: row.color,
                                        color: '#fff',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 0' }}>{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Payslip Management</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>View and download employee payslips for specific periods.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Select Employee</label>
                        <select className="form-control">
                            <option>Alice Johnson</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Select Period</label>
                        <select className="form-control">
                            <option>May 2024</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button className="btn btn-primary">View Payslip</button>
                    <button className="btn" style={{ border: '1px solid #dee2e6' }}>Download PDF</button>
                </div>

                <div style={{ backgroundColor: '#f8f9fa', padding: '4rem', textAlign: 'center', color: '#6c757d', borderRadius: '4px' }}>
                    Payslip preview will be displayed here for Alice Johnson for May 2024.
                </div>
            </div>
        </div>
    );
};

export default Payroll;
