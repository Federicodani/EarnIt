import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// In production the VITE_API_URL env var points to Render backend.
// In development the Vite proxy forwards /api -> localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL || '';

const API = axios.create({ baseURL: `${BASE_URL}/api` });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('earnova_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('earnova_token');
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('earnova_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('earnova_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    localStorage.setItem('earnova_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('earnova_token');
    setUser(null);
  };

  const forgotPassword = async (email, phone) => {
    const res = await API.post('/auth/forgot-password', { email, phone });
    return res.data;
  };

  const resetPassword = async (token, password) => {
    const res = await API.put(`/auth/reset-password/${token}`, { password });
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await API.put('/auth/update-profile', data);
    setUser(res.data.user);
    return res.data;
  };

  const refreshUser = async () => {
    const res = await API.get('/auth/me');
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, updateProfile, refreshUser, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export { API };
