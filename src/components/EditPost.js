import { useState } from 'react';
import api from '../api';
import '../styles/EditPost.css';

function EditPost({ post, onPostUpdated, onClose }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.image ? `https://blog-api-d3u7.onrender.com${post.image}` : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('الرجاء ملء جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await api.put(`/posts/${post.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onPostUpdated();
      onClose();
      alert('تم تحديث المنشور بنجاح');
    } catch (err) {
      setError('خطأ في تحديث المنشور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-post-modal">
      <div className="edit-post-content">
        <div className="form-header">
          <h3>تعديل المنشور</h3>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-post-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label>العنوان</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>المحتوى</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="edit-image" className="image-label">
              📷 اختر صورة جديدة (اختياري)
            </label>
            <input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="معاينة الصورة" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="cancel-btn"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;