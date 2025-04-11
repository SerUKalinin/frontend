import React, { useEffect } from 'react';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm'; // Путь к хуку

// Компонент принимает onShowLogin
function ForgotPasswordForm({ onShowLogin }) {
    // Используем кастомный хук
    const {
        email,
        setEmail,
        error,
        setError, // Получаем сеттер ошибки
        success,
        setSuccess, // Получаем сеттер успеха
        isLoading,
        handleSubmit,
    } = useForgotPasswordForm({
        // При успешном запросе хук вызовет этот колбэк
        onRequestSuccess: () => {
            // Через 3 секунды после успеха переключаемся на вход
            // и сбрасываем сообщение об успехе
            setTimeout(() => {
                setSuccess(''); // Сбрасываем сообщение
                onShowLogin();  // Переключаем вкладку
            }, 3000);
        }
    });

    // Эффект для автоматического скрытия ошибки через 10 секунд
    useEffect(() => {
        if (error) {
            const timerId = setTimeout(() => {
                setError(''); // Сбрасываем ошибку
            }, 10000);
            return () => clearTimeout(timerId); // Очистка таймера при размонтировании или изменении ошибки
        }
    }, [error, setError]);


    return (
        <form onSubmit={handleSubmit} style={{ display: 'block' }}>
            <h2 className="form-title">Восстановление пароля</h2>
            {/* Отображаем сообщения из хука */}
            {error && <div className="message error-message">{error}</div>}
            <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email</label>
                <input
                    type="email"
                    className="form-input"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className={`btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    <span>Сбросить пароль</span>
                    {isLoading && <div className="loading-spinner"></div>}
                </button>
            </div>
            <div className="form-footer">
                {/* Обработчик onShowLogin для кнопки "Вернуться к входу" */}
                <a href="#" onClick={(e) => { e.preventDefault(); setSuccess(''); setError(''); onShowLogin(); }}>Вернуться к входу</a>
            </div>
            {success && <div className="message success-message">{success}</div>}
        </form>
    );
}

export default ForgotPasswordForm; 