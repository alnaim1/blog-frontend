import { useState } from 'react';
import api from '../api';
import '../styles/AddPost.css';

function AddPost({ onPostAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await api.post('/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
      alert('تم إضافة المنشور بنجاح');
      onPostAdded();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('خطأ في إضافة المنشور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="add-post-btn"
        onClick={() => setShowForm(!showForm)}
      >
        ✏️ كتابة منشور جديد
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-post-form">
          <input
            type="text"
            placeholder="عنوان المنشور"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="محتوى المنشور"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            required
          ></textarea>

          <div className="image-upload">
            <label htmlFor="image-input" className="image-label">
              📷 اختر صورة (اختياري)
            </label>
            <input
              id="image-input"
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
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'جاري الإرسال...' : 'نشر المنشور'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowForm(false);
                setTitle('');
                setContent('');
                setImage(null);
                setImagePreview(null);
              }}
              className="cancel-btn"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default AddPost;