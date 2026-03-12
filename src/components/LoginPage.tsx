import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Login } from './Login';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const handleLogin = () => {
    login();
    const from = location.state?.from?.pathname || '/documentos';
    navigate(from, { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/documentos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Login onLogin={handleLogin} />;
}