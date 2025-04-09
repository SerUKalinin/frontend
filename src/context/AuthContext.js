import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwt'));

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            loadUserData(token);
        } else {
            // For development only - remove in production
            const testToken = 'test-token';
            localStorage.setItem('jwt', testToken);
            setJwtToken(testToken);
            
            const testUser = {
                id: '1',
                username: 'Тестовый Пользователь',
                email: 'test@example.com',
                firstName: 'Тестовый',
                lastName: 'Пользователь',
                roles: 'ROLE_ADMIN',
                active: true
            };
            localStorage.setItem('user', JSON.stringify(testUser));
            setUser(testUser);
        }
        setLoading(false);
    }, []);

    const loadUserData = async (token) => {
        try {
            const response = await fetch("http://localhost:8080/users/info", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }

            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error loading user data:', error);
            logout();
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }

            const data = await response.json();
            localStorage.setItem('jwt', data.token);
            setJwtToken(data.token);
            await loadUserData(data.token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (jwtToken) {
                await fetch("http://localhost:8080/auth/logout", {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            setJwtToken(null);
            setUser(null);
        }
    };

    const updateUserProfile = async (userData) => {
        try {
            // Здесь должен быть реальный API-запрос
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления профиля');
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            throw error;
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            jwtToken,
            isAdmin: user?.roles === 'ROLE_ADMIN',
            isAuthenticated: !!user,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
}; 