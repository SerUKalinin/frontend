import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import './ObjectModal.css';

const ObjectModal = ({ object, onClose, onSave }) => {
    const api = useApi();
    const [formData, setFormData] = useState({
        name: '',
        objectType: 'BUILDING',
        parentId: ''
    });
    const [parentObjects, setParentObjects] = useState([]);

    useEffect(() => {
        if (object) {
            setFormData({
                name: object.name,
                objectType: object.objectType,
                parentId: object.parentId || ''
            });
        }
        loadParentObjects();
    }, [object]);

    const loadParentObjects = async () => {
        try {
            const data = await api.get('/api/objects');
            setParentObjects(data);
        } catch (error) {
            console.error('Error loading parent objects:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                parentId: formData.parentId || null
            };

            if (object) {
                await api.put(`/api/objects/${object.id}`, data);
            } else {
                await api.post('/api/objects', data);
            }
            onSave();
        } catch (error) {
            console.error('Error saving object:', error);
        }
    };

    const objectTypes = [
        { value: 'BUILDING', label: 'Здание' },
        { value: 'ENTRANCE', label: 'Подъезд' },
        { value: 'BASEMENT_FLOOR', label: 'Цокольный этаж' },
        { value: 'FLOOR', label: 'Этаж' },
        { value: 'STAIRWELL', label: 'Лестничный пролет' },
        { value: 'ELEVATOR', label: 'Лифт' },
        { value: 'FLOOR_BALCONY', label: 'Балкон этажа' },
        { value: 'CORRIDOR', label: 'Коридор' },
        { value: 'ELEVATOR_HALL', label: 'Холл лифта' },
        { value: 'APARTMENT', label: 'Квартира' },
        { value: 'APARTMENT_BALCONY', label: 'Балкон квартиры' },
        { value: 'ROOM', label: 'Комната' },
        { value: 'TASK', label: 'Задача' }
    ];

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
                        <label className="form-label" htmlFor="parent-select">Родительский объект</label>
                        <select
                            className="form-select"
                            id="parent-select"
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                        >
                            <option value="">Без родительского объекта</option>
                            {parentObjects.map(obj => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="object-name">Название объекта</label>
                        <input
                            type="text"
                            className="form-input"
                            id="object-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="object-type">Тип объекта</label>
                        <select
                            className="form-select"
                            id="object-type"
                            name="objectType"
                            value={formData.objectType}
                            onChange={handleChange}
                            required
                        >
                            {objectTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
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