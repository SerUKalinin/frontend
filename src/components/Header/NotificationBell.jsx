import React, { useState } from 'react';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notificationCount, setNotificationCount] = useState(3);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="notification-container">
            <button 
                className="notification-bell" 
                onClick={toggleNotifications}
                title="Уведомления"
            >
                <i className="fas fa-bell"></i>
                {notificationCount > 0 && (
                    <span className="notification-badge">
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Уведомления</h3>
                        {notificationCount > 0 && (
                            <button 
                                className="mark-all-read"
                                onClick={() => setNotificationCount(0)}
                            >
                                Отметить все как прочитанные
                            </button>
                        )}
                    </div>
                    <div className="notifications-list">
                        {notificationCount === 0 ? (
                            <div className="no-notifications">
                                Нет новых уведомлений
                            </div>
                        ) : (
                            // Здесь будет список уведомлений
                            <div className="notification-item">
                                <i className="fas fa-info-circle"></i>
                                <div className="notification-content">
                                    <p>Пример уведомления</p>
                                    <span className="notification-time">2 мин. назад</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell; 