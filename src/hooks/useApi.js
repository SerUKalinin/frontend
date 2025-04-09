import { useState, useCallback } from 'react';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwt');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            };

            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('jwt');
                    window.location.href = '/auth';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url) => {
        return request(url);
    }, [request]);

    const post = useCallback((url, data) => {
        return request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }, [request]);

    const put = useCallback((url, data) => {
        return request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }, [request]);

    const del = useCallback((url) => {
        return request(url, {
            method: 'DELETE'
        });
    }, [request]);

    return {
        loading,
        error,
        get,
        post,
        put,
        del
    };
};

export default useApi; 