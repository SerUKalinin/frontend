import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import ResetPasswordForm from '../components/ResetPassword/ResetPasswordForm';
// Стили можно импортировать здесь или использовать глобальные из Auth.css
// import '../styles/Auth.css';

function ResetPasswordPage() {
    const { token } = useParams(); // Получаем токен из URL
    const navigate = useNavigate();

    // Обработчик успешного сброса пароля
    const handleResetSuccess = () => {
        // Показываем сообщение об успехе на короткое время (хук уже устанавливает success)
        // Через 2 секунды перенаправляем на страницу входа
        setTimeout(() => {
            navigate('/auth'); // Или ваш путь к странице входа
        }, 2000);
    };

    // Вызываем хук формы
    const resetPasswordHook = useResetPasswordForm({
        token,
        onResetSuccess: handleResetSuccess,
    });

    // Если токен не валиден или отсутствует, можно показать сообщение или редиректить
    // Хук сам устанавливает ошибку, если токена нет при отправке формы
    // Можно добавить проверку токена при загрузке страницы, если необходимо
    useEffect(() => {
        if (!token) {
             // Можно установить специфическую ошибку через setError, если хук его возвращает
             // resetPasswordHook.setError('Отсутствует токен сброса пароля.');
            console.error('Отсутствует токен сброса пароля в URL.');
            // Возможно, стоит перенаправить на страницу ошибки или входа
             // navigate('/auth?error=invalid_token');
        }
    }, [token, navigate]); // Добавляем navigate в зависимости

    return (
        <div className="auth-container"> {/* Общий контейнер как на других страницах */} 
            <div className="logo">
                <h1>RealEstate PRO</h1>
                <p>Система управления недвижимостью</p>
            </div>
            <div className="form-container">
                 {/* Передаем весь объект хука в форму */} 
                <ResetPasswordForm hook={resetPasswordHook} />
            </div>
        </div>
    );
}

export default ResetPasswordPage; 