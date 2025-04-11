import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'error', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Автоматическое закрытие через 5 секунд

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <span className="notification-message">{message}</span>
                <button className="notification-close" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification; 