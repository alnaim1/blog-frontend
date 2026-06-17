import { useState } from 'react';
import api from '../api';
import '../styles/Auth.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await api.post('/auth/register/', { username, password });
        alert('تم التسجيل بنجاح! الآن سجّل دخول');
        setIsSignUp(false);
        setUsername('');
        setPassword('');
      } else {
        const response = await api.post('/token/', { username, password });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('username', username);
        onLoginSuccess();
      }
    } catch (err) {
      setError(isSignUp ? 'خطأ في التسجيل' : 'خطأ في بيانات الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'جاري...' : (isSignUp ? 'إنشاء حساب' : 'دخول')}
        </button>

        <p className="auth-toggle">
          {isSignUp ? 'عندك حساب؟ ' : 'ما عندك حساب؟ '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setUsername('');
              setPassword('');
            }}
          >
            {isSignUp ? 'سجّل دخول' : 'أنشئ حساب'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;