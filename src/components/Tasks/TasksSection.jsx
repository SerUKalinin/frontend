import React, { useState, useEffect } from 'react';
import './TasksSection.css';
import Task from './Task';
import TaskModal from './TaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import { useNotification } from '../../hooks/useNotification';

const TasksSection = ({ searchQuery }) => {
    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        loadTasks();
    }, [searchQuery]);

    const loadTasks = async () => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch('/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Ошибка при загрузке задач:', error);
            showNotification('error', 'Ошибка', 'Не удалось загрузить список задач');
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            
            if (response.ok) {
                showNotification('success', 'Успех', 'Задача успешно создана');
                loadTasks();
                setShowAddModal(false);
            } else {
                throw new Error('Ошибка при создании задачи');
            }
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            showNotification('error', 'Ошибка', 'Не удалось создать задачу');
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch(`/api/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (response.ok) {
                showNotification('success', 'Успех', 'Статус задачи обновлен');
                loadTasks();
            } else {
                throw new Error('Ошибка при обновлении статуса задачи');
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
            showNotification('error', 'Ошибка', 'Не удалось обновить статус задачи');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            try {
                // TODO: Заменить на реальный API-запрос
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    showNotification('success', 'Успех', 'Задача успешно удалена');
                    loadTasks();
                } else {
                    throw new Error('Ошибка при удалении задачи');
                }
            } catch (error) {
                console.error('Ошибка при удалении задачи:', error);
                showNotification('error', 'Ошибка', 'Не удалось удалить задачу');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'NEW': '#4361ee',
            'IN_PROGRESS': '#4895ef',
            'COMPLETED': '#4cc9f0',
            'EXPIRED': '#f72585'
        };
        return colors[status] || '#adb5bd';
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
    };

    return (
        <section className="tasks-section">
            <div className="page-header">
                <h1 className="page-title">Задачи</h1>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus"></i>
                    Создать задачу
                </button>
            </div>

            <div className="tasks-grid">
                {tasks.map(task => (
                    <Task
                        key={task.id}
                        task={task}
                        onView={handleViewTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>

            {showAddModal && (
                <TaskModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddTask}
                />
            )}

            {showDetailsModal && selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedTask(null);
                    }}
                    onStatusChange={handleUpdateTaskStatus}
                    onUpdate={loadTasks}
                />
            )}
        </section>
    );
};

export default TasksSection; 