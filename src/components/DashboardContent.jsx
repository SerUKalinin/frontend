import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TasksSection from './Tasks/TasksSection';
import ObjectsSection from './Objects/ObjectsSection';
import './DashboardContent.css';

const DashboardContent = () => {
    const { jwtToken, user } = useAuth();
    const { showNotification } = useNotification();
    const [objects, setObjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jwtToken && user) {
            loadData();
        }
    }, [jwtToken, user]);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadObjects(),
                loadTasks()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showNotification('Ошибка при загрузке данных', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadObjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/objects', {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load objects');
            }

            const data = await response.json();
            setObjects(data);
        } catch (error) {
            console.error('Error loading objects:', error);
            throw error;
        }
    };

    const loadTasks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
            throw error;
        }
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="dashboard-content">
            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <ObjectsSection 
                        objects={objects} 
                        onObjectsChange={loadObjects} 
                    />
                </div>
                <div className="dashboard-section">
                    <TasksSection 
                        tasks={tasks} 
                        onTasksChange={loadTasks}
                        objects={objects}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardContent; 