import React, { useState } from 'react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../common/InputField/InputField.css';

// Компонент LoginForm теперь принимает только onForgotPassword
function LoginForm({ onForgotPassword }) {
    // Используем кастомный хук
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit,
    } = useLoginForm();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="form-title">Вход в систему</h2>
            {/* Отображаем ошибку из хука */}
            {error && <div className="message error-message">{error}</div>}
            
            <div className="input-container">
                <label className="form-label" htmlFor="login-username">
                    Логин или Email
                </label>
                <input
                    type="text"
                    className="form-input"
                    id="login-username"
                    value={username} // Значение из хука
                    onChange={(e) => setUsername(e.target.value)} // Функция обновления из хука
                    required
                    disabled={isLoading} // Состояние загрузки из хука
                />
            </div>

            <div className="input-container">
                <label className="form-label" htmlFor="login-password">
                    Пароль
                </label>
                <div className="input-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'} // Меняем тип поля
                        className="form-input"
                        id="login-password"
                        value={password} // Значение из хука
                        onChange={(e) => setPassword(e.target.value)} // Функция обновления из хука
                        required
                        disabled={isLoading} // Состояние загрузки из хука
                    />
                    {/* Кнопка для переключения видимости */}
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility} 
                        className="password-toggle-btn"
                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {/* Используем SVG иконки */} 
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                className="submit-button" 
                disabled={isLoading}
            >
                <span>Войти</span>
                {isLoading && <div className="loading-spinner"></div>}
            </button>

            <div className="forgot-password">
                {/* Обработчик onForgotPassword передается извне */}
                <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }}>Забыли пароль?</a>
            </div>
        </form>
    );
}

export default LoginForm; 