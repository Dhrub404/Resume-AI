import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles/auth.css';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#525770" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#525770" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#525770" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#525770" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const features = [
  {
    title: 'AI Resume Enhancement',
    desc: 'Rewrite weak bullet points into results-driven statements automatically.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    title: 'Real-Time ATS Scoring',
    desc: "See how recruiters' systems rank your resume with a detailed breakdown.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    title: 'Professional PDF Export',
    desc: 'Download polished, recruiter-ready PDFs in seconds.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h8M8 16h5"/>
      </svg>
    ),
  },
  {
    title: 'Multiple Templates',
    desc: 'Choose from clean, modern, and creative resume designs.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Enter a password', cls: '' });
  
  // API State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const resetState = () => {
    setError(null);
    setPassword('');
    // We intentionally keep email filled for convenience if switching tabs.
  }

  const checkStrength = (val) => {
    setPassword(val);
    if (!val) { setStrength({ score: 0, label: 'Enter a password', cls: '' }); return; }
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
    setStrength({ score, label: ['', 'Weak', 'Weak', 'Good', 'Strong'][score], cls });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.login(email, password);
      // Save user info for sidebar display
      localStorage.setItem('user_profile', JSON.stringify({ username: email, email, first_name: '', last_name: '' }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.register(firstName, lastName, email, password);
      await api.login(email, password);
      // Save user info for sidebar display
      localStorage.setItem('user_profile', JSON.stringify({ username: email, email, first_name: firstName, last_name: lastName }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-sidebar">
        <div className="logo">
          <div className="logo-icon">RAI</div>
          <div className="logo-text">Resume<span>AI</span></div>
        </div>
        <h1 className="sidebar-headline">Build resumes that get you hired.</h1>
        <p className="sidebar-sub">
          AI-powered suggestions, ATS scoring, and professional templates — all in one place.
        </p>
        <div className="feature-list">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-info">
                <p>{f.title}</p>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          &copy; 2025 ResumeAI &nbsp;·&nbsp; Trusted by 12,000+ job seekers
        </div>
      </aside>

      <main className="auth-main">
        <div className="grid-bg" />
        <div className="auth-card">
          <div className="tab-bar">
            <button
              className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); resetState(); }}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => { setTab('signup'); resetState(); }}
            >
              Create Account
            </button>
          </div>

          {error && <div className="auth-error-message" style={{ color: '#EA4335', marginBottom: '16px', fontSize: '14px', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-header">
                <h2 className="form-title">Welcome back</h2>
                <p className="form-subtitle">Sign in to access your resumes and dashboard.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon"><EmailIcon /></span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPwd(p => !p)}>
                    <EyeIcon />
                  </button>
                </div>
              </div>

              <div className="form-meta">
                <label className="checkbox-wrap">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? "Signing In..." : "Sign In to ResumeAI"}
              </button>

              <div className="divider">
                <div className="divider-line" />
                <span>or continue with</span>
                <div className="divider-line" />
              </div>

              <button type="button" className="btn-google">
                <GoogleIcon /> Continue with Google
              </button>

              <p className="auth-switch">
                Don't have an account?{' '}
                <a href="#" onClick={e => { e.preventDefault(); setTab('signup'); resetState(); }}>Sign up free</a>
              </p>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="form-header">
                <h2 className="form-title">Create your account</h2>
                <p className="form-subtitle">Start building a resume that stands out — free forever.</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="input-wrap">
                    <span className="input-icon"><UserIcon /></span>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-input" placeholder="Alex" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-wrap">
                    <span className="input-icon"><UserIcon /></span>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-input" placeholder="Johnson" required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon"><EmailIcon /></span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    placeholder="Min. 8 characters"
                    onChange={e => checkStrength(e.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPwd(p => !p)}>
                    <EyeIcon />
                  </button>
                </div>
                <div className="strength-bar">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`strength-seg ${i < strength.score ? strength.cls : ''}`} />
                  ))}
                </div>
                <p className="strength-label">{strength.label}</p>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '8px' }}>
                {isLoading ? "Creating Account..." : "Create Free Account"}
              </button>

              <div className="divider">
                <div className="divider-line" />
                <span>or continue with</span>
                <div className="divider-line" />
              </div>

              <button type="button" className="btn-google">
                <GoogleIcon /> Continue with Google
              </button>

              <p className="terms-text">
                By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
              <p className="auth-switch" style={{ marginTop: '14px' }}>
                Already have an account?{' '}
                <a href="#" onClick={e => { e.preventDefault(); setTab('login'); resetState(); }}>Sign in</a>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}