import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, slideUpItem, scaleHover, premiumCardVariants, waveCardVariants, waveContainerVariants, TRANSITIONS } from '../utils/motionVariants';
import AppLayout from '../components/layout/AppLayout';
import { api } from '../api';
import '../styles/dashboard.css';

// ── Icons (Previously defined) ──
const quickActions = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
    label: 'New Resume',
    desc: 'Start from a template',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    path: '/templates',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: 'ATS Analysis',
    desc: 'Check keyword match',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    path: '/analysis',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    label: 'Templates',
    desc: 'Browse 8+ designs',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    path: '/templates',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    label: 'My Profile',
    desc: 'Update your details',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    path: '/profile',
  },
];

const activities = [
  { color: '#10b981', text: <><strong>ATS score improved</strong> to 87 on Software Engineer resume</>, time: '2h ago' },
  { color: '#3b82f6', text: <><strong>AI rewrote</strong> 3 bullet points in experience section</>, time: '5h ago' },
  { color: '#f59e0b', text: <><strong>PDF exported</strong> – Software Engineer — Google.pdf</>, time: '1d ago' },
  { color: '#3b82f6', text: <><strong>New resume created</strong> – Frontend Dev — Meta</>, time: '2d ago' },
];

const tips = [
  { emoji: '📊', title: 'Add measurable achievements', desc: 'Quantify results: "increased traffic by 40%"' },
  { emoji: '⚡', title: 'Use strong action verbs', desc: 'Start bullets with: led, built, optimized, shipped' },
  { emoji: '🎯', title: 'Skills section is strong', desc: 'Your keywords match 80% of common job postings' },
];

const ResumeThumb = ({ color = '#4F6EF7' }) => (
  <div className="rc-thumb">
    <div className="rc-dot" style={{ background: color }} />
    <div className="rc-line" style={{ height: 4, width: '100%', marginBottom: 3, background: color, opacity: 0.7 }} />
    <div className="rc-line" style={{ height: 2, width: '80%' }} />
    <div className="rc-line" style={{ height: 2, width: '100%', marginTop: 5 }} />
    <div className="rc-line" style={{ height: 2, width: '90%' }} />
    <div className="rc-line" style={{ height: 2, width: '70%' }} />
    <div className="rc-line" style={{ height: 2, width: '100%', marginTop: 5 }} />
    <div className="rc-line" style={{ height: 2, width: '85%' }} />
  </div>
);

