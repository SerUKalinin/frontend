import React from 'react';
import PropTypes from 'prop-types';
import './TasksSection.css';

const Task = ({ task, onView, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
        const colors = {
            'NEW': '#4361ee',
            'IN_PROGRESS': '#4895ef',
            'COMPLETED': '#4cc9f0',
            'EXPIRED': '#f72585'
        };
        return colors[status] || '#adb5bd';
    };

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                >
                    {task.status}
                </span>
            </div>
            <div className="task-card-body">
                <p>{task.description}</p>
                <div className="task-meta">
                    <div className="task-object">
                        <i className="fas fa-building"></i>
                        {task.objectName}
                    </div>
                    <div className="task-deadline">
                        <i className="fas fa-clock"></i>
                        {new Date(task.deadline).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="task-card-footer">
                <div className="task-assignee">
                    <div className="assignee-avatar">
                        {task.assignee?.initials || 'NA'}
                    </div>
                    <span>{task.assignee?.fullName || 'Не назначен'}</span>
                </div>
                <div className="task-actions">
                    <button 
                        className="action-btn view-btn"
                        onClick={() => onView(task)}
                    >
                        <i className="fas fa-eye"></i>
                    </button>
                    <button 
                        className="action-btn edit-btn"
                        onClick={() => onEdit(task)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button 
                        className="action-btn delete-btn"
                        onClick={() => onDelete(task.id)}
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

Task.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        objectName: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        assignee: PropTypes.shape({
            initials: PropTypes.string,
            fullName: PropTypes.string
        })
    }).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default Task; 