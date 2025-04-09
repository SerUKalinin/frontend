import React, { useState, useEffect } from 'react';
import './ObjectDetailsModal.css';
import { useNotification } from '../../hooks/useNotification';

const ObjectDetailsModal = ({ object, onClose, onUpdate }) => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responsibleUser, setResponsibleUser] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        loadChildren();
        loadResponsibleUser();
    }, [object.id]);

    const loadChildren = async () => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch(`/api/objects/${object.id}/children`);
            const data = await response.json();
            setChildren(data);
        } catch (error) {
            console.error('Ошибка при загрузке дочерних объектов:', error);
            showNotification('error', 'Ошибка', 'Не удалось загрузить дочерние объекты');
        } finally {
            setLoading(false);
        }
    };

    const loadResponsibleUser = async () => {
        if (object.responsibleUserId) {
            try {
                // TODO: Заменить на реальный API-запрос
                const response = await fetch(`/api/users/${object.responsibleUserId}`);
                const data = await response.json();
                setResponsibleUser(data);
            } catch (error) {
                console.error('Ошибка при загрузке ответственного:', error);
            }
        }
    };

    const handleAssignResponsible = async () => {
        // TODO: Реализовать назначение ответственного
    };

    const handleRemoveResponsible = async () => {
        // TODO: Реализовать удаление ответственного
    };

    const getObjectTypeName = (type) => {
        const types = {
            BUILDING: 'Здание',
            ENTRANCE: 'Подъезд',
            FLOOR: 'Этаж',
            APARTMENT: 'Квартира',
            ROOM: 'Комната'
        };
        return types[type] || type;
    };

    return (
        <div className="modal">
            <div className="modal-content object-details-modal">
                <div className="modal-header">
                    <h3 className="modal-title">{object.name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="object-details-container">
                    <div className="object-details-sidebar">
                        <div className="details-section">
                            <h4 className="details-title">Информация об объекте</h4>
                            <div className="details-content">
                                <div className="detail-item">
                                    <span className="detail-label">Тип:</span>
                                    <span>{getObjectTypeName(object.type)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Создан:</span>
                                    <span>{new Date(object.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Ответственный:</span>
                                    <div className="responsible-user">
                                        {responsibleUser ? (
                                            <>
                                                <span>{`${responsibleUser.firstName} ${responsibleUser.lastName}`}</span>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={handleRemoveResponsible}
                                                >
                                                    Удалить
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={handleAssignResponsible}
                                            >
                                                Назначить
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="object-details-main">
                        <div className="children-section">
                            <h4 className="section-title">Дочерние объекты</h4>
                            {loading ? (
                                <div className="loading">Загрузка...</div>
                            ) : children.length > 0 ? (
                                <div className="children-grid">
                                    {children.map(child => (
                                        <div key={child.id} className="child-card">
                                            <div className="child-card-header">
                                                <h5 className="child-name">{child.name}</h5>
                                                <span className="child-type">
                                                    {getObjectTypeName(child.type)}
                                                </span>
                                            </div>
                                            <div className="child-card-actions">
                                                <button className="btn btn-primary btn-sm">
                                                    Подробнее
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-children">
                                    Нет дочерних объектов
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectDetailsModal; 