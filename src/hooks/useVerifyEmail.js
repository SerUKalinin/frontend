// Хук useVerifyEmail.js (Новый хук для VerifyEmailForm)
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CODE_LENGTH = 6;

export function useVerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    // Получаем email из состояния роутера или возвращаемся на /auth
    const email = location.state?.email;

    const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendDisabledTime, setResendDisabledTime] = useState(0);
    const inputsRef = useRef([]);

    // Редирект, если email не передан
    useEffect(() => {
        if (!email) {
            console.error('Email для верификации не найден. Перенаправление на /auth.');
            navigate('/auth', { replace: true });
        }
    }, [email, navigate]);

    // --- Логика таймера повторной отправки (без изменений) ---
    useEffect(() => {
        if (resendDisabledTime <= 0) {
            setIsResending(false);
            if (resendDisabledTime === 0) setResendDisabledTime(-1);
            return;
        }
        const timerId = setTimeout(() => setResendDisabledTime(t => t - 1), 1000);
        return () => clearTimeout(timerId);
    }, [resendDisabledTime]);

    // --- Обработчики ввода, keyDown, paste ---
    const handleInputChange = (e, index) => {
        const value = e.target.value;
        // Разрешаем только одну цифру
        if (/^[0-9]$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            // Переход к следующему полю
            if (index < CODE_LENGTH - 1) {
                inputsRef.current[index + 1]?.focus();
            } else {
                // Если это последнее поле, проверяем код автоматически
                const fullCode = newCode.join('');
                if (fullCode.length === CODE_LENGTH) {
                    handleVerify(fullCode); // Вызываем проверку с полным кодом
                }
            }
        } else if (value === '') {
             // Если поле очищено (например, через Backspace в handleKeyDown, но может быть и вручную)
             const newCode = [...code];
             newCode[index] = '';
             setCode(newCode);
             // Фокус не меняем при простом удалении, это делается в handleKeyDown
        }
        // Игнорируем другие символы
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            // Не предотвращаем стандартное поведение, чтобы символ удалился
            // Но если поле УЖЕ пустое, переходим назад и чистим предыдущее
            if (code[index] === '') {
                 e.preventDefault(); // Предотвращаем стандартное поведение Backspace (переход на пред. страницу)
                if (index > 0) {
                    const newCode = [...code];
                    newCode[index - 1] = ''; // Чистим предыдущее поле
                    setCode(newCode);
                    inputsRef.current[index - 1]?.focus();
                }
            } else {
                 // Если поле не пустое, просто чистим его (стандартное поведение + setState)
                 const newCode = [...code];
                 newCode[index] = '';
                 setCode(newCode);
                 // Фокус остается здесь
            }
        } else if (e.key === 'Delete') {
             // По аналогии с Backspace, но без перехода назад
             e.preventDefault();
             const newCode = [...code];
             newCode[index] = '';
             setCode(newCode);
             inputsRef.current[index]?.focus(); // Фокус остается
        } else if (e.key === 'ArrowLeft') {
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowRight') {
            if (index < CODE_LENGTH - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        }
        // Остальные клавиши (цифры) обрабатываются в handleInputChange
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, ''); // Убираем все нецифровые символы
        if (pastedData.length === CODE_LENGTH) {
            const newCode = pastedData.split('');
            setCode(newCode);
            inputsRef.current[CODE_LENGTH - 1]?.focus(); // Фокус на последнее поле
            handleVerify(pastedData); // Сразу проверяем
        } else if (pastedData.length > 0) {
             // Если вставили неполный код, заполняем сколько можем
             const newCode = [...code];
             for (let i = 0; i < Math.min(pastedData.length, CODE_LENGTH); i++) {
                 // Начинаем вставлять с текущего активного поля или с первого
                 const targetInput = document.activeElement;
                 let startIndex = inputsRef.current.findIndex(input => input === targetInput);
                 if (startIndex === -1) startIndex = 0; // Если фокуса нет, начнем с 0

                 const pasteIndex = startIndex + i;
                 if (pasteIndex < CODE_LENGTH) {
                    newCode[pasteIndex] = pastedData[i];
                 } else {
                     break; // Вышли за пределы полей
                 }
             }
             setCode(newCode);
             // Устанавливаем фокус на последнее заполненное поле или следующее
             const lastFilledIndex = Math.min(startIndex + pastedData.length -1, CODE_LENGTH - 1);
             const focusIndex = Math.min(lastFilledIndex + 1, CODE_LENGTH - 1);
             inputsRef.current[focusIndex]?.focus();
        }
    };

    // --- Отправка кода на проверку ---
    // Принимает код как аргумент для случая авто-отправки
    const handleVerify = (codeToVerify = null) => {
        const verificationCode = codeToVerify || code.join(''); // Используем переданный код или из state
        if (verificationCode.length !== CODE_LENGTH) {
            setError('Пожалуйста, введите полный 6-значный код');
            return;
        }
        setError('');
        setSuccess('');
        setIsLoading(true);

        fetch("http://localhost:8080/auth/verify-email", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code: verificationCode }) // Отправляем email и код
        })
        .then(async response => {
            const data = await response.json().catch(() => ({})); // Попробуем парсить JSON в любом случае
            if (!response.ok) {
                 throw new Error(data.message || `Ошибка ${response.status}`);
            }
            return data;
        })
        .then(data => {
            const token = data.token || data.jwtToken || data.accessToken;
            if (token) {
                localStorage.setItem('jwt', token);
                setSuccess('Email подтвержден! Выполняется вход...');
                setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
            } else {
                // Даже если нет токена, но сервер ответил 200 OK, возможно, просто подтверждение без авто-входа
                setSuccess('Email успешно подтвержден. Теперь вы можете войти.');
                setError(''); // Убираем предыдущие ошибки
                // Можно перенаправить на логин или оставить на этой странице
                 setTimeout(() => navigate('/auth', { replace: true }), 3000);
            }
        })
        .catch(err => {
            setError(err.message || 'Неверный код подтверждения или другая ошибка');
            setCode(Array(CODE_LENGTH).fill('')); // Очищаем поля при ошибке
            inputsRef.current[0]?.focus(); // Фокус на первое поле
            console.error('Ошибка верификации:', err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // --- Повторная отправка кода (без изменений) ---
    const handleResendCode = () => { /*...*/ };

    return {
        email, // Возвращаем email для отображения
        code,
        setCode,
        error,
        setError,
        success,
        setSuccess,
        isLoading,
        isResending,
        resendDisabledTime,
        inputsRef, // Передаем реф для привязки
        handleInputChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResendCode,
        handleCancel: () => navigate('/auth', { replace: true }) // Функция для кнопки "Отмена"
    };
} 