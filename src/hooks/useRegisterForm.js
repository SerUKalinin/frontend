import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Кастомный хук для управления состоянием и логикой формы регистрации.
 * @returns {object} - Объект с состоянием и функциями для управления формой.
 */
export function useRegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }

        fetch("http://localhost:8080/auth/register-user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Ошибка регистрации. Возможно, такой пользователь уже существует.');
                }).catch(() => {
                    throw new Error('Ошибка регистрации. Возможно, такой пользователь уже существует.');
                });
            }
            return true;
        })
        .then(success => {
            if (success) {
                localStorage.setItem('pendingEmail', email);
                localStorage.setItem('pendingPassword', password);
                navigate('/verify-email');
            }
        })
        .catch(err => {
            setError(err.message);
            console.error('Ошибка регистрации:', err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Можно добавить общую функцию для обновления полей, если полей много
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        isLoading,
        handleSubmit,
        // handleInputChange // Если решите использовать общую функцию
    };
}
