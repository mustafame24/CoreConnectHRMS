import { useAuth } from '../context/AuthContext';
import HRDashboard from './HR/HRDashboard';
import EmployeeDashboard from './Employee/EmployeeDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    // Default to EmployeeDashboard if no role or unknown role, 
    // but strictly speaking we should check.
    // For this demo, if role is 'Admin' or 'HR', show HRDashboard.

    const isHR = user?.role === 'Admin' || user?.role === 'HR';

    return isHR ? <HRDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
