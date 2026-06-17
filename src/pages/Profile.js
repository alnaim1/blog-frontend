import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserProfilePage from '../components/UserProfilePage';
import { ThemeContext } from '../context/ThemeContext';

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const currentUser = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

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
              className="back-btn"
              onClick={() => navigate('/')}
              title="رجوع للصفحة الرئيسية"
            >
              ← رجوع
            </button>

            <span className="welcome">مرحباً {currentUser}</span>
            <button className="logout-btn" onClick={handleLogout}>خروج</button>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="container">
        <UserProfilePage 
          username={username}
          onClose={() => navigate('/')}
        />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 مدونتي - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export default Profile;