import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import './UsersPage.css';

const UsersPage = () => {
    const api = useApi();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'USER'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/users');
            setUsers(data);
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
        } finally {
            setLoading(false);
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
            if (selectedUser) {
                await api.put(`/api/users/${selectedUser.id}`, formData);
            } else {
                await api.post('/api/users', formData);
            }
            await loadUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'USER'
        });
        setShowModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await api.delete(`/api/users/${userId}`);
                await loadUsers();
            } catch (error) {
                console.error('Ошибка при удалении пользователя:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'USER'
        });
    };

    const getRoleName = (role) => {
        const roles = {
            'ADMIN': 'Администратор',
            'MANAGER': 'Менеджер',
            'USER': 'Пользователь'
        };
        return roles[role] || role;
    };

    return (
        <div className="users-container">
            <div className="page-header">
                <h1 className="page-title">Пользователи</h1>
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i>
                    Добавить пользователя
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Загрузка...</div>
            ) : (
                <div className="users-grid">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Телефон</th>
                                <th>Роль</th>
                                <th>Дата регистрации</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '—'}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                            {getRoleName(user.role)}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {selectedUser ? 'Редактирование пользователя' : 'Добавление пользователя'}
                            </h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Имя</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Фамилия</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Телефон</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Роль</label>
                                <select
                                    className="form-select"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="USER">Пользователь</option>
                                    <option value="MANAGER">Менеджер</option>
                                    <option value="ADMIN">Администратор</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {selectedUser ? 'Сохранить' : 'Добавить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage; 