import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';

const TaskModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        objectName: '',
        deadline: '',
        assignee: {
            fullName: '',
            initials: ''
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Добавляем статус NEW для новой задачи
        onSubmit({ ...formData, status: 'NEW' });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Создать новую задачу</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Название задачи</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="objectName">Объект недвижимости</label>
                        <input
                            type="text"
                            id="objectName"
                            name="objectName"
                            value={formData.objectName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">Срок выполнения</label>
                        <input
                            type="datetime-local"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignee.fullName">Ответственный</label>
                        <input
                            type="text"
                            id="assignee.fullName"
                            name="assignee.fullName"
                            value={formData.assignee.fullName}
                            onChange={handleChange}
                            placeholder="ФИО ответственного"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="submit-btn">
                            Создать задачу
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

TaskModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default TaskModal; 