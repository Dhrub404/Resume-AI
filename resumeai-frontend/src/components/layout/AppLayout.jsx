import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '../../utils/motionVariants';
import '../../styles/layout.css';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const AppLayout = ({ title, children, topbarRight }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      setIsScrolled(scrollRef.current.scrollTop > 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
    { name: 'Resume Builder', path: '/builder', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 3.5L18.5 9H13V3.5zM6 20V4h6v6h6v10H6z' },
    { name: 'ATS Analysis', path: '/analysis', icon: 'M5 20h2V10H5v10zm6 0h2V4h-2v16zm6 0h2v-8h-2v8z' },
  ];

  // Build display name with multiple fallbacks — NEVER shows "Loading..."
  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'User')
    : 'User';
  
  const displayEmail = user?.email || '';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-icon">RAI</div>
          <span className="logo-text">Resume<span>AI</span></span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.name === 'Resume Builder' && location.pathname === '/builder');
            return (
              <motion.div 
                key={item.name}
                whileHover={{ x: 4, backgroundColor: !isActive ? "rgba(255, 255, 255, 0.05)" : "transparent" }}
                whileTap={{ scale: 0.97 }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.name === 'Resume Builder') navigate('/templates');
                  else navigate(item.path);
                }}
              >
                {isActive && (
                  <>
                    <motion.div layoutId="nav-bg" className="nav-active-bg" initial={false} transition={{ type: "spring", damping: 22, stiffness: 250 }} />
                    <motion.div layoutId="nav-indicator" className="nav-active-indicator" initial={false} transition={{ type: "spring", damping: 22, stiffness: 250 }} />
                  </>
                )}
                <div className="nav-item-content">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.icon}/>
                  </svg>
                  <span>{item.name}</span>
                </div>
              </motion.div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">{userInitial}</div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{displayEmail}</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ backgroundColor: "rgba(251, 113, 133, 0.15)" }} whileTap={{ scale: 0.96 }} className="logout-btn" onClick={handleLogout}>
            Log Out
          </motion.div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        {/* Header */}
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
          <h1 className="header-title">{title}</h1>
          <div className="header-actions">
            {topbarRight}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-upgrade">Upgrade to Pro</motion.button>
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} className="notification-bell">
              <div className="bell-badge"></div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </motion.div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content" ref={scrollRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
