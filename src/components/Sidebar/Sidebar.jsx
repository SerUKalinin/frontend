import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserInfo } from '../../hooks/useUserInfo';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const { userInfo, loading, error } = useUserInfo();

    // Функция для получения инициалов пользователя
    const getUserInitials = () => {
        if (!userInfo || !userInfo.firstName) return 'U';
        return `${userInfo.firstName.charAt(0)}${userInfo.lastName ? userInfo.lastName.charAt(0) : ''}`;
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

    // Функция для получения полного имени
    const getFullName = () => {
        if (!userInfo) return 'Пользователь';
        return `${userInfo.firstName} ${userInfo.lastName || ''}`.trim();
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

                {userInfo?.roles === 'ROLE_ADMIN' && (
                    <NavLink to="/dashboard/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-users-cog"></i>
                        <span>Пользователи</span>
                    </NavLink>
                )}
            </nav>

            <div className="user-profile">
                <div className="user-avatar" title={loading ? 'Загрузка...' : error ? 'Ошибка загрузки' : getFullName()}>
                    {loading ? '...' : error ? '!' : getUserInitials()}
                </div>
                <div className="user-info">
                    <div className="user-name">
                        {loading ? 'Загрузка...' : error ? 'Ошибка' : getFullName()}
                    </div>
                    <div className="user-role">
                        {loading ? '' : error ? 'Попробуйте позже' : formatRole(userInfo?.roles)}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 