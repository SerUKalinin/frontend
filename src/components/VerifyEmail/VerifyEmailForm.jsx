import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmailForm } from '../../hooks/useVerifyEmailForm';
import styles from './VerifyEmailForm.module.css';

const CODE_LENGTH = 6;

function VerifyEmailForm() {
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
        handleResendCode
    } = useVerifyEmailForm();

    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/auth');
        }
    }, [email, navigate]);

    if (!email) {
        return <div className={styles.verificationContainer}>Загрузка...</div>;
    }

    return (
        <div className="auth-container">
            <div className={styles.verificationContainer}>
                <h2 className={styles.verificationTitle}>Подтверждение email</h2>
                <p className={styles.verificationMessage}>
                    {`На ${email} отправлен 6-значный код подтверждения. Проверьте почту (и спам).`}
                </p>

                <form onSubmit={handleVerify}>
                    <div className={styles.verificationCode}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
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

                    <div className={styles.resendLink}>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className={`${styles.resendButton} ${(resendDisabledTime > 0 || isResending) ? styles.disabled : ''}`}
                            disabled={resendDisabledTime > 0 || isResending}
                        >
                            {isResending
                                ? 'Отправка...'
                                : resendDisabledTime > 0
                                    ? `Отправить снова через ${resendDisabledTime} сек.`
                                    : 'Отправить код еще раз'}
                        </button>
                    </div>

                    {error && <div className={`${styles.message} ${styles.errorMessage}`}>{error}</div>}
                    {success && <div className={`${styles.message} ${styles.successMessage}`}>{success}</div>}
                </form>
            </div>
        </div>
    );
}

export default VerifyEmailForm; 