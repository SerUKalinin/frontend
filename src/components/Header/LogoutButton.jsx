import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './LogoutButton.css';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout} title="Выйти">
            <i className="fas fa-sign-out-alt"></i>
            <span className="logout-text">Выйти</span>
        </button>
    );
};

export default LogoutButton; 