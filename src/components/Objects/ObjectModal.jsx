import React, { useState } from 'react';
import './ObjectModal.css';

const ObjectModal = ({ object, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: object?.name || '',
        type: object?.type || 'BUILDING',
        description: object?.description || '',
        parentId: object?.parentId || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {object ? 'Редактирование объекта' : 'Создание объекта'}
                    </h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Название объекта</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="type">Тип объекта</label>
                        <select
                            id="type"
                            name="type"
                            className="form-select"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="BUILDING">Здание</option>
                            <option value="ENTRANCE">Подъезд</option>
                            <option value="FLOOR">Этаж</option>
                            <option value="APARTMENT">Квартира</option>
                            <option value="ROOM">Комната</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {object ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ObjectModal; 