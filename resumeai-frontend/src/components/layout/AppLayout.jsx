import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useUser as useUserHook } from '../../context/UserContext';
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

const BrandLogo = ({ isCollapsed, onClick }) => (
  <motion.div 
    layout
    className="sidebar-logo" 
    onClick={onClick}
    style={{ 
      marginBottom: 0, 
      padding: isCollapsed ? "0" : "0 1.5rem",
      justifyContent: isCollapsed ? "center" : "flex-start" 
    }}
  >
    <div className="logo-icon">RAI</div>
    {!isCollapsed && <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="logo-text">Resume<span>AI</span></motion.span>}
  </motion.div>
);

const AppLayout = ({ title, children, topbarRight }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const scrollRef = useRef(null);
  const notifRef = useRef(null);

  // Build display name
  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'User')
    : 'User';
  
  const displayEmail = user?.email || '';
  const userInitial = displayName.charAt(0).toUpperCase();

  const UserProfile = ({ collapsed = false }) => (
    <motion.div 
      className={`user-profile ${collapsed ? 'navbar-profile' : ''}`} 
      onClick={() => navigate('/profile')}
      style={{ cursor: 'pointer' }}
    >
      <div className="user-avatar">{userInitial}</div>
      {!collapsed && (
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span className="user-email">{displayEmail}</span>
        </div>
      )}
    </motion.div>
  );

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <motion.aside 
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div className="sidebar-branding">
          <BrandLogo isCollapsed={isCollapsed} onClick={() => navigate('/dashboard')} />
          <button className={`hamburger-btn ${isCollapsed ? 'collapsed-center' : 'mini'}`} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            )}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.name === 'Resume Builder' && location.pathname === '/builder');
            return (
              <motion.div 
                key={item.name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'centered' : ''}`}
                onClick={() => {
                  if (item.name === 'Resume Builder') navigate('/templates');
                  else navigate(item.path);
                }}
              >
                <div className="nav-item-content">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.icon}/>
                  </svg>
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              </motion.div>
            );
          })}
        </nav>

        {isCollapsed ? (
          <div className="sidebar-bottom collapsed">
            <button className="mini-logout-btn" onClick={handleLogout} title="Log Out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </button>
          </div>
        ) : (
          <div className="sidebar-bottom">
            <UserProfile />
            <motion.div whileHover={{ backgroundColor: "rgba(251, 113, 133, 0.15)" }} className="logout-btn" onClick={handleLogout}>
              Log Out
            </motion.div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <motion.div 
        className="app-main"
        initial={false}
        animate={{ paddingLeft: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Header */}
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
          <div className="header-left">
            <h1 className="header-title">{title}</h1>
          </div>
          
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
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              className="btn-upgrade"
              onClick={() => setShowProModal(true)}
            >
              Upgrade to Pro
            </motion.button>
            
            <div className="notif-wrapper" ref={notifRef} style={{ position: 'relative' }}>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="notification-bell"
                onClick={() => setShowNotif(!showNotif)}
              >
                <div className="bell-badge"></div>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </motion.div>
              
              <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="notif-panel"
                  >
                    <div className="notif-header">
                      <h3>Notifications</h3>
                      <button className="mark-read-btn">Mark all read</button>
                    </div>
                    <div className="notif-body">
                      {/* Placeholder notifications */}
                      <div className="notif-item unread">
                        <div className="notif-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>✨</div>
                        <div className="notif-content">
                          <p><strong>AI Ready!</strong> 3 tips for your resume.</p>
                          <span>2m ago</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile swapped to Navbar when collapsed */}
            {isCollapsed && <UserProfile collapsed={true} />}
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
      </motion.div>

      {/* Upgrade Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="modal-backdrop" onClick={() => setShowProModal(false)}>
            <motion.div 
              className="pro-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setShowProModal(false)}>✕</button>
              <div className="pro-modal-header">
                <div className="pro-badge">PRO</div>
                <h2>Unlock Your Potential</h2>
                <p>Get hired faster with AI analysis.</p>
              </div>
              <div className="pro-plans">
                <div className="plan-card featured">
                  <h3>Pro Plan</h3>
                  <div className="plan-price">$9<span>/mo</span></div>
                  <button className="plan-btn upgrade" onClick={() => setShowProModal(false)}>Upgrade Now</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
