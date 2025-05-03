// src/pages/DashboardPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { getTokenData } from '../services/jwt';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import '../styles/DashboardPage.css';
import logo from '../logo.svg';

const DashboardPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const navigate = useNavigate();
  const menu = useRef(null);
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tokenData = getTokenData();
    setTokenInfo(tokenData);
  }, []);

  const handleCreate = () => setRefresh(!refresh);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('authChange'));
    navigate('/', { replace: true });
  };

  const getInitials = () => {
    if (userEmail && userEmail !== 'Usuário') {
      return userEmail.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const userMenuItems = [
    {
      label: 'Perfil de Usuário',
      items: [
        {
          template: () => (
            <div className="p-menuitem-content user-profile-menu">
              <div className="user-profile-header">
                <Avatar 
                  label={getInitials()} 
                  size="large" 
                  shape="circle" 
                  style={{ 
                    backgroundColor: '#2b5876', 
                    color: '#ffffff',
                    width: '60px',
                    height: '60px',
                    fontSize: '1.5rem'
                  }} 
                />
                <div className="user-info">
                  <div className="user-role">USUÁRIO AUTENTICADO</div>
                  <div className="user-email">{userEmail}</div>
                  {tokenInfo && (
                    <div className="token-info">
                      {tokenInfo.exp && (
                        <div className="token-expiry">
                          Expira em: {new Date(tokenInfo.exp * 1000).toLocaleString()}
                        </div>
                      )}
                      {tokenInfo.iat && (
                        <div className="token-issued">
                          Emitido em: {new Date(tokenInfo.iat * 1000).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Divider className="user-divider" />
              <div className="user-menu-actions">
                <Button 
                  label="Sair" 
                  icon="pi pi-sign-out" 
                  severity="danger" 
                  text={false}
                  onClick={handleLogout} 
                  className="user-logout-button" 
                />
              </div>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>
        <div className="header-info">
          <div className="time-display">{currentTime}</div>
        </div>
        <div className="header-buttons">
          <Button
            className="p-button-rounded user-button"
            aria-controls="user-menu"
            aria-haspopup
            onClick={(e) => menu.current.toggle(e)}
          >
            <Avatar 
              label={getInitials()} 
              size="normal" 
              shape="circle" 
              style={{ backgroundColor: '#2b5876', color: '#ffffff' }} 
              className="user-avatar"
            />
          </Button>
          <Menu
            model={userMenuItems}
            popup
            ref={menu}
            id="user-menu"
            className="user-menu"
            appendTo={document.body}
          />
        </div>
      </div>
      
      <div className="dashboard-welcome">
        <h1>Bem-vindo ao Painel de Controle</h1>
        <p>Gerencie seus produtos de forma simples e eficiente</p>
      </div>
      
      <div className="dashboard-content">
        <div className="list-section">
          <ProductList key={refresh} />
        </div>
        <div className="form-section">
          <ProductForm onCreate={handleCreate} />
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>© 2025 SoulTech - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default DashboardPage;