// Fake stats for demonstration while real data loads
const FAKE_STATS = [
  { label: 'Total Resumes', value: null, fakeVal: '—', badge: 'Active count', badgeType: 'up', icon: '📄' },
  { label: 'Best ATS Score', value: null, fakeVal: '—', badge: 'Across all', badgeType: 'up', icon: '🎯' },
  { label: 'AI Suggestions', value: 24, fakeVal: '24', badge: 'Used this month', badgeType: 'up', icon: '✨' },
  { label: 'PDF Downloads', value: 7, fakeVal: '7', badge: 'All time', badgeType: 'up', icon: '⬇️' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.authenticatedRequest('/resumes/');
        if (response.ok) {
          const data = await response.json();
          setResumes(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const bestScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.score || 0)) : null;

  const stats = [
    { label: 'Total Resumes', value: isLoading ? '…' : resumes.length, badge: 'Active count', badgeType: 'up', icon: '📄', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Best ATS Score', value: isLoading ? '…' : (bestScore ?? '--'), badge: 'Across all', badgeType: (bestScore && bestScore > 75) ? 'up' : 'neutral', icon: '🎯', color: (bestScore && bestScore > 75) ? '#10b981' : '#f59e0b', bg: (bestScore && bestScore > 75) ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)' },
    { label: 'AI Suggestions', value: 24, badge: 'Used this month', badgeType: 'up', icon: '✨', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
    { label: 'PDF Downloads', value: 7, badge: 'All time', badgeType: 'up', icon: '⬇️', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  ];

  const thumbColors = ['#4F6EF7', '#10b981', '#a855f7'];

  return (
    <AppLayout title="Dashboard">

      {/* ── Stats Row ── */}
      <motion.div 
        className="stats-row"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            variants={premiumCardVariants}
            whileHover="hover"
            whileTap="tap"
            style={{ '--stat-color': s.color, '--stat-bg': s.bg }}
          >
            <motion.div className="stat-inner">
              <div className="stat-icon-row">
                <span className="stat-emoji">{s.icon}</span>
                <div className={`stat-badge badge-${s.badgeType || 'up'}`}>{s.badge}</div>
              </div>
              <div className="stat-val" style={s.color ? { color: s.color } : {}}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={slideUpItem} initial="hidden" animate="show">
        <div className="section-head">
          <div className="section-title">Quick Actions</div>
        </div>
        <motion.div className="quick-actions-grid" variants={staggerContainer}>
          {quickActions.map((qa, i) => (
            <motion.div
              key={qa.label}
              className="qa-card"
              variants={premiumCardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(qa.path)}
              style={{ '--qa-color': qa.color, '--qa-bg': qa.bg }}
            >
              <div className="qa-inner">
                <div className="qa-icon" style={{ background: qa.bg, color: qa.color }}>{qa.icon}</div>
                <div className="qa-label">{qa.label}</div>
                <div className="qa-desc">{qa.desc}</div>
                <motion.div className="qa-arrow" style={{ color: qa.color }}>→</motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── My Resumes ── */}
      <motion.div variants={slideUpItem} initial="hidden" animate="show" style={{ marginTop: '2rem' }}>
        <div className="section-head">
          <div className="section-title">My Resumes</div>
          <div className="section-link" onClick={() => navigate('/templates')}>+ New Resume →</div>
        </div>

        {isLoading ? (
          <div className="loading-shimmer-grid">
            {[1, 2, 3].map(i => <div key={i} className="shimmer-card" />)}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="empty-icon">📋</div>
            <h3>No resumes yet</h3>
            <p>Create your first AI-powered resume and get hired faster.</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/templates')}
              className="empty-cta-btn"
            >
              ✨ Create First Resume
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="resumes-grid"
            variants={waveContainerVariants}
            initial="hidden"
            animate="show"
            layout // Framer Motion layout prop for smooth grid re-arranges
          >
            <AnimatePresence mode="popLayout">
              {resumes.map((r, i) => {
                const score = r.score || 0;
                const scoreClass = score > 80 ? 'score-hi' : (score > 50 ? 'score-mid' : 'score-lo');
                return (
                  <motion.div
                    key={r.id}
                    className="resume-card"
                    variants={waveCardVariants}
                    layout
                    onClick={() => navigate(`/builder?id=${r.id}`)}
                  >
                    <div className="rc-preview">
                      <ResumeThumb color={thumbColors[i % thumbColors.length]} />
                      <div className="rc-badge-wrap">
                        <span className={`score-badge ${scoreClass}`}>{score > 0 ? `${score}/100` : 'New'}</span>
                      </div>
                    </div>
                    <div className="rc-body">
                      <div className="rc-name">{r.title || 'Untitled Resume'}</div>
                      <div className="rc-meta">Edited {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'recently'}</div>
                    </div>
                    <div className="rc-foot">
                      <span className="rc-tag">Modern</span>
                      <span className="rc-date">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* ── Bottom Row: Activity + Tips ── */}
      <motion.div 
        className="bottom-row" 
        variants={staggerContainer}
        initial="hidden" 
        animate="show" 
        style={{ marginTop: '2rem' }}
      >
        <motion.div className="activity-card" variants={slideUpItem}>
          <div className="section-head">
            <div className="section-title">Recent Activity</div>
            <span className="live-indicator"><span className="live-dot-sm" />Live</span>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {activities.map((a, i) => (
              <motion.div
                className="act-item"
                key={i}
                variants={slideUpItem}
                whileHover={{ x: 6, transition: TRANSITIONS.premiumSpring }}
              >
                <div className="act-dot" style={{ background: a.color }} />
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="tips-card" variants={slideUpItem}>
          <div className="section-head">
            <div className="section-title">💡 Tips</div>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {tips.map((t, i) => (
              <motion.div
                className="tip-item"
                key={i}
                variants={slideUpItem}
                whileHover={{ scale: 1.025, x: 4, transition: { duration: 0.18 } }}
              >
                <div className="tip-icon">{t.emoji}</div>
                <div>
                  <div className="tip-title">{t.title}</div>
                  <div className="tip-desc">{t.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

    </AppLayout>
  );
}