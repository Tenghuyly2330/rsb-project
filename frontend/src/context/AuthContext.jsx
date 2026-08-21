import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(() => {
            try {
                  const savedUser = localStorage.getItem('user');
                  return savedUser ? JSON.parse(savedUser) : null;
            } catch (e) {
                  return null;
            }
      });
      const [token, setToken] = useState(() => localStorage.getItem('token') || null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const verifyUser = async () => {
                  if (token) {
                        try {
                              const res = await api.get('/auth/me');
                              setUser(res.data.data);
                              localStorage.setItem('user', JSON.stringify(res.data.data));
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
            const { token: jwtToken, user: userData } = res.data.data;
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(jwtToken);
            setUser(userData);
            return userData;
      };

      const logout = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      };

      const register = async (name, email, password) => {
            const res = await api.post('/auth/register', { name, email, password });
            const { token: jwtToken, user: userData } = res.data.data;
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(jwtToken);
            setUser(userData);
            return userData;
      };

      const updateUser = (userData) => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
      };

      return (
            <AuthContext.Provider value={{ user, token, login, logout, register, updateUser, loading }}>
                  {children}
            </AuthContext.Provider>
      );
};
