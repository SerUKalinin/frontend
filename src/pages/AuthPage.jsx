import React, { useState } from 'react';
import Logo from '../components/common/Logo/Logo';
import AuthTabs from '../components/Auth/AuthTabs/AuthTabs';
import AuthContainer from '../components/Auth/AuthContainer/AuthContainer';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Register/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm';
import './AuthPage.css';

// Переименовываем Auth -> AuthPage
function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="auth-page">
            <Logo />
            <AuthContainer>
                {activeTab !== 'forgot' && (
                    <AuthTabs 
                        activeTab={activeTab} 
                        onTabChange={handleTabChange} 
                    />
                )}

                {activeTab === 'login' && (
                    <LoginForm 
                        onForgotPassword={() => handleTabChange('forgot')} 
                    />
                )}
                
                {activeTab === 'register' && (
                    <RegisterForm 
                        onShowLogin={() => handleTabChange('login')} 
                    />
                )}
                
                {activeTab === 'forgot' && (
                    <ForgotPasswordForm 
                        onShowLogin={() => handleTabChange('login')} 
                    />
                )}
            </AuthContainer>
        </div>
    );
}

export default AuthPage; // Экспортируем как AuthPage 