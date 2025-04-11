import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalObjects: 0,
        activeTasks: 0,
        expiredTasks: 0
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Загружаем объекты недвижимости
                const objectsResponse = await fetch("http://localhost:8080/real-estate-objects", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const objects = await objectsResponse.json();

                // Загружаем задачи
                const tasksResponse = await fetch("http://localhost:8080/tasks", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const tasks = await tasksResponse.json();

                // Фильтруем задачи
                const activeTasks = tasks.filter(task => 
                    task.status === 'NEW' || task.status === 'IN_PROGRESS' || task.status === 'URGENT'
                );
                const expiredTasks = tasks.filter(task => task.status === 'EXPIRED');

                setStats({
                    totalObjects: objects.length,
                    activeTasks: activeTasks.length,
                    expiredTasks: expiredTasks.length
                });
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        loadDashboardData();
        // Обновляем данные каждую минуту
        const interval = setInterval(loadDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

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

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Активные задачи</h3>
                        <span className="card-badge">{stats.activeTasks}</span>
                    </div>
                    <div className="card-body">
                        <p>Задачи в работе</p>
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

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Просроченные</h3>
                        <span className="card-badge">{stats.expiredTasks}</span>
                    </div>
                    <div className="card-body">
                        <p>Просроченные задачи</p>
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
