import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordField.css';

const PasswordField = ({ 
    label,
    id,
    value,
    onChange,
    required,
    disabled,
    placeholder = "Enter password"
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-input-container">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
            )}
            <div className="input-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    className="form-input"
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordField; 