import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerifyEmailForm.module.css';

const VerifyEmailForm = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabledTime, setResendDisabledTime] = useState(60);
    const inputsRef = useRef([]);
    const timerRef = useRef(null);
    const email = localStorage.getItem('pendingEmail');
    const password = localStorage.getItem('pendingPassword');

    useEffect(() => {
        if (!email || !password) {
            console.log('No email or password found, redirecting to auth');
            navigate('/auth');
        }
    }, [email, password, navigate]);

    useEffect(() => {
        if (resendDisabledTime > 0) {
            timerRef.current = setInterval(() => {
                setResendDisabledTime(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [resendDisabledTime]);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
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
        console.log('Starting verification process...');

        try {
            console.log('Sending verification request...');
            const verifyResponse = await fetch('http://localhost:8080/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code: verificationCode })
            });

            const verifyData = await verifyResponse.json();
            console.log('Verification response:', verifyData);

            if (verifyResponse.ok) {
                console.log('Verification successful, attempting login...');
                const loginResponse = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password
                    })
                });

                const loginData = await loginResponse.json();
                console.log('Login response:', loginData);

                if (!loginResponse.ok) {
                    throw new Error(loginData.message || 'Ошибка при автоматическом входе');
                }

                const token = loginData.token || loginData.jwtToken;
                if (!token) {
                    throw new Error('Токен не получен при входе');
                }

                console.log('Login successful, storing token...');
                localStorage.setItem('jwt', token);
                localStorage.removeItem('pendingEmail');
                localStorage.removeItem('pendingPassword');
                
                window.dispatchEvent(new Event('auth-change'));
                console.log('Redirecting to dashboard...');
                navigate('/dashboard');
            } else {
                throw new Error(verifyData.message || 'Неверный код подтверждения');
            }
        } catch (error) {
            console.error('Error during verification/login:', error);
            setError(error.message || 'Ошибка при подтверждении кода');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendDisabledTime > 0) return;

        setResendDisabledTime(60);
        setError('');
        console.log('Resending verification code...');

        try {
            const response = await fetch(
                `http://localhost:8080/auth/resend-verification?email=${encodeURIComponent(email)}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*'
                    }
                }
            );

            const data = await response.json();
            console.log('Resend response:', data);

            if (response.ok) {
                setSuccess(data.message || 'Новый код подтверждения отправлен на ваш email');
                setCode(Array(6).fill(''));
            } else {
                throw new Error(data.message || 'Ошибка при отправке кода');
            }
        } catch (error) {
            console.error('Error resending code:', error);
            setError(error.message || 'Ошибка при отправке кода');
        }
    };

    const handleCancel = () => {
        console.log('Cancelling verification...');
        localStorage.removeItem('pendingEmail');
        localStorage.removeItem('pendingPassword');
        navigate('/auth');
    };

    if (!email || !password) {
        console.log('No email or password, showing loading...');
        return <div className={styles.verificationContainer}>Загрузка...</div>;
    }

    return (
        <div className={styles.verificationContainer}>
            <div className={styles.logo}>
                <h1>RealEstate PRO</h1>
            </div>

            <h2 className={styles.verificationTitle}>Подтверждение email</h2>
            <p className={styles.verificationMessage}>
                {`На ${email} отправлен 6-значный код подтверждения. Проверьте вашу почту, включая папку "Спам".`}
            </p>

            <div className={styles.verificationCode}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputsRef.current[index] = el}
                        type="text"
                        maxLength={1}
                        pattern="[0-9]"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className={`${styles.verificationInput} ${error ? styles.error : ''} ${success ? styles.success : ''}`}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                ))}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <div className={styles.verificationActions}>
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleVerify}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className={styles.loading} />
                    ) : (
                        'Подтвердить'
                    )}
                </button>
                <button
                    className={`${styles.btn} ${styles.btnOutline}`}
                    onClick={handleCancel}
                >
                    Отмена
                </button>
            </div>

            <div className={styles.resendLink}>
                <button
                    onClick={handleResendCode}
                    disabled={resendDisabledTime > 0}
                    className={resendDisabledTime > 0 ? styles.disabled : ''}
                >
                    {resendDisabledTime > 0
                        ? `Отправить повторно (${resendDisabledTime})`
                        : 'Отправить код повторно'}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailForm; 