import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatisticCard from './StatisticCard/StatisticCard';
import RecentTasks from './RecentTasks/RecentTasks';
import objectService from '../../services/objectService';
import './DashboardPage.css';

const DashboardPage = () => {
    const [objectsCount, setObjectsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchObjectsCount();
    }, []);

    const fetchObjectsCount = async () => {
        try {
            setLoading(true);
            const objects = await objectService.getAllObjects();
            if (objects) {
                setObjectsCount(objects.length);
                setError(null);
            }
        } catch (err) {
            setError('Ошибка при загрузке данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Главная панель</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="statistics-grid">
                <StatisticCard 
                    title="Объекты недвижимости"
                    count={objectsCount}
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
