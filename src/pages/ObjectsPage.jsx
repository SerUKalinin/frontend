import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import ObjectModal from '../components/Objects/ObjectModal';
import './ObjectsPage.css';

const ObjectsPage = () => {
    const api = useApi();
    const [objects, setObjects] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null);
    const [showObjectModal, setShowObjectModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [parentObjects, setParentObjects] = useState([]);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        try {
            const data = await api.get('/api/objects');
            setObjects(data);
        } catch (error) {
            console.error('Error loading objects:', error);
        }
    };

    const handleAddObject = () => {
        setSelectedObject(null);
        setShowObjectModal(true);
    };

    const handleEditObject = (object) => {
        setSelectedObject(object);
        setShowObjectModal(true);
    };

    const handleShowDetails = async (object) => {
        try {
            const details = await api.get(`/api/objects/${object.id}`);
            setSelectedObject(details);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error loading object details:', error);
        }
    };

    const handleDeleteObject = async (objectId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
            try {
                await api.del(`/api/objects/${objectId}`);
                loadObjects();
            } catch (error) {
                console.error('Error deleting object:', error);
            }
        }
    };

    const getObjectTypeName = (type) => {
        const types = {
            'BUILDING': 'Здание',
            'ENTRANCE': 'Подъезд',
            'BASEMENT_FLOOR': 'Цокольный этаж',
            'FLOOR': 'Этаж',
            'STAIRWELL': 'Лестничный пролет',
            'ELEVATOR': 'Лифт',
            'FLOOR_BALCONY': 'Балкон этажа',
            'CORRIDOR': 'Коридор',
            'ELEVATOR_HALL': 'Холл лифта',
            'APARTMENT': 'Квартира',
            'APARTMENT_BALCONY': 'Балкон квартиры',
            'ROOM': 'Комната',
            'TASK': 'Задача'
        };
        return types[type] || type;
    };

    return (
        <div className="objects-container">
            <div className="page-header">
                <h1 className="page-title">Объекты недвижимости</h1>
                <button className="add-btn" onClick={handleAddObject}>
                    <i className="fas fa-plus"></i>
                    Добавить объект
                </button>
            </div>

            <div className="objects-grid">
                {objects.map(object => (
                    <div key={object.id} className="object-card">
                        <div className="object-card-header">
                            <h3 className="object-name">{object.name}</h3>
                            <span className="object-type">{getObjectTypeName(object.objectType)}</span>
                        </div>
                        <div className="object-card-body">
                            <div className="object-info">
                                <p>Создан: {new Date(object.createdAt).toLocaleDateString()}</p>
                                {object.responsibleUser && (
                                    <p>Ответственный: {object.responsibleUser.firstName} {object.responsibleUser.lastName}</p>
                                )}
                            </div>
                        </div>
                        <div className="object-card-footer">
                            <div className="object-actions">
                                <div className="action-btn edit-btn" onClick={() => handleEditObject(object)}>
                                    <i className="fas fa-edit"></i>
                                </div>
                                <div className="action-btn view-btn" onClick={() => handleShowDetails(object)}>
                                    <i className="fas fa-eye"></i>
                                </div>
                                <div className="action-btn delete-btn" onClick={() => handleDeleteObject(object.id)}>
                                    <i className="fas fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showObjectModal && (
                <ObjectModal
                    object={selectedObject}
                    onClose={() => setShowObjectModal(false)}
                    onSave={() => {
                        loadObjects();
                        setShowObjectModal(false);
                    }}
                />
            )}

            {showDetailsModal && selectedObject && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Детали объекта</h3>
                            <button className="close-btn" onClick={() => setShowDetailsModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="details-group">
                                <label>Название:</label>
                                <p>{selectedObject.name}</p>
                            </div>
                            <div className="details-group">
                                <label>Тип:</label>
                                <p>{getObjectTypeName(selectedObject.objectType)}</p>
                            </div>
                            {selectedObject.parentObject && (
                                <div className="details-group">
                                    <label>Родительский объект:</label>
                                    <p>{selectedObject.parentObject.name}</p>
                                </div>
                            )}
                            <div className="details-group">
                                <label>Дата создания:</label>
                                <p>{new Date(selectedObject.createdAt).toLocaleDateString()}</p>
                            </div>
                            {selectedObject.updatedAt && (
                                <div className="details-group">
                                    <label>Последнее обновление:</label>
                                    <p>{new Date(selectedObject.updatedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ObjectsPage; 