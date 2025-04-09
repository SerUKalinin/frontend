import React from 'react';
import './InputField.css';

const InputField = ({ 
    label, 
    type = 'text', 
    id, 
    value, 
    onChange, 
    required = false, 
    disabled = false,
    ...props 
}) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className="form-input"
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                {...props}
            />
        </div>
    );
};

export default InputField; 