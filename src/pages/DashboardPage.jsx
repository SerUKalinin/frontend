import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar/Sidebar';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Добро пожаловать, {user?.username}!</h1>
                    <button onClick={logout} className="logout-button">
                        <i className="fas fa-sign-out-alt"></i>
                        Выйти
                    </button>
                </header>
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h2>Панель управления</h2>
                        <p>Здесь вы можете управлять всеми аспектами вашей работы</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage; 