import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(() => {
            try {
                  const savedUser = localStorage.getItem('admin_user');
                  return savedUser ? JSON.parse(savedUser) : null;
            } catch (e) {
                  return null;
            }
      });
      const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const verifyUser = async () => {
                  if (token) {
                        try {
                              const res = await api.get('/auth/me');
                              if (res.data.data.role !== 'admin') {
                                    logout();
                              } else {
                                    setUser(res.data.data);
                                    localStorage.setItem('admin_user', JSON.stringify(res.data.data));
                              }
                        } catch (err) {
                              logout();
                        }
                  }
                  setLoading(false);
            };
            verifyUser();
      }, [token]);

      const login = async (email, password) => {
            const res = await api.post('/auth/login', { email, password });
            const userData = res.data.data.user;
            const jwtToken = res.data.data.token;

            if (userData.role !== 'admin') {
                  throw new Error('Access denied. Admin account required.');
            }

            localStorage.setItem('admin_token', jwtToken);
            localStorage.setItem('admin_user', JSON.stringify(userData));
            setToken(jwtToken);
            setUser(userData);
            return userData;
      };

      const logout = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
      };

      return (
            <AuthContext.Provider value={{ user, token, login, logout, loading }}>
                  {children}
            </AuthContext.Provider>
      );
};
