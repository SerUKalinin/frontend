import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h2>Панель управления</h2>
                        <p>Здесь вы можете управлять всеми аспектами вашей работы</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 