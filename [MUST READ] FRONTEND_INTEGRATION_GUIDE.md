# Frontend Integration Guide - New Modules

## 🎯 How to Connect Frontend to New APIs

This guide shows how to integrate the newly implemented backend modules with React components.

---

## 📱 Component Structure

Each module should have the following folder structure:

```
src/pages/
├── Payroll/
│   ├── PayrollList.jsx
│   ├── PayrollForm.jsx
│   └── BenefitsForm.jsx
├── PerformanceReviews/
│   ├── ReviewsList.jsx
│   ├── ReviewForm.jsx
│   └── EmployeeReviews.jsx
├── Announcements/ (Update existing)
│   ├── AnnouncementsList.jsx
│   ├── AnnouncementForm.jsx
│   └── AnnouncementDetail.jsx
├── Helpdesk/
│   ├── TicketsList.jsx
│   ├── TicketForm.jsx
│   ├── TicketDetail.jsx
│   └── TicketComments.jsx
├── TaxRecords/
│   ├── TaxRecordsList.jsx
│   └── TaxRecordForm.jsx
└── Recruitment/
    ├── JobPostings.jsx
    ├── JobPostingForm.jsx
    ├── Candidates.jsx
    └── CandidateProfile.jsx
```

---

## 🔌 API Service Template

Create file: `src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 1️⃣ PAYROLL MODULE

### Create Payroll Service: `src/services/payrollService.js`

```javascript
import api from './api';

export const payrollService = {
  // Get all payroll records
  getPayroll: async (employeeId = null, month = null) => {
    const params = {};
    if (employeeId) params.employee_id = employeeId;
    if (month) params.month = month;
    return api.get('/payroll/', { params });
  },

  // Get specific payroll
  getPayrollDetail: async (payrollId) => {
    return api.get(`/payroll/${payrollId}/`);
  },

  // Create payroll
  createPayroll: async (payrollData) => {
    return api.post('/payroll/', payrollData);
  },

  // Update payroll
  updatePayroll: async (payrollId, payrollData) => {
    return api.put(`/payroll/${payrollId}/`, payrollData);
  },

  // Get benefits
  getBenefits: async () => {
    return api.get('/benefits/');
  },

  // Update benefits
  updateBenefits: async (benefitsData) => {
    return api.post('/benefits/', benefitsData);
  },
};
```

### Create Payroll Component: `src/pages/Payroll/PayrollList.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';

