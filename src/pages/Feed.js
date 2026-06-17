import { useNavigate } from 'react-router-dom';
import AddPost from '../components/AddPost';
import EditPost from '../components/EditPost';
import MyPosts from '../components/MyPosts';
import PostMenu from '../components/PostMenu';

function Feed({
  username,
  isDark,
  toggleTheme,
  posts,
  loading,
  searchQuery,
  setSearchQuery,
  expandedPost,
  toggleComments,
  commentText,
  setCommentText,
  handleAddComment,
  handleToggleLike,
  handleDeletePost,
  setEditingPost,
  editingPost,
  fetchPostsForUser,
  showMyPosts,
  setShowMyPosts,
  handleLogout,
  submittingComment,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">📝 مدونتي</h1>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} title="تغيير المظهر">
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              className="edit-profile-btn"
              onClick={() => navigate(`/profile/${username}`)}
              title="صفحة البروفايل"
            >
              👤
            </button>

            <span className="welcome">مرحباً {username}</span>
            <button className="my-posts-btn" onClick={() => setShowMyPosts(true)}>
              📚 منشوراتي
            </button>
            <button className="logout-btn" onClick={handleLogout}>خروج</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>جاري تحميل المنشورات...</p>
          </div>
        ) : (
          <>
            <AddPost onPostAdded={() => fetchPostsForUser(username, 1)} />

            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 ابحث في المنشورات..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="posts-header">
              <h2>المنشورات الأخيرة</h2>
              <p className="posts-count">إجمالي المنشورات: {posts.length}</p>
            </div>

            {posts.length === 0 ? (
              <div className="no-posts">
                <p>📭 لا توجد منشورات</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map((post) => (
                  <article key={post.id} className="post-card">
                    {/* Post Image */}
                    {post.image && (
                      <div className="post-image">
                        <img
                          src={
                            post.image.startsWith('http')
                              ? post.image
                              : `https://blog-api-d3u7.onrender.com${post.image}`
                          }
                          alt={post.title}
                        />
                      </div>
                    )}

                    {/* Post Header */}
                    <div className="post-header">
                      <PostMenu
                        postId={post.id}
                        isOwner={post.author.username === username}
                        onEdit={() => setEditingPost(post)}
                        onDelete={() => handleDeletePost(post.id)}
                      />

                      <div className="author-info">
                        <div className="avatar">
  {post.author.avatar_url ? (
    <img 
      src={post.author.avatar_url} 
      alt={post.author.username}
      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    post.author.username.charAt(0).toUpperCase()
  )}
</div>
                        <div>
                          <a
                            href={`/profile/${post.author.username}`}
                            className="author-name-link"
                          >
                            {post.author.username}
                          </a>
                          <p className="post-date">
                            {new Date(post.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="post-content">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                    </div>

                    {/* Post Actions */}
                    <div className="post-actions">
                      <div className="post-actions-left">
                        <button
                          className={`like-btn ${post.is_liked ? 'liked' : ''}`}
                          onClick={() => handleToggleLike(post.id, post.is_liked)}
                        >
                          {post.is_liked ? '❤️' : '🤍'} <span>{post.likes_count || 0}</span>
                        </button>

                        <button
                          className="comments-btn"
                          onClick={() => toggleComments(post.id)}
                        >
                          💬 <span>{post.comments?.length || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedPost === post.id && (
                      <div className="comments-section">
                        <div className="comments-header">
                          <h4>التعليقات ({post.comments?.length || 0})</h4>
                        </div>

                        {post.comments && post.comments.length > 0 ? (
                          <div className="comments-list">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="comment">
                                <div className="comment-author">
                                  <span className="comment-author-name">
                                    {comment.author.username}
                                  </span>
                                  <span className="comment-date">
                                    {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                                  </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-comments">لا توجد تعليقات حتى الآن</p>
                        )}

                        {/* Add Comment Form */}
                        <div className="add-comment-form">
                          <input
                            type="text"
                            placeholder="أضف تعليقك هنا..."
                            className="comment-input"
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText({
                              ...commentText,
                              [post.id]: e.target.value
                            })}
                            disabled={submittingComment}
                          />
                          <button
                            className="submit-comment-btn"
                            onClick={() => handleAddComment(post.id)}
                            disabled={submittingComment}
                          >
                            {submittingComment ? 'جاري الإرسال...' : 'إرسال'}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  السابق ›
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-num ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ‹ التالي
                </button>
              </div>
            )}

            {editingPost && (
              <EditPost
                post={editingPost}
                onPostUpdated={() => fetchPostsForUser(username, currentPage)}
                onClose={() => setEditingPost(null)}
              />
            )}

            {showMyPosts && (
              <MyPosts
                username={username}
                onClose={() => setShowMyPosts(false)}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 مدونتي - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export default Feed;