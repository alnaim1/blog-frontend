import { useState, useEffect } from 'react';
import api from '../api';
import EditProfile from './EditProfile';
import '../styles/UserProfilePage.css';

function UserProfilePage({ username, onClose }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [bio, setBio] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
const [currentAvatar, setCurrentAvatar] = useState(null);
  const currentUser = localStorage.getItem('username');
  const isOwner = currentUser === username;

  useEffect(() => {
    fetchUserData();
    fetchBio();
  }, [username]);

  const fetchBio = async () => {
    try {
      const response = await api.get('/profiles/my_profile/');
      setBio(response.data.bio || '');
      setCurrentAvatar(response.data.avatar_url || null);
    } catch (err) {
      console.error('Error fetching bio:', err);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/');
      const allPosts = (response.data.results || response.data).map(post => ({
        ...post,
        comments: post.comments || []
      }));

      const userPosts = allPosts.filter(
        post => post.author.username === username
      );

      if (userPosts.length > 0) {
        setUser(userPosts[0].author);
      } else {
        setUser({ username });
      }
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleAddComment = async (postId) => {
    const content = commentText[postId]?.trim();
    if (!content) { alert('الرجاء كتابة تعليق'); return; }
    try {
      await api.post('/comments/', { post: postId, content });
      await fetchUserData();
      setCommentText({ ...commentText, [postId]: '' });
      alert('تم إضافة التعليق بنجاح');
    } catch (error) {
      alert('خطأ في إضافة التعليق');
    }
  };

  if (loading) {
    return <div className="loading-spinner">جاري التحميل...</div>;
  }

  if (!user) {
    return <div className="no-data">لا توجد بيانات</div>;
  }

  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-cover">
        {isOwner && (
          <button
            className="edit-profile-page-btn"
            onClick={() => setShowEditProfile(true)}
          >
            ✏️ تعديل الملف الشخصي
          </button>
        )}
      </div>

      <div className="profile-info">
        <div className="profile-avatar">
  {currentAvatar ? (
    <img src={currentAvatar} alt={user.username} className="avatar-image" />
  ) : (
    user.username.charAt(0).toUpperCase()
  )}
</div>
        <div className="profile-details">
          <h2>{user.username}</h2>
          <p className="profile-email">{user.email || 'لا يوجد بريد إلكتروني'}</p>
          {/* السيرة الذاتية */}
          {isOwner && bio && (
            <p className="profile-bio">{bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{posts.length}</span>
          <span className="stat-label">منشورات</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{totalComments}</span>
          <span className="stat-label">تعليقات</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {posts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
          </span>
          <span className="stat-label">إعجابات</span>
        </div>
      </div>

      {/* Posts */}
      <div className="profile-posts">
        <h3>منشورات {user.username}</h3>
        {posts.length === 0 ? (
          <div className="no-posts-message"><p>لا توجد منشورات حتى الآن</p></div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post.id} className="profile-post-card">
                {post.image && (
                  <div className="post-card-image">
                    <img
                      src={post.image.startsWith('http') ? post.image : `https://blog-api-d3u7.onrender.com${post.image}`}
                      alt={post.title}
                    />
                  </div>
                )}
                <div className="post-card-content">
                  <h4>{post.title}</h4>
                  <p>{post.content.substring(0, 150)}...</p>
                  <small>{new Date(post.created_at).toLocaleDateString('ar-SA')}</small>
                </div>
                <div className="post-card-stats">
                  <span>❤️ {post.likes_count || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
                <button className="toggle-comments-btn" onClick={() => toggleComments(post.id)}>
                  {expandedPost === post.id ? 'إخفاء التعليقات' : 'عرض التعليقات'}
                </button>
                {expandedPost === post.id && (
                  <div className="post-comments">
                    {post.comments?.length > 0 ? (
                      <div className="comments-list">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                              <strong>{comment.author.username}</strong>
                              <small>{new Date(comment.created_at).toLocaleDateString('ar-SA')}</small>
                            </div>
                            <p>{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-comments">لا توجد تعليقات</p>
                    )}
                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="أضف تعليقك..."
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      />
                      <button onClick={() => handleAddComment(post.id)}>إرسال</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          username={username}
          onClose={() => {
            setShowEditProfile(false);
            fetchBio(); // تحديث البيو بعد التعديل
          }}
        />
      )}
    </div>
  );
}

export default UserProfilePage;