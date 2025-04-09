import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Функция для проверки требований к паролю
const checkPasswordRequirements = (password) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    };

    // Проверяем, все ли требования выполнены
    const allRequirementsMet = Object.values(checks).every(check => check);

    return {
        checks,
        allRequirementsMet
    };
};

/**
 * Хук для управления формой сброса пароля.
 * @param {object} options
 * @param {string} options.token - Токен сброса пароля из URL.
 * @param {function} options.onResetSuccess - Колбэк при успешном сбросе.
 */
export function useResetPasswordForm() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Состояния для полей формы
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Состояния для требований к паролю
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Получаем токен из URL при загрузке
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (!tokenFromUrl) {
            navigate('/auth', { replace: true });
            return;
        }
        setToken(tokenFromUrl);
    }, [location, navigate]);

    // Проверяем требования при изменении пароля
    useEffect(() => {
        const { checks } = checkPasswordRequirements(newPassword);
        setRequirements(checks);
    }, [newPassword]);

    // Функция для проверки совпадения паролей
    const passwordsMatch = () => {
        return newPassword === confirmPassword && newPassword.length > 0;
    };

    // Функция для отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!passwordsMatch()) {
            setError('Пароли не совпадают');
            return;
        }

        const { allRequirementsMet } = checkPasswordRequirements(newPassword);
        if (!allRequirementsMet) {
            setError('Пароль не соответствует требованиям');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Ошибка при сбросе пароля');
            }

            setSuccess('Пароль успешно изменен');
            
            // Перенаправляем на страницу входа через 2 секунды
            setTimeout(() => {
                navigate('/auth', { replace: true });
            }, 2000);
        } catch (error) {
            console.error('Ошибка:', error);
            setError(error.message || 'Ошибка при сбросе пароля');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        isLoading,
        requirements,
        handleSubmit
    };
} 