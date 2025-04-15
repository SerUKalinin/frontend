import axios from 'axios';
import { API_URL } from '../config.js';

// Создаем экземпляр axios с настройками по умолчанию
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем перехватчик для добавления токена в каждый запрос
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для обработки ответов
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

const objectService = {
    // Получить все объекты
    getAllObjects: async () => {
        try {
            const response = await api.get('/real-estate-objects');
            return response.data;
        } catch (error) {
            console.error('Error fetching objects:', error);
            throw error;
        }
    },

    // Получить объект по ID
    getObjectById: async (id) => {
        try {
            const response = await api.get(`/real-estate-objects/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching object:', error);
            throw error;
        }
    },

    // Получить объекты по типу
    getObjectsByType: async (type) => {
        try {
            const response = await api.get(`/real-estate-objects/by-type?type=${type}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching objects by type:', error);
            throw error;
        }
    }
};

export default objectService; 