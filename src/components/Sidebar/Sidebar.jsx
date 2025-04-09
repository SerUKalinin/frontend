import React from 'react';
import './Sidebar.css';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ activeSection, onSectionChange }) => {
    const { user } = useAuth();
    
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fas fa-building"></i>
                <h2>RealEstate PRO</h2>
            </div>

            <nav className="nav-menu">
                <div 
                    className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} 
                    onClick={() => onSectionChange('dashboard')}
                >
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Главная</span>
                </div>
                <div 
                    className={`nav-item ${activeSection === 'objects' ? 'active' : ''}`}
                    onClick={() => onSectionChange('objects')}
                >
                    <i className="fas fa-home"></i>
                    <span>Объекты</span>
                </div>
                <div 
                    className={`nav-item ${activeSection === 'tasks' ? 'active' : ''}`}
                    onClick={() => onSectionChange('tasks')}
                >
                    <i className="fas fa-tasks"></i>
                    <span>Задачи</span>
                </div>
                <div 
                    className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                    onClick={() => onSectionChange('profile')}
                >
                    <i className="fas fa-user"></i>
                    <span>Профиль</span>
                </div>
                {user?.role === 'ROLE_ADMIN' && (
                    <div 
                        className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                        onClick={() => onSectionChange('users')}
                    >
                        <i className="fas fa-users-cog"></i>
                        <span>Пользователи</span>
                    </div>
                )}
            </nav>

            <div className="user-profile">
                <div className="user-avatar">{user?.initials || 'U'}</div>
                <div className="user-info">
                    <div className="user-name">{user?.fullName || 'Пользователь'}</div>
                    <div className="user-role">{user?.roleName || 'Гость'}</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 