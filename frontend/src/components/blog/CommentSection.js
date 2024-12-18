import React, { useState } from 'react';
import { addComment } from '../../services/blog';
import { useAuth } from '../../contexts/AuthContext';

const CommentSection = ({ postId, comments, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newComment = await addComment(postId, content);
            setContent('');
            setError('');
            if (onCommentAdded) {
                onCommentAdded(newComment);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Please login to comment.</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        rows="3"
                        placeholder="Write a comment..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Add Comment
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments && comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{comment.content}</p>
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">{comment.author}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
