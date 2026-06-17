import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/UserProfile.css';

function UserProfile({ userId, username, onClose }) {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // الحصول على منشورات المستخدم
      const response = await api.get('/posts/');
      const posts = (response.data.results || response.data).filter(
        post => post.author.username === username
      );
      setUserPosts(posts);
      
      // معلومات المستخدم
      if (posts.length > 0) {
        setUserInfo(posts[0].author);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalComments = userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

  return (
    <div className="profile-modal">
      <div className="profile-content">
        <div className="profile-header">
          <h2>{username}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p className="loading">جاري التحميل...</p>
        ) : (
          <>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{userPosts.length}</span>
                <span className="stat-label">منشورات</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalComments}</span>
                <span className="stat-label">تعليقات</span>
              </div>
            </div>

            <div className="profile-posts">
              <h3>منشورات {username}</h3>
              {userPosts.length === 0 ? (
                <p className="no-posts">لا توجد منشورات</p>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="profile-post-item">
                    <h4>{post.title}</h4>
                    <p>{post.content.substring(0, 100)}...</p>
                    <small>{new Date(post.created_at).toLocaleDateString('ar-SA')}</small>
                    <span className="comments-count">💬 {post.comments?.length || 0}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;