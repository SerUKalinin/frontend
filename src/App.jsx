import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/global.css';
import './styles/notifications.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <Dashboard />
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
