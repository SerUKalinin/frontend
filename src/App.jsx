import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ObjectsPage from './pages/ObjectsPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import ResetPasswordForm from './components/ResetPassword/ResetPasswordForm';
import Layout from './components/Layout/Layout';
import { useAuth } from './hooks/useAuth';
import { useLocation } from 'react-router-dom';

// Компонент для защиты роутов
function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/dashboard" />;
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
  return (
    <Routes>
      {/* Корневой путь: редирект на дашборд если залогинен, иначе на /auth */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Роуты, доступные только НЕ аутентифицированным пользователям */}
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPasswordRoute><ResetPasswordForm /></ResetPasswordRoute>} />

      {/* Защищенные роуты внутри Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/objects" element={<ObjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Роут 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
