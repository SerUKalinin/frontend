import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './DashboardContent.css';

const DashboardContent = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-welcome">
            <h1>Добро пожаловать, {user?.fullName || 'Гость'}!</h1>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Объекты недвижимости</h3>
                    <p className="stat-number">12</p>
                </div>
                <div className="stat-card">
                    <h3>Активные задачи</h3>
                    <p className="stat-number">5</p>
                </div>
                <div className="stat-card">
                    <h3>Завершенные задачи</h3>
                    <p className="stat-number">8</p>
                </div>
                <div className="stat-card">
                    <h3>Пользователи</h3>
                    <p className="stat-number">3</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent; 