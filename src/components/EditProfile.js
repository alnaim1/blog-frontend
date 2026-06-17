import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/EditProfile.css';

function EditProfile({ username, onClose }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/my_profile/');
      setBio(response.data.bio || '');
      setCurrentAvatar(response.data.avatar_url || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setError('الرجاء اختيار صورة');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await api.post('/profiles/upload_avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentAvatar(response.data.avatar_url);
      setAvatarPreview(null);
      setAvatarFile(null);
      setSuccess('تم رفع الصورة بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('خطأ في رفع الصورة');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/profiles/update_profile/', { bio });
      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      await api.put('/profiles/change_password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setSuccess('تم تغيير كلمة المرور بنجاح');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('كلمة المرور القديمة غير صحيحة');
      } else {
        setError('خطأ في تغيير كلمة المرور');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-content">
        <div className="profile-header">
          <h2>تعديل الملف الشخصي</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
            onClick={() => setActiveTab('avatar')}
          >
            🖼️ الصورة الشخصية
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 البيانات الشخصية
          </button>
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 تغيير كلمة المرور
          </button>
        </div>

        <div className="profile-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* تبويب الصورة */}
          {activeTab === 'avatar' && (
            <div className="avatar-tab">
              <div className="current-avatar">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="الصورة الحالية" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {avatarPreview && (
                <div className="avatar-preview">
                  <p>معاينة الصورة الجديدة:</p>
                  <img src={avatarPreview} alt="معاينة" className="avatar-img" />
                </div>
              )}

              <div className="avatar-upload">
                <label className="upload-label">
                  📁 اختر صورة
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <small>الحد الأقصى 5MB - JPG, PNG, GIF</small>
              </div>

              {avatarFile && (
                <button
                  className="submit-btn"
                  onClick={handleUploadAvatar}
                  disabled={loading}
                >
                  {loading ? 'جاري الرفع...' : '⬆️ رفع الصورة'}
                </button>
              )}
            </div>
          )}

          {/* تبويب البيانات */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input
                  type="text"
                  value={username}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>السيرة الذاتية</label>
                <textarea
                  placeholder="اكتب نبذة عنك..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="5"
                  maxLength="500"
                ></textarea>
                <small>{bio.length}/500</small>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </form>
          )}

          {/* تبويب كلمة المرور */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>كلمة المرور القديمة</label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الحالية"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;