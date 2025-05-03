// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { toast } from '../services/toast';
import api from '../services/api';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validação de email
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Email inválido';
    } else if (email.length > 28) {
      newErrors.email = 'Email deve ter no máximo 28 caracteres';
    }

    // Validação de senha
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    } else if (password.length > 20) {
      newErrors.password = 'Senha deve ter no máximo 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Se houver erros de validação, mostra o primeiro erro encontrado
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (loginResponse.data) {
        const responseData = loginResponse.data;
        const token = responseData.access_token || 
                     responseData.token || 
                     responseData.data?.token || 
                     responseData.data?.access_token;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userEmail', email);
          toast.success('Login realizado com sucesso!');
          setTimeout(() => {
            onLogin(token);
          }, 500);
        } else {
          toast.error('Token não encontrado na resposta');
        }
      } else {
        toast.error('Resposta do servidor inválida');
      }
    } catch (err) {
      let errorMessage = 'Erro no login';
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Email ou senha incorretos';
            break;
          case 422:
            errorMessage = 'Dados inválidos';
            break;
          case 429:
            errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = err.response.data?.message || 'Erro no login';
        }
      } else if (err.request) {
        errorMessage = 'Erro de conexão com o servidor';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="login-icon-container">
          <i className="pi pi-user"></i>
        </div>
        <div className="p-field p-mb-3 input-container">
          <i className="pi pi-envelope input-icon" />
          <div className="p-input-wrapper">
            <InputText 
              id="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({...errors, email: null});
              }} 
              disabled={loading}
              className={`p-d-block login-input ${errors.email ? 'p-invalid' : ''}`}
              style={{ color: 'white' }}
              required 
              placeholder="Digite seu email aqui"
              maxLength={28}
              type="email"
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>
        </div>
        <div className="p-field p-mb-3 input-container">
          <i className="pi pi-lock input-icon" />
          <div className="p-input-wrapper">
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => {
                const value = e.target.value;
                
                if (value.length <= 20) {
                  setPassword(value);
                  setErrors({...errors, password: null});
                }
              }} 
              feedback={false} 
              disabled={loading}
              toggleMask
              className={`p-d-block ${errors.password ? 'p-invalid' : ''}`}
              inputClassName="login-input"
              placeholder="Digite sua senha aqui"
              required 
              maxLength={20}
            />
            {errors.password && <small className="p-error">{errors.password}</small>}
          </div>
        </div>
        <Button 
          label="Entrar" 
          icon="pi pi-sign-in" 
          className="login-button" 
          loading={loading}
          type="submit"
        />
      </form>
    </div>
  );
};

export default LoginForm;
