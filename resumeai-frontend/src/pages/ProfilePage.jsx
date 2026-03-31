import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useUser } from '../context/UserContext';
import { api } from '../api';
import '../styles/profile.css';

// ── SVG Icons ──
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconCrown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 4l3 12h14l3-12-5 4-5-4-5 4z"/><path d="M5 16h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2z"/></svg>;
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconCamera = () => <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconCalendar = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, text: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, text: 'Weak', color: 'weak' };
  if (score <= 2) return { level: 2, text: 'Fair', color: 'medium' };
  if (score <= 3) return { level: 3, text: 'Good', color: 'medium' };
  return { level: 4, text: 'Strong', color: 'strong' };
};

export default function ProfilePage() {
  const { user: contextUser, isLoaded, updateUser } = useUser();
  
  // ── Build display name dynamically from context ──
  const getName = (u) => {
    if (!u) return '';
    return (`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || u.email || '');
  };

  // ── Local Profile State — initialized empty, populated by useEffect ──
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    darkMode: true,
    plan: 'free',
  });
  
  const [stats, setStats] = useState({
    resumes: 0,
    atsScore: 0,
    downloads: 0,
  });

  // ── Edit Mode ──
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  
  // Sync context → local state whenever context user updates
  useEffect(() => {
    if (contextUser) {
      const name = getName(contextUser);
      setProfileData(prev => ({ ...prev, name, email: contextUser.email || prev.email }));
      setFormData(prev => ({ ...prev, name, email: contextUser.email || prev.email }));
    }
  }, [contextUser]);
  
  // ── Password State ──
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  
  // ── Toast ──
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch resume stats ──
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resumeResp = await api.authenticatedRequest('/resumes/');
        if (resumeResp.ok) {
          const data = await resumeResp.json();
          const resumes = Array.isArray(data) ? data : (data.results || []);
          const bestScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.score || 0)) : 0;
          setStats({ resumes: resumes.length, atsScore: bestScore, downloads: 0 });
        }
      } catch (err) { console.error('Stats fetch error:', err); }
    };
    fetchStats();
  }, []);

  // ── Handlers ──
  const handleEditToggle = () => {
    if (editMode) {
      setFormData({ ...profileData });
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = async () => {
    const nameParts = formData.name.split(' ');
    const payload = {
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      email: formData.email,
    };
    try {
      const response = await api.authenticatedRequest('/auth/profile/', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setProfileData({ ...formData });
        updateUser(updatedUser);
        setEditMode(false);
        showToast('Profile updated successfully!');
      } else {
        const err = await response.json();
        showToast(Object.values(err).flat().join(', ') || 'Failed to save.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async () => {
    const errors = {};
    if (!passwords.current) errors.current = 'Current password is required';
    if (passwords.newPw.length < 8) errors.newPw = 'Password must be at least 8 characters';
    if (passwords.newPw !== passwords.confirm) errors.confirm = 'Passwords do not match';
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await api.authenticatedRequest('/auth/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.newPw,
        }),
      });
      if (response.ok) {
        setPasswords({ current: '', newPw: '', confirm: '' });
        showToast('Password changed successfully!');
      } else {
        const err = await response.json();
        const msg = err.current_password?.[0] || err.new_password?.[0] || 'Failed to change password.';
        setPwErrors({ current: err.current_password?.[0] || '', newPw: err.new_password?.[0] || '' });
        showToast(msg, 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const pwStrength = getPasswordStrength(passwords.newPw);
  const userInitial = profileData.name ? profileData.name.charAt(0).toUpperCase() : '?';

  // Wait until user data is loaded before rendering
  if (!isLoaded || !profileData.name) {
    return (
      <AppLayout title="Profile & Settings">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)', fontSize: 15 }}>
          Loading profile...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile & Settings">
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 24px', borderRadius: 12,
          background: toast.type === 'error' ? 'linear-gradient(135deg, #ff4d4d, #cc0000)' : 'linear-gradient(135deg, #4F6EF7, #3b5de7)',
          color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(79,110,247,0.35)',
          display: 'flex', alignItems: 'center', gap: 10, animation: 'slideInRight 0.35s ease-out',
        }}><span style={{ fontSize: 18 }}>{toast.type === 'error' ? '❌' : '✅'}</span>{toast.message}</div>
      )}

      <div className="profile-page">
        {/* ═══════════ Profile Header ═══════════ */}
        <div className="profile-header-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {profileData.avatar ? <img src={profileData.avatar} alt="Avatar" /> : userInitial}
            </div>
            <label className="avatar-upload-overlay" htmlFor="avatar-upload">
              <IconCamera />
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </div>
          <div className="profile-header-info">
            <div className="profile-name">{profileData.name}</div>
            <div className="profile-email">{profileData.email}</div>
            <div className="profile-member-since"><IconCalendar /> Member since {contextUser?.date_joined ? new Date(contextUser.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</div>
          </div>
          <button className="profile-edit-btn" onClick={handleEditToggle}>
            <IconEdit /> {editMode ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* ═══════════ Two-Column Grid ═══════════ */}
        <div className="profile-grid">

          {/* ── Personal Info Card ── */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}><IconUser /></div>
              <div>
                <div className="profile-card-title">Personal Information</div>
                <div className="profile-card-subtitle">Manage your personal details</div>
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">Full Name</label>
              <input className="pf-input" value={formData.name} disabled={!editMode} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="pf-field">
              <label className="pf-label">Email Address</label>
              <input className="pf-input" value={formData.email} disabled={!editMode} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="pf-field-row">
              <div className="pf-field">
                <label className="pf-label">Phone Number</label>
                <input className="pf-input" value={formData.phone} disabled={!editMode} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="pf-field">
                <label className="pf-label">Location</label>
                <input className="pf-input" value={formData.location} disabled={!editMode} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
            {editMode && (
              <div className="pf-actions">
                <button className="pf-btn-cancel" onClick={handleEditToggle}>Cancel</button>
                <button className="pf-btn-save" onClick={handleSaveProfile}>Save Changes</button>
              </div>
            )}
          </div>

          {/* ── Security Card ── */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}><IconShield /></div>
              <div>
                <div className="profile-card-title">Account Security</div>
                <div className="profile-card-subtitle">Update your password</div>
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">Current Password</label>
              <input className={`pf-input ${pwErrors.current ? 'pf-input-error' : ''}`} type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
              {pwErrors.current && <div className="pf-error-msg">⚠ {pwErrors.current}</div>}
            </div>
            <div className="pf-field">
              <label className="pf-label">New Password</label>
              <input className={`pf-input ${pwErrors.newPw ? 'pf-input-error' : ''}`} type="password" placeholder="Minimum 8 characters" value={passwords.newPw} onChange={e => setPasswords({...passwords, newPw: e.target.value})} />
              {passwords.newPw && (
                <>
                  <div className="pw-strength">
                    {[1,2,3,4].map(i => <div key={i} className={`pw-bar ${i <= pwStrength.level ? pwStrength.color : ''}`} />)}
                  </div>
                  <div className="pw-strength-text" style={{ color: pwStrength.color === 'strong' ? '#10b981' : (pwStrength.color === 'medium' ? '#f59e0b' : '#ef4444') }}>{pwStrength.text}</div>
                </>
              )}
              {pwErrors.newPw && <div className="pf-error-msg">⚠ {pwErrors.newPw}</div>}
            </div>
            <div className="pf-field">
              <label className="pf-label">Confirm Password</label>
              <input className={`pf-input ${pwErrors.confirm ? 'pf-input-error' : ''}`} type="password" placeholder="Re-enter new password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
              {pwErrors.confirm && <div className="pf-error-msg">⚠ {pwErrors.confirm}</div>}
            </div>
            <div className="pf-actions">
              <button className="pf-btn-save" onClick={handleChangePassword}>Update Password</button>
            </div>
          </div>

          {/* ── Notifications & Preferences Card ── */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}><IconBell /></div>
              <div>
                <div className="profile-card-title">Notifications</div>
                <div className="profile-card-subtitle">Configure how you receive updates</div>
              </div>
            </div>
            <div className="pf-toggle-row">
              <div className="pf-toggle-label">
                <span className="pf-toggle-name">Email Notifications</span>
                <span className="pf-toggle-desc">Receive resume tips and ATS score alerts</span>
              </div>
              <label className="pf-toggle">
                <input type="checkbox" checked={settings.emailNotifications} onChange={e => setSettings({...settings, emailNotifications: e.target.checked})} />
                <span className="pf-toggle-track" />
              </label>
            </div>
            <div className="pf-toggle-row">
              <div className="pf-toggle-label">
                <span className="pf-toggle-name">Weekly Digest</span>
                <span className="pf-toggle-desc">Get a weekly summary of your activity</span>
              </div>
              <label className="pf-toggle">
                <input type="checkbox" checked={settings.weeklyDigest} onChange={e => setSettings({...settings, weeklyDigest: e.target.checked})} />
                <span className="pf-toggle-track" />
              </label>
            </div>
            <div className="pf-toggle-row">
              <div className="pf-toggle-label">
                <span className="pf-toggle-name">Dark Mode</span>
                <span className="pf-toggle-desc">Use the dark theme across the app</span>
              </div>
              <label className="pf-toggle">
                <input type="checkbox" checked={settings.darkMode} onChange={e => setSettings({...settings, darkMode: e.target.checked})} />
                <span className="pf-toggle-track" />
              </label>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone">
              <div className="danger-zone-text">
                <h4>Delete Account</h4>
                <p>This action is permanent and cannot be undone.</p>
              </div>
              <button className="danger-btn" onClick={() => showToast('Account deletion is disabled in demo mode.', 'error')}>Delete Account</button>
            </div>
          </div>

          {/* ── Subscription / Plan Card ── */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><IconCrown /></div>
              <div>
                <div className="profile-card-title">Subscription & Usage</div>
                <div className="profile-card-subtitle">Your current plan and resource usage</div>
              </div>
            </div>

            <div className="plan-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`plan-badge ${settings.plan === 'pro' ? 'plan-pro' : 'plan-free'}`}>
                  {settings.plan === 'pro' ? '⭐ PRO' : 'FREE'}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {settings.plan === 'pro' ? 'All features unlocked' : 'Limited to 3 resumes & 5 ATS scans'}
                </span>
              </div>
              {settings.plan !== 'pro' && <button className="plan-upgrade-btn" onClick={() => showToast('Upgrade flow coming soon!')}>Upgrade to Pro</button>}
            </div>

            <div className="plan-usage-grid">
              <div className="plan-usage-item">
                <div className="plan-usage-val">{stats.resumes}</div>
                <div className="plan-usage-label">Resumes Created</div>
              </div>
              <div className="plan-usage-item">
                <div className="plan-usage-val" style={{ color: stats.atsScore > 75 ? '#10b981' : (stats.atsScore > 50 ? '#f59e0b' : '#94a3b8') }}>{stats.atsScore || '—'}</div>
                <div className="plan-usage-label">Best ATS Score</div>
              </div>
              <div className="plan-usage-item">
                <div className="plan-usage-val">{stats.downloads}</div>
                <div className="plan-usage-label">PDF Downloads</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
