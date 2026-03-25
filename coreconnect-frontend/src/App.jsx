import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import UserProfile from './pages/Admin/UserProfile';

import Performance from './pages/Performance';
import Payroll from './pages/Payroll';
import Announcements from './pages/Announcements';
import Leave from './pages/Leave';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import AttendanceSummary from './pages/AttendanceSummary';
import Departments from './pages/Departments';

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/hr" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance-summary" element={<AttendanceSummary />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/settings" element={<UserProfile />} />

            {/* Redirect root to login for now, or dashboard if auth logic was fully implemented in this file */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
