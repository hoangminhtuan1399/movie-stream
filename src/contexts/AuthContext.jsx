import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMe } from '../services/userService';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      getMe()
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }; 