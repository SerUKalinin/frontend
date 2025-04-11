import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Инициализируем состояние при создании хука
        return !!localStorage.getItem('jwt');
    });

    useEffect(() => {
        // Проверяем наличие токена при монтировании компонента
        const checkAuth = () => {
            const token = localStorage.getItem('jwt');
            setIsAuthenticated(!!token);
        };

        // Вызываем проверку сразу
        checkAuth();

        // Слушаем изменения в localStorage
        const handleStorageChange = (e) => {
            if (e.key === 'jwt') {
                setIsAuthenticated(!!e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Создаем свой event для обновления состояния в текущем окне
        const handleCustomStorage = () => checkAuth();
        window.addEventListener('auth-change', handleCustomStorage);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleCustomStorage);
        };
    }, []);

    const logout = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.error('Токен не найден');
                window.location.href = '/login';
                return;
            }

            const response = await axios.post('http://localhost:8080/auth/logout', 
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                localStorage.removeItem('jwt');
                setIsAuthenticated(false);
                window.dispatchEvent(new Event('auth-change'));
                window.location.href = '/login';
            } else {
                throw new Error('Неожиданный ответ от сервера');
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            if (error.response) {
                console.error('Ответ сервера:', error.response.data);
                console.error('Статус:', error.response.status);
            }
            // В любом случае удаляем токен и перенаправляем
            localStorage.removeItem('jwt');
            setIsAuthenticated(false);
            window.location.href = '/login';
        }
    };

    return {
        isAuthenticated,
        logout
    };
} 