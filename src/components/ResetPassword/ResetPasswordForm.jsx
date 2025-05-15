import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const checkPasswordRequirements = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=[\]{}|;:,.&lt;&gt;?]/.test(password)
        };
        setRequirements(checks);
        return Object.values(checks).every(check => check);
    };

    const checkPasswordsMatch = () => {
        return newPassword === confirmPassword && newPassword.length > 0;
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        checkPasswordRequirements(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkPasswordsMatch()) {
            setError('Пароли не совпадают');
            return;
        }

        if (!Object.values(requirements).every(req => req)) {
            setError('Пароль не соответствует требованиям');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true);

        // Моковая логика сброса пароля
        setTimeout(() => {
            localStorage.setItem('jwt', 'mock-jwt-token');
            setSuccess('Пароль успешно изменен');
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 2000);
            setIsLoading(false);
        }, 1000);
    };

    const isFormValid = () => {
        return checkPasswordsMatch() && Object.values(requirements).every(req => req);
    };

    return (
        <div className="auth-container">
            <div className="logo">
                <h1>RealEstate PRO</h1>
                <p>Система управления недвижимостью</p>
            </div>

            <div className="reset-password-form">
                <h2>Сброс пароля</h2>
                <p className="form-description">
                    Введите новый пароль для вашей учетной записи
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Новый пароль</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="form-input"
                                placeholder="Введите новый пароль"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Скрыть" : "Показать"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                                placeholder="Повторите новый пароль"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Скрыть" : "Показать"}
                            </button>
                        </div>
                    </div>

                    <div className="password-requirements">
                        <h3>Требования к паролю:</h3>
                        <ul>
                            <li className={requirements.length ? "met" : ""}>
                                Минимум 8 символов
                            </li>
                            <li className={requirements.uppercase ? "met" : ""}>
                                Минимум одна заглавная буква
                            </li>
                            <li className={requirements.lowercase ? "met" : ""}>
                                Минимум одна строчная буква
                            </li>
                            <li className={requirements.number ? "met" : ""}>
                                Минимум одна цифра
                            </li>
                            <li className={requirements.special ? "met" : ""}>
                                Минимум один специальный символ
                            </li>
                        </ul>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!isFormValid() || isLoading}
                    >
                        {isLoading ? "Изменение пароля..." : "Изменить пароль"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;