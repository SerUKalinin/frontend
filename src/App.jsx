import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AuthPage from './pages/AuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordForm from './components/ResetPassword/ResetPasswordForm';
import { useAuth } from './hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Notification from './components/common/Notification';

// Компонент для защиты роутов
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, error } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
}

// Компонент для редиректа, если пользователь уже залогинен
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function ResetPasswordRoute({ children }) {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  return token ? children : <Navigate to="/auth" />;
}

function App() {
  const { error } = useAuth();
  const [showNotification, setShowNotification] = useState(false);

  React.useEffect(() => {
    if (error) {
      setShowNotification(true);
    }
  }, [error]);

  return (
    <>
      <Routes>
        {/* Корневой путь: редирект на дашборд если залогинен, иначе на /auth */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Роуты, доступные только НЕ аутентифицированным пользователям */}
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
        <Route path="/reset-password" element={<ResetPasswordRoute><ResetPasswordForm /></ResetPasswordRoute>} />

        {/* Защищенный роут дашборда */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Роут 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {showNotification && error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
}

export default App;
