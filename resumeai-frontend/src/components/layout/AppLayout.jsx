import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/layout.css';

const AppLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
    { name: 'Resume Builder', path: '/builder', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 3.5L18.5 9H13V3.5zM6 20V4h6v6h6v10H6z' },
    { name: 'ATS Analysis', path: '/analysis', icon: 'M12 20V10M18 20V4M6 20v-4' },
    { name: 'Templates', path: '/templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-icon">RAI</div>
          <span className="logo-text">Resume<span>AI</span></span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d={item.icon}/>
              </svg>
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Alex Johnson</span>
              <span className="user-email">alex@example.com</span>
            </div>
          </div>
          <div className="logout-btn" onClick={() => navigate('/login')}>
            Log Out
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <h1 className="header-title">{title}</h1>
          <div className="header-actions">
            <button className="btn-upgrade">Upgrade to Pro</button>
            <div className="notification-bell">
              <div className="bell-badge"></div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
