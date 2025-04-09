import React from 'react';
import PropTypes from 'prop-types';
import './AuthTabs.css';

const AuthTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="tabs" role="tablist">
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => onTabChange('login')}
            >
                Вход
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => onTabChange('register')}
            >
                Регистрация
            </button>
        </div>
    );
};

AuthTabs.propTypes = {
    activeTab: PropTypes.oneOf(['login', 'register', 'forgot']).isRequired,
    onTabChange: PropTypes.func.isRequired
};

export default AuthTabs; 