import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import './ProfilePage.css';

const ProfilePage = () => {
    const api = useApi();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/users/profile');
            setProfile(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error('Ошибка при загрузке профиля:', error);
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
            await api.put('/api/users/profile', formData);
            await loadProfile();
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Загрузка...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="page-title">Профиль пользователя</h1>
                {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                        <i className="fas fa-edit"></i>
                        Редактировать
                    </button>
                )}
            </div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-placeholder">
                        <i className="fas fa-user"></i>
                    </div>
                    <h2 className="profile-name">
                        {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="profile-role">{profile.role}</p>
                </div>

                {isEditing ? (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Имя</label>
                            <input
                                type="text"
                                className="form-input"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
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
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                Отмена
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Сохранить
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info">
                        <div className="info-group">
                            <label>Email</label>
                            <p>{profile.email}</p>
                        </div>
                        <div className="info-group">
                            <label>Телефон</label>
                            <p>{profile.phone || 'Не указан'}</p>
                        </div>
                        <div className="info-group">
                            <label>Дата регистрации</label>
                            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="info-group">
                            <label>Последнее обновление</label>
                            <p>{profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Никогда'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage; 