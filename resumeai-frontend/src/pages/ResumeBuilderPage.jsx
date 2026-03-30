import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/builder.css';

const initSuggestions = [
  { type:'improve', typeLabel:'Improve', original:'worked on website features', improved:'Developed and shipped 12 responsive web features, increasing user engagement by 30% and reducing bounce rate by 18%.' },
  { type:'fix', typeLabel:'Fix Grammar', original:'Builded a CI/CD pipeline for deploy', improved:'Built and maintained a CI/CD pipeline using GitHub Actions, reducing deployment time from 45 to 8 minutes.' },
  { type:'good', typeLabel:'Strong', original:null, improved:'Your skills section has excellent keyword coverage for senior engineering roles.' },
];

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Content');
  const [sugs, setSugs] = useState(initSuggestions);
  const [aiPrompt, setAiPrompt] = useState('');
  const [form, setForm] = useState({
    name:'Alex Johnson', role:'Software Engineer', email:'alex@email.com',
    phone:'+1 555-0100', city:'San Francisco', linkedin:'in/alexj',
    jobTitle:'Senior Frontend Engineer', company:'Stripe', duration:'2022 – Present',
    description:'Led migration of payments UI to React 18, reducing load time by 40% and improving LCP score from 3.2s to 1.1s across 200k daily users.',
    skills:'React, TypeScript, Node.js, Python, AWS, Docker',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg-dark)' }}>
      <div className="builder-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </button>
          <div className="tb-divider" />
          <div className="builder-title">Software Engineer — Google</div>
        </div>
        <div className="builder-tb-right">
          <div className="score-chip">ATS: 87/100</div>
          <button className="btn-outline" onClick={() => navigate('/analysis')}>Analyze</button>
          <button className="btn-solid">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
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
                <div className="rs-company">{form.company} · {form.city}</div>
                <ul className="rs-bullets">
                  <li className="rs-bullet">{form.description}</li>
                  <li className="rs-bullet">Architected a design system used by 12 teams, cutting UI development time by 35%.</li>
                  <li className="rs-bullet">Mentored 3 junior engineers and conducted 50+ technical interviews.</li>
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
            <button className="ai-send" onClick={() => setAiPrompt('')}>Send to AI</button>
          </div>
        </div>
      </div>
    </div>
  );
}