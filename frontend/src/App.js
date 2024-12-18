import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import PostForm from './components/blog/PostForm';
import { logout } from './services/auth';

const Navigation = () => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white font-bold text-xl">
            Blog App
          </Link>
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          {user && (
            <Link to="/create-post" className="text-gray-300 hover:text-white">
              Create Post
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const [posts, setPosts] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts${selectedCategory ? `?category=${selectedCategory}` : ''}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="mb-6">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {/* Add categories dynamically based on your data */}
          <option value="tech">Tech</option>
          <option value="news">News</option>
          <option value="tutorial">Tutorial</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>{post.date}</span>
            </div>
            {post.categories && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/create-post" element={<PostForm />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
