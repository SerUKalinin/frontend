import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserInfo } from '../../hooks/useUserInfo';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const { username, email, role, isLoading, error } = useUserInfo();

    // Функция для получения инициалов пользователя
    const getUserInitials = () => {
        if (!username) return 'U';
        return username.charAt(0).toUpperCase();
    };

    // Функция для форматирования роли пользователя
    const formatRole = (role) => {
        if (!role) return 'Пользователь';
        switch(role) {
            case 'ROLE_ADMIN':
                return 'Администратор';
            case 'ROLE_USER':
                return 'Пользователь';
            case 'ROLE_DIRECTOR':
                return 'Директор';
            case 'ROLE_CHIEF':
                return 'Руководитель';
            case 'ROLE_RESPONSIBLE':
                return 'Ответственный';
            default:
                return 'Пользователь';
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fas fa-building"></i>
                <h2>RealEstate PRO</h2>
            </div>

            <nav className="nav-menu">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Главная</span>
                </NavLink>
                
                <NavLink to="/dashboard/objects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-home"></i>
                    <span>Объекты</span>
                </NavLink>
                
                <NavLink to="/dashboard/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-tasks"></i>
                    <span>Задачи</span>
                </NavLink>
                
                <NavLink to="/dashboard/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-user"></i>
                    <span>Профиль</span>
                </NavLink>

                {role === 'ROLE_ADMIN' && (
                    <NavLink to="/dashboard/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-users-cog"></i>
                        <span>Пользователи</span>
                    </NavLink>
                )}
            </nav>

            <div className="user-profile">
                <div className="user-avatar" title={isLoading ? 'Загрузка...' : error ? 'Ошибка загрузки' : username}>
                    {isLoading ? '...' : error ? '!' : getUserInitials()}
                </div>
                <div className="user-info">
                    <div className="user-name">
                        {isLoading ? 'Загрузка...' : error ? 'Ошибка' : username}
                    </div>
                    <div className="user-role">
                        {isLoading ? '' : error ? 'Попробуйте позже' : formatRole(role)}
                    </div>
                </div>
                <button className="logout-button" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 