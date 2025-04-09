import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './VerifyEmailForm.module.css'; // Импортируем модуль стилей
import { useNavigate } from 'react-router-dom';

const CODE_LENGTH = 6;

// Принимаем hook как проп
function VerifyEmailForm({ hook }) {
    const {
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
        handleResendCode,
        handleCancel // Получаем из хука
    } = hook;

    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/auth');
        }
    }, [email, navigate]);

    // Если email еще не загрузился из location.state, можем показать заглушку
    if (!email) {
        return <div className={styles.verificationContainer}>Загрузка...</div>; 
    }

    return (
        <div className="auth-container"> {/* Этот класс оставим из Auth.css */} 
            <div className={styles.verificationContainer}> {/* Используем стили из модуля */} 
                {/* УДАЛЯЕМ ЛОГОТИП */}
                {/* 
                <div className="logo"> 
                    <h1>RealEstate PRO</h1>
                </div> 
                */}

                <h2 className={styles.verificationTitle}>{/* Используем стили из модуля */}Подтверждение email</h2>
                <p className={styles.verificationMessage}>{/* Используем стили из модуля */}
                    {`На ${email} отправлен 6-значный код подтверждения. Проверьте почту (и спам).`}
                </p>

                <div className={styles.verificationCode} onPaste={handlePaste}>{/* Используем стили из модуля */}
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputsRef.current[index] = el}
                            type="text" 
                            inputMode="numeric" 
                            pattern="[0-9]*"    
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={isLoading}
                            aria-label={`Цифра ${index + 1}`}
                            // Меняем стиль на белый фон
                             style={{
                                backgroundColor: 'white', // Белый фон
                                color: 'black',           // Черный текст
                                border: '1px solid #ccc', // Светлая рамка
                                width: '40px',
                                height: '40px',
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                margin: '0 5px',
                                borderRadius: '4px'
                            }}
                        />
                    ))}
                </div>

                {/* Используем стили из модуля для сообщений */} 
                {error && <div className={`${styles.message} ${styles.errorMessage}`}>{error}</div>}
                {success && <div className={`${styles.message} ${styles.successMessage}`}>{success}</div>}

                <div className={styles.resendLink}>{/* Используем стили из модуля */}
                    <a 
                        href="#"
                        onClick={(e) => {e.preventDefault(); handleResendCode();}}
                        className={(resendDisabledTime > 0 || isResending) ? styles.disabled : ''}
                        aria-disabled={resendDisabledTime > 0 || isResending}
                    >
                        {isResending 
                            ? 'Отправка...'
                            : resendDisabledTime > 0 
                            ? `Отправить снова через ${resendDisabledTime} сек.` 
                            : 'Отправить код еще раз'}
                    </a>
                </div>

            </div>
        </div>
    );
}

VerifyEmailForm.propTypes = {
  hook: PropTypes.object.isRequired, // Ожидаем объект хука
};

export default VerifyEmailForm; 