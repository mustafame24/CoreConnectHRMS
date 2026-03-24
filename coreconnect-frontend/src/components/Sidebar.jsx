import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Building2,
    Clock,
    CalendarDays,
    Wallet,
    BarChart3,
    Megaphone,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Building2, label: 'Departments', path: '/departments' },
        { icon: Clock, label: 'Attendance', path: '/attendance' },
        // Only show Attendance Summary for admin
        ...(user?.role?.name === 'admin' ? [
            { icon: BarChart3, label: 'Attendance Summary', path: '/attendance-summary' }
        ] : []),
        { icon: CalendarDays, label: 'Leave', path: '/leave' },
        { icon: Wallet, label: 'Payroll', path: '/payroll' },
        { icon: BarChart3, label: 'Performance', path: '/performance' },
        { icon: Megaphone, label: 'Announcements', path: '/announcements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 style={{ color: '#0056b3', fontSize: '1.25rem' }}>CoreConnect</h2>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div style={{ padding: '1rem', borderTop: '1px solid #e9ecef' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.first_name || user?.name || 'User'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{user?.email || 'user@hrms.com'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
