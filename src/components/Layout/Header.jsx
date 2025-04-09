import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <header className="header">
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Поиск..." />
            </div>

            <div className="header-actions">
                <div className="notification-bell">
                    <i className="fas fa-bell"></i>
                    <div className="notification-badge">3</div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Выйти
                </button>
            </div>
        </header>
    );
};

export default Header; 