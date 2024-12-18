import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to login';
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to register';
    }
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
