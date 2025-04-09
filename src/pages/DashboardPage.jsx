import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './DashboardPage.css';

// Переименовываем и используем useNavigate для выхода
function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('Dashboard mounted, auth status:', isAuthenticated);
    console.log('JWT token:', localStorage.getItem('jwt'));
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/auth', { replace: true }); // Переходим на страницу входа
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Личный кабинет</h1>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Добро пожаловать!</h2>
          <p>Вы успешно вошли в систему.</p>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage; 