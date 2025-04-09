import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Кастомный хук для управления состоянием и логикой формы входа.
 * @returns {object} - Объект с состоянием и функциями для управления формой.
 */
export function useLoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard"; // Путь для редиректа после логина

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Сброс ошибки перед новым запросом
        setIsLoading(true);

        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                // Попытка получить сообщение об ошибке из JSON
                return response.json().then(err => {
                    throw new Error(err.message || 'Ошибка входа: проверьте логин и пароль.');
                }).catch(() => {
                    // Если JSON парсинг не удался, или нет поля message
                    throw new Error('Ошибка входа: проверьте логин и пароль.');
                });
            }
            return response.json();
        })
        .then(data => {
            const token = data.token || data.jwtToken;
            if (!token) {
                throw new Error('Токен не получен от сервера.');
            }
            localStorage.setItem('jwt', token);
            console.log('Токен сохранен:', token);
            
            // Диспатчим событие для обновления состояния аутентификации
            window.dispatchEvent(new Event('auth-change'));
            
            // Переходим на dashboard или откуда пришли
            navigate(from, { replace: true }); // Переходим на dashboard или откуда пришли
        })
        .catch(err => {
            setError(err.message);
            console.error('Ошибка входа:', err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit,
    };
} 