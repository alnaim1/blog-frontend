import { useEffect, useState } from 'react';
import api from '../api';
import '../styles/MyPosts.css';

function MyPosts({ username, onClose }) {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/');
      const userPosts = response.data.results.filter(post => post.author.username === username);
      setMyPosts(userPosts);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-posts-modal">
      <div className="my-posts-content">
        <div className="modal-header">
          <h3>منشوراتي</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p className="loading-text">جاري التحميل...</p>
        ) : myPosts.length === 0 ? (
          <p className="no-posts-text">لا توجد منشورات</p>
        ) : (
          <div className="my-posts-list">
            {myPosts.map((post) => (
              <div key={post.id} className="my-post-item">
                <h4>{post.title}</h4>
                <p>{post.content.substring(0, 100)}...</p>
                <small>{new Date(post.created_at).toLocaleDateString('ar-SA')}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;