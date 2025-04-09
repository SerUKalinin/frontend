import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!token) {
            navigate('/auth');
        }
    }, [token, navigate]);

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

            const data = await response.json();
            
            localStorage.setItem('jwt', data.token);
            
            setSuccess('Пароль успешно изменен');
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 2000);
        } catch (error) {
            setError(error.message || 'Ошибка при сбросе пароля');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo">
                <h1>RealEstate PRO</h1>
                <p>Система управления недвижимостью</p>
            </div>

            <div className="form-container">
                <h2 className="form-title">Сброс пароля</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Новый пароль</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Подтверждение пароля</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="password-requirements">
                        <div className={`requirement ${requirements.length ? 'valid' : 'invalid'}`}>
                            <i className={`fas ${requirements.length ? 'fa-check-circle' : 'fa-circle'}`} />
                            <span>Минимум 8 символов</span>
                        </div>
                        <div className={`requirement ${requirements.uppercase ? 'valid' : 'invalid'}`}>
                            <i className={`fas ${requirements.uppercase ? 'fa-check-circle' : 'fa-circle'}`} />
                            <span>Минимум 1 заглавная буква</span>
                        </div>
                        <div className={`requirement ${requirements.lowercase ? 'valid' : 'invalid'}`}>
                            <i className={`fas ${requirements.lowercase ? 'fa-check-circle' : 'fa-circle'}`} />
                            <span>Минимум 1 строчная буква</span>
                        </div>
                        <div className={`requirement ${requirements.number ? 'valid' : 'invalid'}`}>
                            <i className={`fas ${requirements.number ? 'fa-check-circle' : 'fa-circle'}`} />
                            <span>Минимум 1 цифра</span>
                        </div>
                        <div className={`requirement ${requirements.special ? 'valid' : 'invalid'}`}>
                            <i className={`fas ${requirements.special ? 'fa-check-circle' : 'fa-circle'}`} />
                            <span>Минимум 1 специальный символ (!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;?)</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сброс пароля...' : 'Сбросить пароль'}
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;