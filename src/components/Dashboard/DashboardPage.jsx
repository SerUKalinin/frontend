import React from 'react';
import StatisticCard from './StatisticCard/StatisticCard';
import RecentTasks from './RecentTasks/RecentTasks';
import './DashboardPage.css';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Главная панель</h1>
            
            <div className="statistics-grid">
                <StatisticCard 
                    title="Объекты недвижимости"
                    count={0}
                    description="Всего объектов в системе"
                    updateText="Обновлено только что"
                    type="properties"
                />
                <StatisticCard 
                    title="Активные задачи"
                    count={0}
                    description="Задачи в работе"
                    updateText="Обновлено только что"
                    type="active-tasks"
                />
                <StatisticCard 
                    title="Просроченные"
                    count={0}
                    description="Просроченные задачи"
                    updateText="Обновлено только что"
                    type="overdue-tasks"
                />
            </div>

            <div className="recent-tasks-section">
                <RecentTasks />
            </div>
        </div>
    );
};

export default DashboardPage;
