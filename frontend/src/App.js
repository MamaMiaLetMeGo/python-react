import { useState, useEffect } from 'react';

// Define the API base URL
const API_URL = 'http://127.0.0.1:5000';

const BlogPost = ({ post }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
    <p className="text-gray-600 mb-4">{post.content}</p>
    <div className="text-sm text-gray-500">
      Posted by {post.author} on {post.date}
    </div>
  </div>
);

const NewPostForm = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
          className="w-full p-2 border rounded h-32"
          required
        />
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-4 py-2 rounded`}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Fetching posts from:', `${API_URL}/api/posts`);
    fetch(`${API_URL}/api/posts`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
      })
      .then(data => {
        console.log('Received posts:', data);
        setPosts(data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts: ' + error.message);
      });
  }, []);

  const handleNewPost = async (postData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
    } catch (error) {
      setError('Failed to create post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Blog</h1>
        
        <NewPostForm onSubmit={handleNewPost} isSubmitting={isSubmitting} />
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {posts.map(post => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;