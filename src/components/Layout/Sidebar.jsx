import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Главная', path: '/dashboard' },
        { id: 'objects', icon: 'fas fa-home', text: 'Объекты', path: '/objects' },
        { id: 'tasks', icon: 'fas fa-tasks', text: 'Задачи', path: '/tasks' },
        { id: 'profile', icon: 'fas fa-user', text: 'Профиль', path: '/profile' },
    ];

    // Добавляем пункт "Пользователи" только для админа
    if (user?.roles?.includes('ROLE_ADMIN')) {
        navItems.push({ id: 'users', icon: 'fas fa-users-cog', text: 'Пользователи', path: '/users' });
    }

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fas fa-building"></i>
                <h2>RealEstate PRO</h2>
            </div>

            <nav className="nav-menu">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <i className={item.icon}></i>
                        <span>{item.text}</span>
                    </div>
                ))}
            </nav>

            <div className="user-profile">
                <div className="user-avatar">
                    {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="user-info">
                    <div className="user-name">
                        {user?.firstName} {user?.lastName}
                    </div>
                    <div className="user-role">
                        {user?.roles?.[0]?.replace('ROLE_', '') || 'Пользователь'}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 