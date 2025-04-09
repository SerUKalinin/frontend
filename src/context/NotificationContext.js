import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((type, title, message) => {
        const id = Date.now();
        const notification = {
            id,
            type,
            title,
            message
        };

        setNotifications(prev => [...prev, notification]);

        // Автоматически удаляем уведомление через 5 секунд
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const value = {
        notifications,
        showNotification,
        removeNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="notifications-container">
                {notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`notification ${notification.type}`}
                    >
                        <div className="notification-header">
                            <h4>{notification.title}</h4>
                            <button 
                                onClick={() => removeNotification(notification.id)}
                                className="close-btn"
                            >
                                ×
                            </button>
                        </div>
                        <p>{notification.message}</p>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}; 