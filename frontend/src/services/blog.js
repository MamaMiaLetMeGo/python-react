import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add auth header to requests
axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const getPosts = async (category = null) => {
    try {
        const url = category ? `${API_URL}/posts?category=${category}` : `${API_URL}/posts`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch posts';
    }
};

export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create post';
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await axios.put(`${API_URL}/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update post';
    }
};

export const deletePost = async (postId) => {
    try {
        await axios.delete(`${API_URL}/posts/${postId}`);
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete post';
    }
};

export const addComment = async (postId, content) => {
    try {
        const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to add comment';
    }
};
