import { useState } from 'react';

/**
 * Кастомный хук для управления состоянием и логикой формы запроса сброса пароля.
 * @returns {object} - Объект с состоянием и функциями для управления формой.
 */
export function useForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        fetch("http://localhost:8080/auth/forgot-password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                // Попытка получить текст ошибки
                return response.text().then(text => {
                    // Проверяем на конкретное сообщение об ошибке
                    if (text && text.toLowerCase().includes('не найден')) {
                        throw new Error('Пользователя с указанной почтой не существует.');
                    } else {
                        throw new Error(text || 'Ошибка при отправке ссылки для сброса пароля.');
                    }
                }).catch(err => {
                     // Если text() не удался или другая ошибка
                    throw err instanceof Error ? err : new Error('Ошибка при отправке ссылки для сброса пароля.');
                });
            }
            // Успешный ответ может быть пустым или содержать сообщение, которое нам здесь не важно
            return true;
        })
        .then(() => {
            setSuccess('Письмо для сброса пароля успешно отправлено на ваш email.');
            setEmail(''); // Очищаем поле
        })
        .catch(err => {
            setError(err.message);
            console.error('Ошибка восстановления пароля:', err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return {
        email,
        setEmail,
        error,
        setError,
        success,
        setSuccess,
        isLoading,
        handleSubmit,
    };
} 