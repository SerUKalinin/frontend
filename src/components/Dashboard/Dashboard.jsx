import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import DashboardContent from './DashboardContent';
import ObjectsSection from '../Objects/ObjectsSection';
import TasksSection from '../Tasks/TasksSection';
import ProfileSection from '../Profile/ProfileSection';
import UsersSection from '../Users/UsersSection';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const { showNotification } = useNotification();

    useEffect(() => {
        console.log('Dashboard mounted');
        console.log('Current user:', user);
        console.log('Active section:', activeSection);

        // Тестовое уведомление при монтировании
        showNotification('info', 'Добро пожаловать', 'Вы успешно вошли в систему');
    }, []);

    const renderContent = () => {
        console.log('Rendering content for section:', activeSection);
        
        if (!user) {
            return (
                <div className="auth-required">
                    <h2>Требуется авторизация</h2>
                    <p>Пожалуйста, войдите в систему</p>
                </div>
            );
        }

        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent searchQuery={searchQuery} />;
            case 'objects':
                return <ObjectsSection searchQuery={searchQuery} />;
            case 'tasks':
                return <TasksSection searchQuery={searchQuery} />;
            case 'profile':
                return <ProfileSection />;
            case 'users':
                return (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') ? (
                    <UsersSection searchQuery={searchQuery} />
                ) : (
                    <div className="access-denied">
                        <h2>Доступ запрещен</h2>
                        <p>У вас нет прав для просмотра этого раздела</p>
                    </div>
                );
            default:
                return <DashboardContent searchQuery={searchQuery} />;
        }
    };

    return (
        <div className="dashboard">
            <Sidebar 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
                userRole={user?.role}
            />
            <div className="dashboard-content">
                <Header 
                    onSearch={setSearchQuery}
                    user={user}
                />
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard; 