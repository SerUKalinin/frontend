import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useVerifyEmailForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendDisabledTime, setResendDisabledTime] = useState(0);
    const inputsRef = useRef([]);
    const timerRef = useRef(null);
    const email = location.state?.email;

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startResendTimer = () => {
        setResendDisabledTime(60);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setResendDisabledTime(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = async () => {
        if (resendDisabledTime > 0 || isResending) return;

        setIsResending(true);
        setError('');
        startResendTimer();

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

            const responseText = await response.text();
            let responseData;

            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                throw new Error(responseData.message || 'Ошибка при отправке кода');
            }

            setSuccess(responseData.message || 'Новый код подтверждения отправлен на ваш email');
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Ошибка при отправке кода');
        } finally {
            setIsResending(false);
        }
    };

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Автоматический переход к следующему полю
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

    const handleVerify = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        
        if (verificationCode.length !== 6) {
            setError('Пожалуйста, введите полный код подтверждения');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code: verificationCode })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при подтверждении email');
            }

            setSuccess('Email успешно подтвержден');
            setTimeout(() => {
                navigate('/auth');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Ошибка при подтверждении email');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        code,
        error,
        success,
        isLoading,
        isResending,
        resendDisabledTime,
        inputsRef,
        handleInputChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResendCode
    };
} 