import React, { useState } from 'react';
import { createPost } from '../../services/blog';

const PostForm = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const categoriesList = categories
                .split(',')
                .map(cat => cat.trim())
                .filter(cat => cat.length > 0);

            const newPost = await createPost({
                title,
                content,
                categories: categoriesList
            });
            
            setTitle('');
            setContent('');
            setCategories('');
            setError('');
            
            if (onPostCreated) {
                onPostCreated(newPost);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        rows="6"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Categories (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="tech, news, tutorial"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default PostForm;
