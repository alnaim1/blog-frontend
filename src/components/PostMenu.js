import { useState, useRef, useEffect } from 'react';
import '../styles/PostMenu.css';

function PostMenu({ postId, isOwner, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOwner) return null;

  return (
    <div className="post-menu-container" ref={menuRef}>
      <button 
        className="menu-trigger"
        onClick={() => setShowMenu(!showMenu)}
        title="خيارات"
      >
        ⋮
      </button>
      
      {showMenu && (
        <div className="menu-dropdown">
          <button 
            className="menu-item edit"
            onClick={() => {
              onEdit();
              setShowMenu(false);
            }}
          >
            <span>تعديل</span>
            <span>✏️</span>
          </button>
          <button 
            className="menu-item delete"
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
          >
            <span>حذف</span>
            <span>🗑️</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PostMenu;