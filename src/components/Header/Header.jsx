import React from 'react';
import './Header.css';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onSearch }) => {
    const { logout } = useAuth();

    const handleSearch = (e) => {
        onSearch(e.target.value);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <header className="header">
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    placeholder="Поиск..." 
                    onChange={handleSearch}
                />
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