// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { PrimeReactProvider } from 'primereact/api';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import { setToastRef } from './services/toast';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    if (toast.current) {
      setToastRef(toast.current);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <PrimeReactProvider>
      <Router>
        <Toast ref={toast} position="top-right" style={{ zIndex: 999999 }} className="custom-toast" />
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
};

export default App;
