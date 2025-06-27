import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { getMe } from '../services/userService';
import { PageContext } from './PageContext';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [loading, setLoading] = useState(true);
  const { setGlobalLoading } = useContext(PageContext);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setGlobalLoading(true);
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
          setGlobalLoading(false);
        });
    } else {
      setLoading(false);
      setGlobalLoading(false);
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