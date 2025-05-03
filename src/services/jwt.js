// src/services/jwt.js

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

export const getTokenData = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  return decodeJWT(token);
};