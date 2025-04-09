import { useState, useEffect } from 'react';

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

    return {
        isAuthenticated,
        // Можно добавить другие методы аутентификации здесь
    };
} 