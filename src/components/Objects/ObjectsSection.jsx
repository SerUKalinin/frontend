import React, { useState, useEffect } from 'react';
import './ObjectsSection.css';
import ObjectModal from './ObjectModal';
import ObjectDetailsModal from './ObjectDetailsModal';
import { useNotification } from '../../hooks/useNotification';

const ObjectsSection = ({ searchQuery }) => {
    const [objects, setObjects] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        loadObjects();
    }, [searchQuery]);

    const loadObjects = async () => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch('/api/objects');
            const data = await response.json();
            setObjects(data);
        } catch (error) {
            console.error('Ошибка при загрузке объектов:', error);
            showNotification('error', 'Ошибка', 'Не удалось загрузить список объектов');
        }
    };

    const handleAddObject = async (objectData) => {
        try {
            // TODO: Заменить на реальный API-запрос
            const response = await fetch('/api/objects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectData),
            });
            
            if (response.ok) {
                showNotification('success', 'Успех', 'Объект успешно создан');
                loadObjects();
                setShowAddModal(false);
            } else {
                throw new Error('Ошибка при создании объекта');
            }
        } catch (error) {
            console.error('Ошибка при создании объекта:', error);
            showNotification('error', 'Ошибка', 'Не удалось создать объект');
        }
    };

    const handleShowDetails = (object) => {
        setSelectedObject(object);
        setShowDetailsModal(true);
    };

    const handleDeleteObject = async (objectId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
            try {
                // TODO: Заменить на реальный API-запрос
                const response = await fetch(`/api/objects/${objectId}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    showNotification('success', 'Успех', 'Объект успешно удален');
                    loadObjects();
                } else {
                    throw new Error('Ошибка при удалении объекта');
                }
            } catch (error) {
                console.error('Ошибка при удалении объекта:', error);
                showNotification('error', 'Ошибка', 'Не удалось удалить объект');
            }
        }
    };

    return (
        <section className="objects-section">
            <div className="page-header">
                <h1 className="page-title">Объекты недвижимости</h1>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <i className="fas fa-plus"></i>
                    Добавить объект
                </button>
            </div>

            <div className="objects-grid">
                {objects.map(object => (
                    <div key={object.id} className="object-card">
                        <div className="object-card-header">
                            <h3 className="object-card-title">{object.name}</h3>
                            <span className="object-type-badge">{object.type}</span>
                        </div>
                        <div className="object-card-body">
                            <p>{object.description || 'Описание отсутствует'}</p>
                        </div>
                        <div className="object-card-footer">
                            <div className="object-card-actions">
                                <button 
                                    className="action-btn view-btn"
                                    onClick={() => handleShowDetails(object)}
                                >
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={() => handleShowDetails(object)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={() => handleDeleteObject(object.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <ObjectModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddObject}
                />
            )}

            {showDetailsModal && selectedObject && (
                <ObjectDetailsModal
                    object={selectedObject}
                    onClose={() => setShowDetailsModal(false)}
                    onUpdate={loadObjects}
                />
            )}
        </section>
    );
};

export default ObjectsSection; 