import { useState, useEffect } from 'react';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Токен не найден');
                }

                const response = await fetch('http://localhost:8080/users/info', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении информации о пользователе');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при получении информации о пользователе:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return { userInfo, loading, error };
}; 