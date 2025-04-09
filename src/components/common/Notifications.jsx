import React from 'react';
import './Notifications.css';

const Notifications = ({ notifications, onRemove }) => {
    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div 
                    key={notification.id} 
                    className={`notification notification-${notification.type}`}
                >
                    <i className={`fas ${
                        notification.type === 'success' ? 'fa-check-circle' : 
                        notification.type === 'error' ? 'fa-exclamation-circle' :
                        'fa-info-circle'
                    }`}></i>
                    <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                    </div>
                    <button 
                        className="notification-close"
                        onClick={() => onRemove(notification.id)}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Notifications; 