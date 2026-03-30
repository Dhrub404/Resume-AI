import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { api } from '../api';
import '../styles/dashboard.css';

const activities = [
  { color: 'var(--success)', text: <><strong>ATS score improved</strong> to 87 on Software Engineer resume</>, time: '2h ago' },
  { color: 'var(--accent)', text: <><strong>AI rewrote</strong> 3 bullet points in experience section</>, time: '3h ago' },
  { color: 'var(--warning)', text: <><strong>PDF exported</strong> – Software Engineer — Google.pdf</>, time: '1d ago' },
  { color: 'var(--accent)', text: <><strong>New resume created</strong> – Frontend Dev — Meta</>, time: '1d ago' },
];

const tips = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    title: 'Add measurable achievements',
    desc: 'Quantify results with numbers like "increased traffic by 40%"',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: 'Include more action verbs',
    desc: 'Start bullets with: led, built, optimized, shipped, architected',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    title: 'Skills section is strong',
    desc: 'Your keywords match 80% of common job postings',
  },
];

const ResumeThumb = () => (
  <div className="rc-thumb">
    <div className="rc-dot" />
    <div className="rc-line" style={{ height: 4, width: '100%', marginBottom: 3 }} />
    <div className="rc-line" style={{ height: 2, width: '80%' }} />
    <div className="rc-line" style={{ height: 2, width: '100%', marginTop: 5 }} />
    <div className="rc-line" style={{ height: 2, width: '90%' }} />
    <div className="rc-line" style={{ height: 2, width: '70%' }} />
    <div className="rc-line" style={{ height: 2, width: '100%', marginTop: 5 }} />
    <div className="rc-line" style={{ height: 2, width: '85%' }} />
  </div>
);

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
        console.error("Failed to fetch resumes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const bestScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.score || 0)) : 0;
  const aiTipsUsed = 0; // Will be connected later 
  
  return (
    <AppLayout title="Dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Resumes</div>
          <div className="stat-val">{isLoading ? '-' : resumes.length}</div>
          <div className="stat-badge badge-up">Active count</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best ATS Score</div>
          <div className="stat-val" style={{ color: bestScore > 75 ? 'var(--success)' : 'var(--warning)' }}>
            {isLoading ? '-' : bestScore}
          </div>
          <div className="stat-badge badge-up">Across all resumes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Suggestions Used</div>
          <div className="stat-val">{isLoading ? '-' : aiTipsUsed}</div>
          <div className="stat-badge badge-up">Since you joined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PDF Downloads</div>
          <div className="stat-val">{isLoading ? '-' : 0}</div>
          <div className="stat-badge badge-down">Need to generate one</div>
        </div>
      </div>

      <div className="section-head">
        <div className="section-title">My Resumes</div>
        <div className="section-link" onClick={() => navigate('/templates')}>View all →</div>
      </div>
      
      {isLoading ? (
        <div style={{ color: '#94a3b8', padding: '2rem 0', textAlign: 'center' }}>Loading your professional resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="empty-state" style={{ 
          background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', padding: '3rem 2rem', 
          textAlign: 'center', marginBottom: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f1f5f9' }}>You haven't built any resumes yet!</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Let's create your first AI-optimized resume and get you hired.</p>
          <button className="btn-primary" onClick={() => navigate('/templates')} style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 1.5rem' }}>+ Create New Resume</button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map(r => {
            const score = r.score || 0;
            const scoreClass = score > 80 ? 'score-hi' : (score > 50 ? 'score-mid' : 'score-lo');
            
            return (
              <div className="resume-card" key={r.id} onClick={() => navigate(`/builder?id=${r.id}`)}>
                <div className="rc-preview">
                  <ResumeThumb />
                  <div className="rc-badge-wrap">
                    <span className={`score-badge ${scoreClass}`}>{score}/100</span>
                  </div>
                </div>
                <div className="rc-body">
                  <div className="rc-name">{r.title || 'Untitled Resume'}</div>
                  <div className="rc-meta">Last edited recently</div>
                </div>
                <div className="rc-foot">
                  <span className="rc-tag">Modern</span>
                  <span className="rc-date">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bottom-row">
        <div className="activity-card">
          <div className="section-head">
            <div className="section-title">Recent Activity</div>
          </div>
          {activities.map((a, i) => (
            <div className="act-item" key={i}>
              <div className="act-dot" style={{ background: a.color }} />
              <div className="act-text">{a.text}</div>
              <div className="act-time">{a.time}</div>
            </div>
          ))}
        </div>
        <div className="tips-card">
          <div className="section-head">
            <div className="section-title">Improvement Tips</div>
          </div>
          {tips.map((t, i) => (
            <div className="tip-item" key={i}>
              <div className="tip-icon">{t.icon}</div>
              <div>
                <div className="tip-title">{t.title}</div>
                <div className="tip-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}