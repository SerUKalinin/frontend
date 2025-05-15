import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats] = useState({
        totalObjects: 0,
        activeTasks: 0,
        expiredTasks: 0
    });

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">Главная панель</h1>
            </div>

            <div className="cards-grid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Объекты недвижимости</h3>
                        <span className="card-badge">{stats.totalObjects}</span>
                    </div>
                    <div className="card-body">
                        <p>Всего объектов в системе</p>
                    </div>
                    <div className="card-footer">
                        <span className="card-date">Обновлено только что</span>
                        <div className="card-actions">
                            <div className="action-btn edit-btn">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
