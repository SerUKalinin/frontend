import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const ProfileSection = () => {
    const { user, updateUserProfile } = useAuth();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        position: user?.position || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                position: user.position || ''
            });
        }
    }, [user]);

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
            await updateUserProfile(formData);
            showNotification('success', 'Профиль обновлен', 'Ваши данные успешно сохранены');
        } catch (error) {
            showNotification('error', 'Ошибка', 'Не удалось обновить профиль');
        }
    };

    return (
        <section className="profile-section">
            <div className="page-header">
                <h1 className="page-title">Профиль</h1>
            </div>

            <div className="profile-content">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="fullName">ФИО</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="position">Должность</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Сохранить изменения
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ProfileSection; 