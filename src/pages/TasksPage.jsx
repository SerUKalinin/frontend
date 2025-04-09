import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import './TasksPage.css';

const TasksPage = () => {
    const api = useApi();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Ошибка при загрузке задач:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusName = (status) => {
        const statuses = {
            'NEW': 'Новая',
            'IN_PROGRESS': 'В работе',
            'COMPLETED': 'Завершена',
            'CANCELLED': 'Отменена'
        };
        return statuses[status] || status;
    };

    const getPriorityName = (priority) => {
        const priorities = {
            'LOW': 'Низкий',
            'MEDIUM': 'Средний',
            'HIGH': 'Высокий',
            'CRITICAL': 'Критический'
        };
        return priorities[priority] || priority;
    };

    const getPriorityClass = (priority) => {
        const classes = {
            'LOW': 'priority-low',
            'MEDIUM': 'priority-medium',
            'HIGH': 'priority-high',
            'CRITICAL': 'priority-critical'
        };
        return classes[priority] || '';
    };

    const getStatusClass = (status) => {
        const classes = {
            'NEW': 'status-new',
            'IN_PROGRESS': 'status-progress',
            'COMPLETED': 'status-completed',
            'CANCELLED': 'status-cancelled'
        };
        return classes[status] || '';
    };

    return (
        <div className="tasks-container">
            <div className="page-header">
                <h1 className="page-title">Задачи</h1>
                <button className="add-btn">
                    <i className="fas fa-plus"></i>
                    Создать задачу
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Загрузка...</div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map(task => (
                        <div key={task.id} className="task-card">
                            <div className="task-card-header">
                                <h3 className="task-title">{task.title}</h3>
                                <span className={`task-status ${getStatusClass(task.status)}`}>
                                    {getStatusName(task.status)}
                                </span>
                            </div>
                            <div className="task-card-body">
                                <p className="task-description">{task.description}</p>
                                <div className="task-info">
                                    <div className={`task-priority ${getPriorityClass(task.priority)}`}>
                                        {getPriorityName(task.priority)}
                                    </div>
                                    <div className="task-dates">
                                        <span>Создано: {new Date(task.createdAt).toLocaleDateString()}</span>
                                        {task.dueDate && (
                                            <span>Срок: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="task-card-footer">
                                <div className="task-actions">
                                    <button className="action-btn edit-btn">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="action-btn view-btn">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn delete-btn">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksPage; 