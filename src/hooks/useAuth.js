import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const validateToken = (token) => {
        if (!token) {
            console.log('Токен отсутствует в localStorage');
            return false;
        }
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const isValid = decoded.exp > currentTime;
            console.log('Проверка токена:', isValid ? 'токен валиден' : 'токен истек');
            return isValid;
        } catch (error) {
            console.error('Ошибка при проверке токена:', error);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        setError(null);
        const token = localStorage.getItem('jwt');
        console.log('Текущий токен в localStorage:', token ? 'присутствует' : 'отсутствует');
        
        if (!token || !validateToken(token)) {
            console.log('Удаление невалидного токена из localStorage');
            setIsAuthenticated(false);
            localStorage.removeItem('jwt');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Отправка запроса на валидацию токена');
            const response = await axios.get('http://localhost:8080/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 5000 // 5 секунд таймаут
            });
            console.log('Токен успешно валидирован на сервере');
            setIsAuthenticated(true);
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                console.log('Сервер недоступен. Проверьте подключение к серверу.');
                setError('Сервер недоступен. Пожалуйста, проверьте подключение.');
            } else {
                console.error('Ошибка при проверке авторизации:', error);
                setError('Ошибка при проверке авторизации');
            }
            console.log('Удаление токена из-за ошибки валидации');
            setIsAuthenticated(false);
            localStorage.removeItem('jwt');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        
        const interval = setInterval(checkAuthStatus, 5 * 60 * 1000); // Проверка каждые 5 минут

        const handleStorageChange = (e) => {
            if (e.key === 'jwt') {
                checkAuthStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', checkAuthStatus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', checkAuthStatus);
        };
    }, []);

    const logout = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (token) {
                await axios.post('http://localhost:8080/auth/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem('jwt');
            setIsAuthenticated(false);
            window.dispatchEvent(new Event('auth-change'));
            window.location.href = '/auth';
        }
    };

    return {
        isAuthenticated,
        isLoading,
        error,
        logout
    };
} 