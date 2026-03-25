import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        manager: '',
        employeeCount: 0
    });

    // Sample departments data (in a real app, this would come from the API)
    const sampleDepartments = [
        {
            id: 1,
            name: 'Human Resources',
            description: 'Handles recruitment, employee relations, and payroll',
            manager: 'Sarah Anderson',
            employeeCount: 12
        },
        {
            id: 2,
            name: 'Information Technology',
            description: 'Software development and infrastructure management',
            manager: 'James Mitchell',
            employeeCount: 25
        },
        {
            id: 3,
            name: 'Finance',
            description: 'Financial planning, accounting, and auditing',
            manager: 'Emily Rodriguez',
            employeeCount: 8
        },
        {
            id: 4,
            name: 'Sales & Marketing',
            description: 'Business development and brand management',
            manager: 'Michael Thompson',
            employeeCount: 18
        },
        {
            id: 5,
            name: 'Operations',
            description: 'Daily business operations and logistics',
            manager: 'David Kumar',
            employeeCount: 15
        },
        {
            id: 6,
            name: 'Customer Support',
            description: 'Customer service and technical support',
            manager: 'Lisa Johnson',
            employeeCount: 20
        }
    ];

    useEffect(() => {
        // In a real app, fetch from API
        // try {
        //     const token = localStorage.getItem('token');
        //     const response = await fetch('http://localhost:8000/api/departments/', {
        //         headers: { 'Authorization': `Bearer ${token}` }
        //     });
        //     const data = await response.json();
        //     setDepartments(data);
        // } catch (error) {
        //     console.error('Error fetching departments:', error);
        // }
        setDepartments(sampleDepartments);
    }, []);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'employeeCount' ? parseInt(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            // Update existing department
            setDepartments(departments.map(dept =>
                dept.id === editingId ? { ...formData, id: editingId } : dept
            ));
        } else {
            // Add new department
            setDepartments([...departments, {
                ...formData,
                id: Math.max(...departments.map(d => d.id), 0) + 1
            }]);
        }

        // Reset form
        setFormData({ name: '', description: '', manager: '', employeeCount: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (department) => {
        setFormData(department);
        setEditingId(department.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this department?')) {
            setDepartments(departments.filter(dept => dept.id !== id));
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '', manager: '', employeeCount: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Departments</h1>
                <p style={{ color: '#6c757d' }}>Manage and view all company departments</p>
            </div>

            {/* Search and Add Button */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                    <input
                        type="text"
                        placeholder="Search departments by name or manager..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            border: '1px solid #dee2e6',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> Add Department
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div
                    style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.375rem',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>
                        {editingId ? 'Edit Department' : 'Add New Department'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Department Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Department Manager</label>
                                <input
                                    type="text"
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.375rem',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Employee Count</label>
                            <input
                                type="number"
                                name="employeeCount"
                                value={formData.employeeCount}
                                onChange={handleInputChange}
                                min="0"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.375rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update' : 'Create'} Department
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={handleCancel}
                                style={{ backgroundColor: '#fff', border: '1px solid #dee2e6' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Departments Grid */}
            {filteredDepartments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>No departments found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {filteredDepartments.map((department) => (
                        <div key={department.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                                    {department.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(department)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#0056b3',
                                            padding: '0.25rem'
                                        }}
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(department.id)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#dc3545',
                                            padding: '0.25rem'
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p style={{ color: '#495057', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                {department.description}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Manager</div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{department.manager}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>Employees</div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{department.employeeCount}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Departments</p>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#0056b3' }}>{departments.length}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Employees</p>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#28a745' }}>
                        {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                    </h2>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Avg Employees/Dept</p>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#ffc107' }}>
                        {departments.length > 0
                            ? (departments.reduce((sum, dept) => sum + dept.employeeCount, 0) / departments.length).toFixed(1)
                            : 0}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Departments;
