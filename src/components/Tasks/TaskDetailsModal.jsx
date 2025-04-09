import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';

const TaskDetailsModal = ({ task, onClose, onStatusChange, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        objectName: task.objectName,
        deadline: task.deadline,
        assignee: {
            fullName: task.assignee?.fullName || '',
            initials: task.assignee?.initials || ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('assignee.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                assignee: {
                    ...prev.assignee,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    status: task.status
                }),
            });

            if (response.ok) {
                onUpdate();
                setIsEditing(false);
            } else {
                throw new Error('Ошибка при обновлении задачи');
            }
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        await onStatusChange(task.id, newStatus);
    };

    const renderStatusButtons = () => {
        const statuses = [
            { value: 'NEW', label: 'Новая' },
            { value: 'IN_PROGRESS', label: 'В работе' },
            { value: 'COMPLETED', label: 'Завершена' },
            { value: 'EXPIRED', label: 'Просрочена' }
        ];

        return (
            <div className="status-buttons">
                {statuses.map(status => (
                    <button
                        key={status.value}
                        className={`status-btn ${task.status === status.value ? 'active' : ''}`}
                        onClick={() => handleStatusChange(status.value)}
                        disabled={task.status === status.value}
                    >
                        {status.label}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Редактировать задачу' : 'Просмотр задачи'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Название задачи</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <p className="detail-text">{task.title}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        {isEditing ? (
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <p className="detail-text">{task.description}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="objectName">Объект недвижимости</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="objectName"
                                name="objectName"
                                value={formData.objectName}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <p className="detail-text">{task.objectName}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">Срок выполнения</label>
                        {isEditing ? (
                            <input
                                type="datetime-local"
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <p className="detail-text">
                                {new Date(task.deadline).toLocaleString()}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignee.fullName">Ответственный</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="assignee.fullName"
                                name="assignee.fullName"
                                value={formData.assignee.fullName}
                                onChange={handleChange}
                                placeholder="ФИО ответственного"
                            />
                        ) : (
                            <p className="detail-text">
                                {task.assignee?.fullName || 'Не назначен'}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Статус</label>
                        {renderStatusButtons()}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Закрыть
                        </button>
                        {isEditing ? (
                            <>
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                    Отменить
                                </button>
                                <button type="submit" className="submit-btn">
                                    Сохранить
                                </button>
                            </>
                        ) : (
                            <button type="button" className="submit-btn" onClick={() => setIsEditing(true)}>
                                Редактировать
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

TaskDetailsModal.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        objectName: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        assignee: PropTypes.shape({
            initials: PropTypes.string,
            fullName: PropTypes.string
        })
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export default TaskDetailsModal; 