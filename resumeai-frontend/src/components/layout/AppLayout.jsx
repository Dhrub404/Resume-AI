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

const BrandLogo = ({ className = "", onClick }) => (
  <motion.div 
    layoutId="main-logo"
    className={`sidebar-logo ${className}`} 
    onClick={onClick}
    style={{ marginBottom: 0, padding: 0 }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
  >
    <div className="logo-icon">RAI</div>
    <span className="logo-text">Resume<span>AI</span></span>
  </motion.div>
);

const ToggleBtn = ({ isOpen, onClick }) => (
  <motion.button 
    layoutId="hamburger-toggle"
    className="hamburger-btn"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <motion.path
        animate={{ d: isOpen ? "M12 5l-7 7" : "M4 6h16" }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        animate={{ d: isOpen ? "M5 12h14" : "M4 12h16" }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        animate={{ d: isOpen ? "M12 19l-7-7" : "M4 18h16" }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  </motion.button>
);

const AppLayout = ({ title, children, topbarRight }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const scrollRef = useRef(null);
  const notifRef = useRef(null);

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

  // Build display name with multiple fallbacks — NEVER shows "Loading..."
  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'User')
    : 'User';
  
  const displayEmail = user?.email || '';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <motion.aside 
        className="app-sidebar"
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : '-100%',
          opacity: 1 // Keep opacity 1 so it doesn't fade while sliding out
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="sidebar-branding">
          {isSidebarOpen && (
            <>
              <BrandLogo onClick={() => navigate('/dashboard')} />
              <ToggleBtn isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
            </>
          )}
        </div>
        <nav className="sidebar-nav" style={{ paddingTop: '1rem' }}>
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
      </motion.aside>

      {/* Main Content Area */}
      <motion.div 
        className="app-main"
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? '260px' : '0px' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
          <div className="header-left">
            {!isSidebarOpen && (
              <ToggleBtn isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(true)} />
            )}
            <AnimatePresence mode="popLayout">
              {!isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <BrandLogo onClick={() => navigate('/dashboard')} />
                  <span style={{ color: "var(--text-faint)", margin: "0 10px", fontSize: "1.2rem", fontWeight: 300 }}>|</span>
                </motion.div>
              )}
            </AnimatePresence>
            <h1 className="header-title" style={{ fontSize: "1.2rem", marginLeft: isSidebarOpen ? '0' : '8px' }}>{title}</h1>
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
              whileTap={{ scale: 0.95 }} 
              className="btn-upgrade"
              onClick={() => setShowProModal(true)}
            >
              Upgrade to Pro
            </motion.button>
            
            <div className="notif-wrapper" ref={notifRef} style={{ position: 'relative' }}>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }} 
                whileTap={{ scale: 0.9 }} 
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
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="notif-panel"
                  >
                    <div className="notif-header">
                      <h3>Notifications</h3>
                      <button className="mark-read-btn">Mark all read</button>
                    </div>
                    <div className="notif-body">
                      <div className="notif-item unread">
                        <div className="notif-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>✨</div>
                        <div className="notif-content">
                          <p><strong>AI Suggestions Ready!</strong> Your Software Engineer resume has 3 new tips.</p>
                          <span>2m ago</span>
                        </div>
                      </div>
                      <div className="notif-item">
                        <div className="notif-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>🎯</div>
                        <div className="notif-content">
                          <p><strong>ATS Score Improved!</strong> You hit a new high score of 87/100.</p>
                          <span>1hr ago</span>
                        </div>
                      </div>
                      <div className="notif-item">
                        <div className="notif-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📄</div>
                        <div className="notif-content">
                          <p><strong>Export Successful.</strong> Your requested PDF export is ready for viewing.</p>
                          <span>1d ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="notif-footer">
                      View all notifications
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setShowProModal(false)}>✕</button>
              
              <div className="pro-modal-header">
                <div className="pro-badge">PRO</div>
                <h2>Unlock Your True Potential</h2>
                <p>Get hired 3x faster with unlimited AI analysis and premium templates.</p>
              </div>

              <div className="pro-plans">
                <div className="plan-card">
                  <div className="plan-name">Basic</div>
                  <div className="plan-price">$0<span>/mo</span></div>
                  <ul className="plan-features">
                    <li>✓ 1 Resume</li>
                    <li>✓ 2 AI suggestions/mo</li>
                    <li>✓ Basic templates</li>
                    <li className="disabled">✕ ATS strict check</li>
                  </ul>
                  <button className="plan-btn current">Current Plan</button>
                </div>

                <div className="plan-card featured">
                  <div className="featured-label">Most Popular</div>
                  <div className="plan-name">Pro</div>
                  <div className="plan-price">$9<span>/mo</span></div>
                  <ul className="plan-features">
                    <li>✓ Unlimited Resumes</li>
                    <li>✓ Unlimited AI Writes</li>
                    <li>✓ 8+ Premium Templates</li>
                    <li>✓ Deep ATS Analysis</li>
                  </ul>
                  <button className="plan-btn upgrade" onClick={() => setShowProModal(false)}>Upgrade to Pro</button>
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
