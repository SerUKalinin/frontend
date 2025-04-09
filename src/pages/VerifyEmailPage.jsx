import React from 'react';
import { useLocation } from 'react-router-dom';
import VerifyEmailForm from '../components/VerifyEmail/VerifyEmailForm';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

function VerifyEmailPage() {
    const verifyEmailHook = useVerifyEmail();

    return (
        <div className="auth-container"> {/* Общий контейнер */} 
            <div className="logo">
                 {/* Логотип можно вынести в отдельный компонент */} 
                <h1>RealEstate PRO</h1>
            </div>
            <VerifyEmailForm hook={verifyEmailHook} />
        </div>
    );
}

export default VerifyEmailPage; 