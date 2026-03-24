import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            // Navigate based on role
            const role = result.role.toLowerCase();
            if (role === 'admin') navigate('/admin');
            else if (role === 'hr') navigate('/hr');
            else navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#0056b3', fontSize: '1.8rem', marginBottom: '1rem' }}>CoreConnect HRMS</h1>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Sign In to Your Account</h2>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="........"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign In
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <a href="#" style={{ color: '#0056b3', fontSize: '0.9rem' }}>Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
