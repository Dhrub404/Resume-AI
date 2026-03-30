import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import '../styles/builder.css';

const initSuggestions = [
  { type:'improve', typeLabel:'Improve', original:'worked on website features', improved:'Developed and shipped 12 responsive web features, increasing user engagement by 30% and reducing bounce rate by 18%.' },
  { type:'fix', typeLabel:'Fix Grammar', original:'Builded a CI/CD pipeline for deploy', improved:'Built and maintained a CI/CD pipeline using GitHub Actions, reducing deployment time from 45 to 8 minutes.' },
  { type:'good', typeLabel:'Strong', original:null, improved:'Your skills section has excellent keyword coverage for senior engineering roles.' },
];

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('id');

  const [currentId, setCurrentId] = useState(paramId);
  const [activeTab, setActiveTab] = useState('Content');
  const [sugs, setSugs] = useState(initSuggestions);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name:'', role:'', email:'',
    phone:'', city:'', linkedin:'',
    jobTitle:'', company:'', duration:'',
    description:'',
    skills:'',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const previewRef = useRef(null);

  // Debounce timer ref for auto-save
  const saveTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load resume from backend on mount, or auto-create one
  useEffect(() => {
    const initResume = async () => {
      if (paramId) {
        // Load existing resume
        try {
          const response = await api.authenticatedRequest(`/resumes/${paramId}/`);
          if (response.ok) {
            const data = await response.json();
            setResumeTitle(data.title || 'Untitled Resume');
            setCurrentId(String(data.id));
            if (data.content && Object.keys(data.content).length > 0) {
              setForm(prev => ({ ...prev, ...data.content }));
            }
          }
        } catch (err) {
          console.error('Failed to load resume:', err);
        }
      } else {
        // Auto-create a new resume
        try {
          const response = await api.authenticatedRequest('/resumes/', {
            method: 'POST',
            body: JSON.stringify({ title: 'Untitled Resume', content: {} }),
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentId(String(data.id));
            setSearchParams({ id: data.id }, { replace: true });
          }
        } catch (err) {
          console.error('Failed to create resume:', err);
        }
      }
    };
    initResume();
  }, [paramId]);

  // Auto-save: debounce 1.5s after form changes
  const autoSave = useCallback(() => {
    if (!currentId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.authenticatedRequest(`/resumes/${currentId}/`, {
          method: 'PUT',
          body: JSON.stringify({ title: resumeTitle, content: form }),
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, [currentId, form, resumeTitle]);

  useEffect(() => {
    if (currentId) autoSave();
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [form, autoSave]);

  // Ask AI handler
  const handleAskAi = async () => {
    if (!aiPrompt.trim() || !currentId) return;
    setAiLoading(true);
    try {
      const response = await api.authenticatedRequest(`/resumes/${currentId}/ask_ai/`, {
        method: 'POST',
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSugs(data.suggestions);
        }
      }
    } catch (err) {
      console.error('AI request failed:', err);
    } finally {
      setAiLoading(false);
      setAiPrompt('');
    }
  };

  // Export PDF handler — client-side generation for reliability
  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const skills = form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<span style="background:#eef2ff;color:#4F6EF7;padding:3pt 10pt;border-radius:4pt;font-size:9pt;font-weight:500;">${s}</span>`).join(' ') : '';
      const html = `
        <html><head><style>
          @page { size: A4; margin: 1.5cm 2cm; }
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; font-size: 10pt; line-height: 1.5; }
          .header { text-align:center; margin-bottom:18pt; border-bottom:2pt solid #4F6EF7; padding-bottom:12pt; }
          .name { font-size:22pt; font-weight:700; letter-spacing:0.5pt; color:#0f172a; }
          .role { font-size:11pt; color:#4F6EF7; margin-top:2pt; font-weight:500; }
          .contact { font-size:8.5pt; color:#64748b; margin-top:6pt; }
          .contact span { margin:0 6pt; }
          .section { margin-top:16pt; }
          .section-title { font-size:11pt; font-weight:700; text-transform:uppercase; letter-spacing:1.2pt; color:#4F6EF7; border-bottom:1pt solid #e2e8f0; padding-bottom:3pt; margin-bottom:8pt; }
          .exp-header { display:flex; justify-content:space-between; }
          .job-title { font-size:10.5pt; font-weight:600; color:#0f172a; }
          .dates { font-size:9pt; color:#64748b; }
          .company { font-size:9.5pt; color:#475569; margin-bottom:4pt; }
          .bullet { font-size:9.5pt; color:#334155; margin-bottom:3pt; margin-left:16pt; }
          .skills-wrap { display:flex; flex-wrap:wrap; gap:6pt; }
        </style></head><body>
          <div class="header">
            <div class="name">${form.name || 'Your Name'}</div>
            <div class="role">${form.role || ''}</div>
            <div class="contact">
              <span>${form.email || ''}</span>
              ${form.phone ? '<span>·</span><span>' + form.phone + '</span>' : ''}
              ${form.city ? '<span>·</span><span>' + form.city + '</span>' : ''}
              ${form.linkedin ? '<span>·</span><span>linkedin.com/' + form.linkedin + '</span>' : ''}
            </div>
          </div>
          ${form.jobTitle || form.company ? `
          <div class="section">
            <div class="section-title">Experience</div>
            <div class="exp-header">
              <div class="job-title">${form.jobTitle || ''}</div>
              <div class="dates">${form.duration || ''}</div>
            </div>
            <div class="company">${form.company || ''}</div>
            ${form.description ? '<div class="bullet">• ' + form.description + '</div>' : ''}
          </div>` : ''}
          ${skills ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-wrap">${skills}</div>
          </div>` : ''}
        </body></html>`;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        showToast('Resume PDF exported successfully! 🎉');
      }, 400);
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF export failed. Please try again.', 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg-dark)', position:'relative' }}>
      {/* Toast Popup */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '14px 24px', borderRadius: 12,
          background: toast.type === 'error' ? 'linear-gradient(135deg, #ff4d4d, #cc0000)' : 'linear-gradient(135deg, #4F6EF7, #3b5de7)',
          color: '#fff', fontSize: 14, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(79,110,247,0.35)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideInRight 0.35s ease-out',
        }}>
          <span style={{ fontSize: 18 }}>{toast.type === 'error' ? '❌' : '✅'}</span>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div className="builder-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </button>
          <div className="tb-divider" />
          <div className="builder-title">{resumeTitle}</div>
          {saving && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Saving...</span>}
        </div>
        <div className="builder-tb-right">
          <div className="score-chip">ATS: --/100</div>
          <button className="btn-outline" onClick={() => navigate(`/analysis?id=${currentId}`)}>Analyze</button>
          <button className="btn-solid" onClick={handleExportPdf} disabled={pdfLoading}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {pdfLoading ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="workspace">
        <div className="editor-panel">
          <div className="ep-tabs">
            {['Content','Style','Settings'].map(t => (
              <div key={t} className={`ep-tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>{t}</div>
            ))}
          </div>
          <div className="ep-scroll">
            <div className="section-group">
              <div className="sg-head"><div className="sg-title">Personal Info</div><span style={{color:'var(--text-muted)'}}>▾</span></div>
              <div className="field-label">Full Name</div>
              <input className="field-input" value={form.name} onChange={set('name')} />
              <div className="field-label">Job Title</div>
              <input className="field-input" value={form.role} onChange={set('role')} />
              <div className="field-row">
                <div><div className="field-label">Email</div><input className="field-input" value={form.email} onChange={set('email')} /></div>
                <div><div className="field-label">Phone</div><input className="field-input" value={form.phone} onChange={set('phone')} /></div>
              </div>
              <div className="field-row">
                <div><div className="field-label">City</div><input className="field-input" value={form.city} onChange={set('city')} /></div>
                <div><div className="field-label">LinkedIn</div><input className="field-input" value={form.linkedin} onChange={set('linkedin')} /></div>
              </div>
            </div>
            <div className="section-group">
              <div className="sg-head"><div className="sg-title">Experience</div><span style={{color:'var(--text-muted)'}}>▾</span></div>
              <div className="field-label">Job Title</div>
              <input className="field-input" value={form.jobTitle} onChange={set('jobTitle')} />
              <div className="field-row">
                <div><div className="field-label">Company</div><input className="field-input" value={form.company} onChange={set('company')} /></div>
                <div><div className="field-label">Duration</div><input className="field-input" value={form.duration} onChange={set('duration')} /></div>
              </div>
              <div className="field-label">Description</div>
              <textarea className="field-textarea" rows="4" value={form.description} onChange={set('description')} />
              <button className="add-entry-btn">+ Add Experience</button>
            </div>
            <div className="section-group">
              <div className="sg-head"><div className="sg-title">Education</div><span style={{color:'var(--text-muted)'}}>▾</span></div>
              <input className="field-input" defaultValue="UC Berkeley" />
              <div className="field-row">
                <div><input className="field-input" defaultValue="B.S. Computer Science" /></div>
                <div><input className="field-input" defaultValue="2018 – 2022" /></div>
              </div>
            </div>
            <div className="section-group">
              <div className="sg-head"><div className="sg-title">Skills</div><span style={{color:'var(--text-muted)'}}>▾</span></div>
              <input className="field-input" value={form.skills} onChange={set('skills')} />
            </div>
          </div>
        </div>

        <div className="preview-panel">
          <div className="pp-head">
            <div className="pp-label">Live Preview</div>
            <div className="pp-zoom">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              75%
            </div>
          </div>
          <div className="pp-scroll">
            <div className="resume-sheet">
              <div className="rs-name">{form.name}</div>
              <div className="rs-role">{form.role}</div>
              <div className="rs-contact">
                <span>{form.email}</span><span>{form.phone}</span>
                <span>{form.city}</span><span>linkedin.com/{form.linkedin}</span>
              </div>
              <div className="rs-section">
                <div className="rs-sec-title">Experience</div>
                <div className="rs-exp-head"><div className="rs-job">{form.jobTitle}</div><div className="rs-dates">{form.duration}</div></div>
                <div className="rs-company">{form.company}</div>
                <ul className="rs-bullets">
                  <li className="rs-bullet">{form.description}</li>
                </ul>
              </div>
              <div className="rs-section">
                <div className="rs-sec-title">Education</div>
                <div className="rs-edu-row">
                  <div><div className="rs-school">UC Berkeley</div><div className="rs-degree">B.S. Computer Science · 2022</div></div>
                  <div className="rs-dates">2018 – 2022</div>
                </div>
              </div>
              <div className="rs-section">
                <div className="rs-sec-title">Skills</div>
                <div className="rs-skills">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s,i) => (
                    <span className="rs-skill" key={i}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-panel">
          <div className="ap-head">
            <div className="ap-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              AI Suggestions
            </div>
            <div className="ap-sub">{sugs.length} improvement{sugs.length !== 1 ? 's' : ''} found</div>
          </div>
          <div className="ap-scroll">
            {sugs.map((s,i) => (
              <div className="sug-card" key={i}>
                <div className={`sug-tag sug-${s.type}`}>{s.typeLabel}</div>
                {s.original && <div className="sug-orig">{s.original}</div>}
                <div className="sug-new">{s.improved}</div>
                {s.type !== 'good' && (
                  <div className="sug-actions">
                    <button className="sug-accept" onClick={() => setSugs(p => p.filter((_,j) => j !== i))}>Accept</button>
                    <button className="sug-skip" onClick={() => setSugs(p => p.filter((_,j) => j !== i))}>Skip</button>
                  </div>
                )}
              </div>
            ))}
            {sugs.length === 0 && <div style={{textAlign:'center',padding:'32px 16px',color:'var(--text-muted)',fontSize:'13px'}}>All suggestions reviewed!</div>}
          </div>
          <div className="ai-prompt-area">
            <textarea className="ai-prompt-input" placeholder="Ask AI: 'Improve my summary', 'Add action verbs'..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
            <button className="ai-send" onClick={handleAskAi} disabled={aiLoading}>
              {aiLoading ? 'Thinking...' : 'Send to AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}