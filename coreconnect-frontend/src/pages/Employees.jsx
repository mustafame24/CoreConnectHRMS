import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Employees = () => {
    const { token, user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [canAddEmployee, setCanAddEmployee] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', department: '', hire_date: '', role: 'Employee', password: '' });
    const [showPassword, setShowPassword] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        if (token) {
            fetchEmployees();
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/employees/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Extract the data array and can_add_employee flag from the response structure
            const employeeData = response.data?.data || response.data || [];
            setEmployees(employeeData);
            setCanAddEmployee(!!response.data?.can_add_employee);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to load employees');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            // If password is blank, don't send it (let backend generate)
            const submitData = { ...formData };
            if (!submitData.password) delete submitData.password;
            const response = await axios.post('http://localhost:8000/api/employees/', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Use password from backend response
            const password = response.data?.generated_password || formData.password || 'Temp@123';
            setShowPassword({ email: response.data?.email || formData.email, password });
            setFormData({ name: '', email: '', phone: '', address: '', department: '', hire_date: '', role: 'Employee', password: '' });
            // Don't hide form yet - let them see the password modal first
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.errors || err.response?.data?.detail || err.response?.data?.message || 'Failed to add employee');
            console.error('Error:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone_number?.includes(searchTerm)
    );

    const handleViewProfile = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setEditFormData({
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            email: employee.email || '',
            phone_number: employee.phone_number || '',
            address: employee.address || '',
            department: employee.department || '',
            designation: employee.designation || '',
            hire_date: employee.hire_date || ''
        });
    };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/employees/${editingEmployee.id}/`, editFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingEmployee(null);
            setEditFormData({});
            fetchEmployees();
            alert('Employee updated successfully!');
        } catch (err) {
            setError(err.response?.data?.errors || err.response?.data?.message || 'Failed to update employee');
            console.error('Error:', err);
        }
    };

    const isAdmin = user?.role?.toLowerCase() === 'admin';

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Employee Directory</h1>
            </div>

            {error && <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search employees..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="form-control" style={{ width: '150px' }}>
                        <option>All</option>
                    </select>
                </div>
                {canAddEmployee && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> Add Employee
                    </button>
                )}
            </div>
            {!canAddEmployee && (
                <div style={{ marginBottom: '1rem', color: '#856404', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', padding: '0.75rem' }}>
                    Only Admin or HR can add employees. You can view the employee list below.
                </div>
            )}

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f8f9fa' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Add New Employee</h3>
                    <form onSubmit={handleAddEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} autoComplete="off">
                                                <div className="input-group">
                                                    <label className="input-label">Password <span style={{ color: '#6c757d', fontWeight: 400, fontSize: '0.9em' }}>(optional)</span></label>
                                                    <input type="text" name="password" className="form-control" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to auto-generate" autoComplete="new-password" />
                                                </div>
                        <div className="input-group">
                            <label className="input-label">Name</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Phone</label>
                            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Department</label>
                            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Hire Date</label>
                            <input type="date" name="hire_date" className="form-control" value={formData.hire_date} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Role</label>
                            <select name="role" className="form-control" value={formData.role} onChange={handleInputChange}>
                                <option>Employee</option>
                                <option>HR</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">Address</label>
                            <textarea name="address" className="form-control" value={formData.address} onChange={handleInputChange} rows="2"></textarea>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Employee</button>
                            <button type="button" className="btn" style={{ border: '1px solid #dee2e6' }} onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Employee List</h3>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Total employees: {filteredEmployees.length}</p>

                {loading ? (
                    <p style={{ color: '#6c757d' }}>Loading employees...</p>
                ) : filteredEmployees.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>No employees found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>NAME</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>EMAIL</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>PHONE</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>ROLE</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#6c757d' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                    <td style={{ padding: '1rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e9ecef' }}></div>
                                            <span style={{ fontWeight: '500' }}>{emp.first_name} {emp.last_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 0', color: '#6c757d' }}>{emp.email}</td>
                                    <td style={{ padding: '1rem 0', color: '#6c757d' }}>{emp.phone_number || 'N/A'}</td>
                                    <td style={{ padding: '1rem 0', color: '#6c757d' }}>{emp.role?.name || emp.role || 'N/A'}</td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleViewProfile(emp)} style={{ border: '1px solid #dee2e6', background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>View</button>
                                            {isAdmin && (
                                                <button onClick={() => handleEditEmployee(emp)} style={{ border: '1px solid #0056b3', background: '#0056b3', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showPassword && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '400px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: '#28a745' }}>✓ Employee Added Successfully!</h2>
                        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>Please share the temporary password with the employee:</p>
                        
                        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #dee2e6' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Email:</p>
                            <p style={{ margin: '0 0 1rem 0', fontWeight: '600', fontSize: '1rem', color: '#495057' }}>{showPassword.email}</p>
                            
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#6c757d' }}>Temporary Password:</p>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: '#495057', fontFamily: 'monospace', letterSpacing: '1px' }}>{showPassword.password}</p>
                        </div>

                        <p style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.5rem' }}>⚠️ Employee should change this password on first login.</p>

                        <button onClick={() => { setShowPassword(null); setShowForm(false); }} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
                    </div>
                </div>
            )}

            {selectedEmployee && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Employee Profile</h2>
                            <button onClick={() => setSelectedEmployee(null)} style={{
                                background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6c757d'
                            }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Name</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.email}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Role</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.role?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Department</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.department || 'N/A'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Address</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Hire Date</label>
                                <p style={{ margin: 0, color: '#495057' }}>{selectedEmployee.hire_date || 'N/A'}</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setSelectedEmployee(null)} className="btn btn-primary" style={{ flex: 1 }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {editingEmployee && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '600px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Edit Employee</h2>
                            <button onClick={() => { setEditingEmployee(null); setEditFormData({}); }} style={{
                                background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6c757d'
                            }}>×</button>
                        </div>

                        <form onSubmit={handleUpdateEmployee}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">First Name</label>
                                    <input type="text" className="form-control" value={editFormData.first_name || ''} onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Last Name</label>
                                    <input type="text" className="form-control" value={editFormData.last_name || ''} onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input type="email" className="form-control" value={editFormData.email || ''} disabled />
                                    <small style={{ color: '#6c757d' }}>Email cannot be changed</small>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phone</label>
                                    <input type="text" className="form-control" value={editFormData.phone_number || ''} onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Department</label>
                                    <input type="text" className="form-control" value={editFormData.department || ''} onChange={(e) => setEditFormData({...editFormData, department: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Designation</label>
                                    <input type="text" className="form-control" value={editFormData.designation || ''} onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Hire Date</label>
                                    <input type="date" className="form-control" value={editFormData.hire_date || ''} onChange={(e) => setEditFormData({...editFormData, hire_date: e.target.value})} />
                                </div>
                            </div>
                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label">Address</label>
                                <textarea className="form-control" rows="3" value={editFormData.address || ''} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                <button type="button" className="btn" style={{ border: '1px solid #dee2e6' }} onClick={() => { setEditingEmployee(null); setEditFormData({}); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
