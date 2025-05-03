import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.soultech.solutions',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para requisições
api.interceptors.request.use(config => {
    if (config.url === '/auth/login') {
        return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para respostas
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('authChange'));
        }
        return Promise.reject(error);
    }
);

export default api;