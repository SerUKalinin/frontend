import React from 'react';
import { FaHome, FaTasks, FaClock } from 'react-icons/fa';
import './StatisticCard.css';

const StatisticCard = ({ title, count, description, updateText, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'properties':
                return <FaHome className="card-icon properties" />;
            case 'active-tasks':
                return <FaTasks className="card-icon active" />;
            case 'overdue-tasks':
                return <FaClock className="card-icon overdue" />;
            default:
                return null;
        }
    };

    return (
        <div className="statistic-card">
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                {getIcon()}
            </div>
            <div className="card-content">
                <div className="card-count">{count}</div>
                <p className="card-description">{description}</p>
            </div>
            <div className="card-footer">
                <span className="update-text">{updateText}</span>
                <button className="details-button">
                    <span className="arrow-icon">→</span>
                </button>
            </div>
        </div>
    );
};

export default StatisticCard;
