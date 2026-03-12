import { useState, useEffect } from 'react';

interface UseAuthReturn {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    return authStatus;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}