function PayrollList() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const response = await payrollService.getPayroll();
      setPayroll(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Payroll Management</h1>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Tax</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map(record => (
            <tr key={record.id}>
              <td>{record.user_name}</td>
              <td>{record.month}</td>
              <td>₹{record.basic_salary}</td>
              <td>₹{record.allowances}</td>
              <td>₹{record.deductions}</td>
              <td>₹{record.tax}</td>
              <td>₹{record.net_salary}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PayrollList;
```

---

## 2️⃣ PERFORMANCE REVIEWS MODULE

### Create Review Service: `src/services/reviewService.js`

```javascript
import api from './api';

export const reviewService = {
  // Get all reviews
  getReviews: async (employeeId = null) => {
    const params = employeeId ? { employee_id: employeeId } : {};
    return api.get('/performance-reviews/', { params });
  },

  // Get specific review
  getReviewDetail: async (reviewId) => {
    return api.get(`/performance-reviews/${reviewId}/`);
  },

  // Create review
  createReview: async (reviewData) => {
    return api.post('/performance-reviews/', reviewData);
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return api.put(`/performance-reviews/${reviewId}/`, reviewData);
  },
};
```

### Create Review Component: `src/pages/PerformanceReviews/ReviewForm.jsx`

```javascript
import React, { useState } from 'react';
import { reviewService } from '../../services/reviewService';

function ReviewForm({ employeeId, onSubmit }) {
  const [formData, setFormData] = useState({
    employee: employeeId,
    review_period_start: '',
    review_period_end: '',
    technical_skills: 3,
    communication_skills: 3,
    teamwork: 3,
    punctuality: 3,
    reliability: 3,
    strengths: '',
    areas_for_improvement: '',
    goals_for_next_period: '',
    comments: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await reviewService.createReview(formData);
      onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Review Period Start</label>
        <input
          type="date"
          name="review_period_start"
          value={formData.review_period_start}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Review Period End</label>
        <input
          type="date"
          name="review_period_end"
          value={formData.review_period_end}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Technical Skills (1-5)</label>
        <input
          type="number"
          name="technical_skills"
          min="1"
          max="5"
          value={formData.technical_skills}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Communication Skills (1-5)</label>
        <input
          type="number"
          name="communication_skills"
          min="1"
          max="5"
          value={formData.communication_skills}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Teamwork (1-5)</label>
        <input
          type="number"
          name="teamwork"
          min="1"
          max="5"
          value={formData.teamwork}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Strengths</label>
        <textarea
          name="strengths"
          value={formData.strengths}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Areas for Improvement</label>
        <textarea
          name="areas_for_improvement"
          value={formData.areas_for_improvement}
          onChange={handleInputChange}
          required
        />
      </div>

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
```

---

## 3️⃣ ANNOUNCEMENTS MODULE

### Create Announcement Service: `src/services/announcementService.js`

```javascript
import api from './api';

export const announcementService = {
  // Get all announcements
  getAnnouncements: async () => {
    return api.get('/announcements/');
  },

  // Get specific announcement
  getAnnouncementDetail: async (announcementId) => {
    return api.get(`/announcements/${announcementId}/`);
  },

  // Create announcement (HR/Admin only)
  createAnnouncement: async (announcementData) => {
    return api.post('/announcements/', announcementData);
  },

  // Update announcement
  updateAnnouncement: async (announcementId, announcementData) => {
    return api.put(`/announcements/${announcementId}/`, announcementData);
  },
};
```

---

## 4️⃣ HELPDESK MODULE

### Create Helpdesk Service: `src/services/helpdeskService.js`

```javascript
import api from './api';

export const helpdeskService = {
  // Get all tickets
  getTickets: async (status = null) => {
    const params = status ? { status } : {};
    return api.get('/helpdesk/tickets/', { params });
  },

  // Get specific ticket
  getTicketDetail: async (ticketId) => {
    return api.get(`/helpdesk/tickets/${ticketId}/`);
  },

  // Create ticket
  createTicket: async (ticketData) => {
    return api.post('/helpdesk/tickets/', ticketData);
  },

  // Update ticket
  updateTicket: async (ticketId, ticketData) => {
    return api.put(`/helpdesk/tickets/${ticketId}/`, ticketData);
  },

  // Add comment to ticket
  addComment: async (ticketId, commentText) => {
    return api.post(`/helpdesk/tickets/${ticketId}/comments/`, {
      comment_text: commentText
    });
  },
};
```

### Create Helpdesk Component: `src/pages/Helpdesk/TicketForm.jsx`

```javascript
import React, { useState } from 'react';
import { helpdeskService } from '../../services/helpdeskService';

function TicketForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'leave', 'payroll', 'attendance', 'benefits', 'general', 'technical', 'other'
  ];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await helpdeskService.createTicket(formData);
      setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
      alert('Ticket created successfully!');
      onSubmit?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
        >
          {priorities.map(pri => (
            <option key={pri} value={pri}>{pri}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  );
}

export default TicketForm;
```

---

## 5️⃣ TAX RECORDS MODULE

### Create Tax Service: `src/services/taxService.js`

```javascript
import api from './api';

export const taxService = {
  // Get all tax records
  getTaxRecords: async (employeeId = null, financialYear = null) => {
    const params = {};
    if (employeeId) params.employee_id = employeeId;
    if (financialYear) params.financial_year = financialYear;
    return api.get('/tax-records/', { params });
  },

  // Get specific tax record
  getTaxRecordDetail: async (taxId) => {
    return api.get(`/tax-records/${taxId}/`);
  },

  // Create tax record
  createTaxRecord: async (taxData) => {
    return api.post('/tax-records/', taxData);
  },

  // Update tax record
  updateTaxRecord: async (taxId, taxData) => {
    return api.put(`/tax-records/${taxId}/`, taxData);
  },
};
```

---

## 6️⃣ RECRUITMENT MODULE

### Create Recruitment Service: `src/services/recruitmentService.js`

```javascript
import api from './api';

export const recruitmentService = {
  // Job Postings
  getJobPostings: async () => {
    return api.get('/job-postings/');
  },

  getJobPostingDetail: async (jobId) => {
    return api.get(`/job-postings/${jobId}/`);
  },

  createJobPosting: async (jobData) => {
    return api.post('/job-postings/', jobData);
  },

  updateJobPosting: async (jobId, jobData) => {
    return api.put(`/job-postings/${jobId}/`, jobData);
  },

  // Candidates
  getCandidates: async (jobId = null, status = null) => {
    const params = {};
    if (jobId) params.job_id = jobId;
    if (status) params.status = status;
    return api.get('/candidates/', { params });
  },

  getCandidateDetail: async (candidateId) => {
    return api.get(`/candidates/${candidateId}/`);
  },

  submitApplication: async (candidateData) => {
    return api.post('/candidates/', candidateData);
  },

  updateCandidate: async (candidateId, candidateData) => {
    return api.put(`/candidates/${candidateId}/`, candidateData);
  },
};
```

---

## 🔒 Authentication Context Update

Update your `src/context/AuthContext.jsx` to include role checks:

```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  // Check user role
  const isAdmin = auth?.user?.role === 'admin';
  const isHR = auth?.user?.role === 'hr';
  const isEmployee = auth?.user?.role === 'employee';
  const isHROrAdmin = isHR || isAdmin;

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAdmin, isHR, isEmployee, isHROrAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 📋 Protected Route Component

Create: `src/components/ProtectedRoute.jsx`

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRoles = [] }) {
  const { auth, isHROrAdmin, isAdmin, isHR, isEmployee } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => {
      switch(role) {
        case 'admin': return isAdmin;
        case 'hr': return isHR;
        case 'employee': return isEmployee;
        case 'hrOrAdmin': return isHROrAdmin;
        default: return false;
      }
    });

    if (!hasRequiredRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute;
```

---

## 🛣️ Route Configuration Update

Update your routing to include new pages:

```javascript
import PayrollList from './pages/Payroll/PayrollList';
import ReviewsList from './pages/PerformanceReviews/ReviewsList';
import AnnouncementsList from './pages/Announcements/AnnouncementsList';
import TicketsList from './pages/Helpdesk/TicketsList';
import TaxRecordsList from './pages/TaxRecords/TaxRecordsList';
import JobPostingsList from './pages/Recruitment/JobPostingsList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Payroll - Admin/HR only */}
      <Route
        path="/payroll"
        element={
          <ProtectedRoute requiredRoles={['hrOrAdmin']}>
            <PayrollList />
          </ProtectedRoute>
        }
      />

      {/* Performance Reviews - Admin/HR only */}
      <Route
        path="/reviews"
        element={
          <ProtectedRoute requiredRoles={['hrOrAdmin']}>
            <ReviewsList />
          </ProtectedRoute>
        }
      />

      {/* Announcements - All users */}
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <AnnouncementsList />
          </ProtectedRoute>
        }
      />

      {/* Helpdesk - All users */}
      <Route
        path="/helpdesk"
        element={
          <ProtectedRoute>
            <TicketsList />
          </ProtectedRoute>
        }
      />

      {/* Tax Records - Admin/HR only */}
      <Route
        path="/tax-records"
        element={
          <ProtectedRoute requiredRoles={['hrOrAdmin']}>
            <TaxRecordsList />
          </ProtectedRoute>
        }
      />

      {/* Recruitment - Admin/HR only */}
      <Route
        path="/recruitment"
        element={
          <ProtectedRoute requiredRoles={['hrOrAdmin']}>
            <JobPostingsList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## ✅ INTEGRATION CHECKLIST

- [ ] Create all service files in `src/services/`
- [ ] Create all component files in `src/pages/`
- [ ] Update routing configuration
- [ ] Update AuthContext with role checks
- [ ] Create ProtectedRoute component
- [ ] Add navigation links in Sidebar
- [ ] Test all API calls
- [ ] Handle loading and error states
- [ ] Add form validation
- [ ] Style components with TailwindCSS/CSS

---

## 🧪 Testing API Calls

Use browser console or Postman:

```bash
# Login first
POST http://localhost:8000/api/auth/login/
```

Then use the returned token for all subsequent requests:

```bash
# Headers
Authorization: Bearer <token>
Content-Type: application/json
```

---

**Frontend integration guide complete!** 🎉

Follow these patterns for each module and your frontend will be fully connected to all your new backends.
