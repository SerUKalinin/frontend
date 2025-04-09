import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Register/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm';
import './AuthPage.css';

// Переименовываем Auth -> AuthPage
function AuthPage() {
    const navigate = useNavigate(); // Используем хук для навигации
    // 'login', 'register', 'forgot'
    const [activeTab, setActiveTab] = useState('login');

    const showTab = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="auth-container">
            <div className="logo">
                <h1>RealEstate PRO</h1>
                <p>Система управления недвижимостью</p>
            </div>

            <div className="auth-form-container">
                {activeTab !== 'forgot' && (
                    <div className="tabs">
                        <div
                            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => showTab('login')}
                        >
                            Вход
                        </div>
                        <div
                            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => showTab('register')}
                        >
                            Регистрация
                        </div>
                    </div>
                )}

                {/* 
                    Убираем колбэки onRegisterSuccess, onLoginSuccess.
                    Хуки теперь сами управляют навигацией.
                    Передаем только обработчики для переключения вкладок.
                */} 
                {activeTab === 'login' && <LoginForm onForgotPassword={() => showTab('forgot')} />}
                {/* onRegisterSuccess убран, хук useRegisterForm перенаправит на /verify-email */}
                {activeTab === 'register' && <RegisterForm onShowLogin={() => showTab('login')} />}
                 {/* onRequestSuccess убран, хук useForgotPasswordForm покажет сообщение, а компонент переключит вкладку по таймеру */}
                {activeTab === 'forgot' && <ForgotPasswordForm onShowLogin={() => showTab('login')} />}
            </div>
        </div>
    );
}

export default AuthPage; // Экспортируем как AuthPage 