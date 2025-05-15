import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyEmailForm.css';

const VerifyEmailForm = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabledTime, setResendDisabledTime] = useState(0);
    const inputsRef = useRef([]);

    const email = localStorage.getItem('pendingEmail') || '';
    const password = localStorage.getItem('pendingPassword') || '';

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.match(/\d/g);
        
        if (numbers && numbers.length) {
            const newCode = [...code];
            for (let i = 0; i < Math.min(numbers.length, 6); i++) {
                newCode[i] = numbers[i];
            }
            setCode(newCode);
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            setError('Пожалуйста, введите полный 6-значный код');
            return;
        }

        setIsLoading(true);
        setError('');

        // Моковая логика верификации
        setTimeout(() => {
            if (verificationCode === '123456') {
                localStorage.setItem('jwt', 'mock-jwt-token');
                localStorage.removeItem('pendingEmail');
                localStorage.removeItem('pendingPassword');
                window.dispatchEvent(new Event('auth-change'));
                navigate('/dashboard');
            } else {
                setError('Неверный код подтверждения');
                setCode(Array(6).fill(''));
                inputsRef.current[0]?.focus();
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleResendCode = async () => {
        if (resendDisabledTime > 0) return;

        setResendDisabledTime(60);
        setError('');
        
        // Моковая логика повторной отправки кода
        setTimeout(() => {
            setSuccess('Новый код подтверждения отправлен на ваш email');
            setCode(Array(6).fill(''));
            inputsRef.current[0]?.focus();
        }, 1000);
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-form">
                <h2>Подтверждение email</h2>
                <p className="email-info">
                    Код подтверждения отправлен на {email}
                </p>
                
                <div className="code-inputs">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            ref={el => inputsRef.current[index] = el}
                            disabled={isLoading}
                        />
                    ))}
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button 
                    className="verify-button" 
                    onClick={handleVerify}
                    disabled={isLoading}
                >
                    {isLoading ? 'Проверка...' : 'Подтвердить'}
                </button>

                <button 
                    className="resend-button"
                    onClick={handleResendCode}
                    disabled={resendDisabledTime > 0 || isLoading}
                >
                    {resendDisabledTime > 0 
                        ? `Отправить повторно через ${resendDisabledTime}с` 
                        : 'Отправить код повторно'}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailForm; 