import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (savedToken && userStr) {
            try {
                const userData = JSON.parse(userStr);
                setToken(savedToken);
                setUser(userData);
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login/', { email, password });
            
            if (res.data.status === 'success') {
                const { token: newToken, user: userData } = res.data;

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(newToken);
                setUser(userData);
                return { success: true, role: userData.role };
            }
        } catch (error) {
            console.error("Login error", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Login failed';
            return { success: false, error: errorMsg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
