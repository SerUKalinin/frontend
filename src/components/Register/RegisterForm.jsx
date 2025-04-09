import React, { useState } from 'react';
import { useRegisterForm } from '../../hooks/useRegisterForm'; // Путь к хуку
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Импортируем иконки
import '../common/InputField/InputField.css';

// Компонент принимает onShowLogin
function RegisterForm({ onShowLogin }) {
    // Используем кастомный хук
    const {
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
    } = useRegisterForm(); // Убираем передачу колбэка

    // Состояния для видимости паролей
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="form-title">Регистрация</h2>
            {/* Отображаем ошибку из хука */}
            {error && <div className="error-message">{error}</div>}

            <div className="input-container">
                <label className="form-label" htmlFor="register-username">
                    Логин
                </label>
                <input
                    type="text"
                    className="form-input"
                    id="register-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="input-container">
                <label className="form-label" htmlFor="register-email">
                    Email
                </label>
                <input
                    type="email"
                    className="form-input"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="input-container">
                <label className="form-label" htmlFor="register-password">
                    Пароль
                </label>
                <div className="input-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle-btn"
                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>
            </div>

            <div className="input-container">
                <label className="form-label" htmlFor="register-confirm-password">
                    Подтвердите пароль
                </label>
                <div className="input-wrapper">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input"
                        id="register-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle-btn"
                        aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>
            </div>

            <button 
                type="submit"
                className="submit-button"
                disabled={isLoading}
            >
                <span>Зарегистрироваться</span>
                {isLoading && <div className="loading-spinner"></div>}
            </button>

            <div className="forgot-password">
                {/* Обработчик onShowLogin передается извне */}
                <a href="#" onClick={(e) => { e.preventDefault(); onShowLogin(); }}>
                    Уже есть аккаунт? Войти
                </a>
            </div>
        </form>
    );
}

export default RegisterForm; 