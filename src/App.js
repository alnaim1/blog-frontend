import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './api';
import Login from './components/Login';
import './App.css';
import { ThemeContext } from './context/ThemeContext';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

function AppContent() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
      fetchPostsForUser(user, 1);
    }
  }, []);

  const fetchPostsForUser = async (currentUser, page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/?page=${page}`);

      const allPosts = (response.data.results || response.data).map(post => ({
        ...post,
        comments: post.comments || [],
        image: post.image || null
      }));

      const userPosts = allPosts.filter(
        post => post.author.username === currentUser
      );

      setPosts(userPosts);
      setCurrentPage(page);

      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 5));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleAddComment = async (postId) => {
    const content = commentText[postId]?.trim();

    if (!content) {
      alert('الرجاء كتابة تعليق');
      return;
    }

    setSubmittingComment(true);

    try {
      await api.post('/comments/', {
        post: postId,
        content: content
      });

      await fetchPostsForUser(username, currentPage);

      setCommentText({
        ...commentText,
        [postId]: ''
      });

      if (expandedPost !== postId) {
        setExpandedPost(postId);
      }

      alert('تم إضافة التعليق بنجاح');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('خطأ في إضافة التعليق');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleLike = async (postId, isLiked) => {
    try {
      await api.post('/likes/toggle_like/', { post_id: postId });
      await fetchPostsForUser(username, currentPage);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('خطأ في الإعجاب');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      try {
        await api.delete(`/posts/${postId}/`);
        await fetchPostsForUser(username, currentPage);
        alert('تم حذف المنشور بنجاح');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('خطأ في حذف المنشور');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.username.toLowerCase().includes(query)
    );
  });

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username'));
      fetchPostsForUser(localStorage.getItem('username'), 1);
    }} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Feed
            username={username}
            isDark={isDark}
            toggleTheme={toggleTheme}
            posts={filteredPosts}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedPost={expandedPost}
            toggleComments={toggleComments}
            commentText={commentText}
            setCommentText={setCommentText}
            handleAddComment={handleAddComment}
            handleToggleLike={handleToggleLike}
            handleDeletePost={handleDeletePost}
            setEditingPost={setEditingPost}
            editingPost={editingPost}
            fetchPostsForUser={fetchPostsForUser}
            showMyPosts={showMyPosts}
            setShowMyPosts={setShowMyPosts}
            handleLogout={handleLogout}
            submittingComment={submittingComment}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchPostsForUser(username, page)}
          />
        }
      />
      <Route
        path="/profile/:username"
        element={<Profile />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;