import React, { useState, useEffect } from 'react';
import './UsersSection.css';
import { useNotification } from '../../hooks/useNotification';

const UsersSection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Ошибка загрузки пользователей');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            showNotification('error', 'Ошибка', 'Не удалось загрузить список пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error('Ошибка обновления роли');
            
            showNotification('success', 'Успешно', 'Роль пользователя обновлена');
            loadUsers(); // Перезагружаем список пользователей
        } catch (error) {
            showNotification('error', 'Ошибка', 'Не удалось обновить роль пользователя');
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await fetch(`/api/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Ошибка обновления статуса');
            
            showNotification('success', 'Успешно', 'Статус пользователя обновлен');
            loadUsers(); // Перезагружаем список пользователей
        } catch (error) {
            showNotification('error', 'Ошибка', 'Не удалось обновить статус пользователя');
        }
    };

    if (loading) {
        return (
            <div className="users-section">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <section className="users-section">
            <div className="page-header">
                <h1 className="page-title">Пользователи</h1>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Должность</th>
                            <th>Роль</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.position}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="USER">Пользователь</option>
                                        <option value="ADMIN">Администратор</option>
                                        <option value="MANAGER">Менеджер</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                                        {user.status === 'ACTIVE' ? 'Активен' : 'Заблокирован'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`status-toggle-btn ${user.status === 'ACTIVE' ? 'block' : 'unblock'}`}
                                        onClick={() => handleStatusChange(
                                            user.id,
                                            user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
                                        )}
                                    >
                                        {user.status === 'ACTIVE' ? 'Заблокировать' : 'Разблокировать'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default UsersSection; 