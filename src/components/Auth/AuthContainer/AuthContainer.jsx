import React from 'react';
import PropTypes from 'prop-types';
import './AuthContainer.css';

const AuthContainer = ({ children }) => {
    return (
        <div className="auth-form-container">
            {children}
        </div>
    );
};

AuthContainer.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthContainer; 