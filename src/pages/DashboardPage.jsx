import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const [stats, setStats] = useState({
        objectsCount: 0,
        activeTasksCount: 0,
        expiredTasksCount: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [isTableCollapsed, setIsTableCollapsed] = useState(false);

    useEffect(() => {
        loadDashboardData();
        // Автообновление каждые 30 секунд
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsData, tasksData] = await Promise.all([
                api.get('/api/dashboard/stats'),
                api.get('/api/dashboard/recent-tasks')
            ]);

            setStats(statsData);
            setRecentTasks(tasksData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const handleObjectClick = () => {
        navigate('/objects');
    };

    const handleTaskClick = () => {
        navigate('/tasks');
    };

    const toggleTable = () => {
        setIsTableCollapsed(!isTableCollapsed);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'new': return 'status-new';
            case 'in_progress': return 'status-in-progress';
            case 'completed': return 'status-completed';
            case 'expired': return 'status-expired';
            default: return '';
        }
    };

    const getStatusName = (status) => {
        switch (status.toLowerCase()) {
            case 'new': return 'Новая';
            case 'in_progress': return 'В работе';
            case 'completed': return 'Завершена';
            case 'expired': return 'Просрочена';
            default: return status;
        }
    };

    const handleEditTask = (taskId) => {
        navigate(`/tasks/${taskId}`);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            try {
                await api.del(`/api/tasks/${taskId}`);
                loadDashboardData();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1 className="page-title">Главная панель</h1>
            </div>

            <div className="cards-grid">
                <div className="card" onClick={handleObjectClick}>
                    <div className="card-header">
                        <h3 className="card-title">Объекты недвижимости</h3>
                        <span className="card-badge">{stats.objectsCount}</span>
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

                <div className="card" onClick={handleTaskClick}>
                    <div className="card-header">
                        <h3 className="card-title">Активные задачи</h3>
                        <span className="card-badge">{stats.activeTasksCount}</span>
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

                <div className="card" onClick={handleTaskClick}>
                    <div className="card-header">
                        <h3 className="card-title">Просроченные</h3>
                        <span className="card-badge status-expired">{stats.expiredTasksCount}</span>
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

            <div className="data-table">
                <div className="table-header" onClick={toggleTable}>
                    <h3 className="table-title">Последние задачи</h3>
                    <i className={`fas fa-chevron-${isTableCollapsed ? 'down' : 'up'} toggle-icon`}></i>
                </div>
                <div className={`table-body ${isTableCollapsed ? 'collapsed' : ''}`}>
                    <div className="table-row header">
                        <div className="table-cell">Название</div>
                        <div className="table-cell">Объект</div>
                        <div className="table-cell">Статус</div>
                        <div className="table-cell">Дедлайн</div>
                        <div className="table-cell">Действия</div>
                    </div>
                    {recentTasks.map(task => (
                        <div key={task.id} className="table-row">
                            <div className="table-cell" data-label="Название">{task.name}</div>
                            <div className="table-cell" data-label="Объект">{task.objectName}</div>
                            <div className="table-cell" data-label="Статус">
                                <span className={`status-badge ${getStatusClass(task.status)}`}>
                                    {getStatusName(task.status)}
                                </span>
                            </div>
                            <div className="table-cell" data-label="Дедлайн">
                                {new Date(task.deadline).toLocaleDateString()}
                            </div>
                            <div className="table-cell">
                                <div className="action-btn edit-btn" onClick={() => handleEditTask(task.id)}>
                                    <i className="fas fa-edit"></i>
                                </div>
                                <div className="action-btn delete-btn" onClick={() => handleDeleteTask(task.id)}>
                                    <i className="fas fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 