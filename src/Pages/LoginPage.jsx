// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page">
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
