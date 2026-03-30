import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/builder.css';

// ── Icons (Lucide-react equivalents mapped to SVG strings for simplicity) ──
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconMap = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconLink = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

const initSuggestions = [
  { type:'improve', typeLabel:'Improve', original:'worked on website features', improved:'Developed and shipped 12 responsive web features, increasing user engagement by 30% and reducing bounce rate by 18%.' },
  { type:'fix', typeLabel:'Fix Grammar', original:'Builded a CI/CD pipeline for deploy', improved:'Built and maintained a CI/CD pipeline using GitHub Actions, reducing deployment time from 45 to 8 minutes.' },
  { type:'good', typeLabel:'Strong', original:null, improved:'Your skills section has excellent keyword coverage for senior engineering roles.' },
];

const PROFICIENCY_LEVELS = [
  'Native / Bilingual', 'Full Professional', 'Professional Working', 'Limited Working', 'Elementary'
];

const FONTS = [
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
  { label: 'Roboto (Clean Sans)', value: "'Roboto', sans-serif" },
  { label: 'Merriweather (Classic Serif)', value: "'Merriweather', serif" },
  { label: 'Playfair Display (Elegant)', value: "'Playfair Display', serif" },
  { label: 'Fira Code (Tech Mono)', value: "'Fira Code', monospace" }
];

const COLORS = [
  { label: 'Classic Blue', value: '#2563eb' },
  { label: 'Emerald Green', value: '#10b981' },
  { label: 'Royal Purple', value: '#8b5cf6' },
  { label: 'Crimson Red', value: '#e11d48' },
  { label: 'Charcoal Black', value: '#334155' }
];

const THEME_PRESETS = {
  minimal: {
    fontFamily: "'Inter', sans-serif", headingFont: "'Inter', sans-serif", fontWeight: "400",
    textAlign: "left", primaryColor: "#334155", secondaryColor: "#94a3b8", bgColor: "#ffffff",
    dividerStyle: "line", layout: "single", sidebarPos: "left", contentWidth: "800", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: false, skillStyle: "tags", skillColor: "#f1f5f9",
    profileShape: "circle", headerAlign: "left", headerBanner: false, iconsEnabled: false, iconStyle: "minimal",
    lineSpacing: "1.6", sectionSpacing: "24", fontSize: "14"
  },
  corporate: {
    fontFamily: "'Roboto', sans-serif", headingFont: "'Roboto', sans-serif", fontWeight: "500",
    textAlign: "left", primaryColor: "#2563eb", secondaryColor: "#64748b", bgColor: "#ffffff",
    dividerStyle: "dashed", layout: "left-sidebar", sidebarPos: "left", contentWidth: "850", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: true, skillStyle: "progress", skillColor: "#2563eb",
    profileShape: "square", headerAlign: "centered", headerBanner: false, iconsEnabled: true, iconStyle: "minimal",
    lineSpacing: "1.5", sectionSpacing: "20", fontSize: "14"
  },
  modernDark: {
    fontFamily: "'Inter', sans-serif", headingFont: "'Inter', sans-serif", fontWeight: "400",
    textAlign: "left", primaryColor: "#38bdf8", secondaryColor: "#cbd5e1", bgColor: "#0f172a",
    dividerStyle: "none", layout: "right-sidebar", sidebarPos: "right", contentWidth: "900", sectionStyle: "card",
    borderRadius: "12", padding: "16", highlightHeaders: false, skillStyle: "dots", skillColor: "#38bdf8",
    profileShape: "circle", headerAlign: "left", headerBanner: true, iconsEnabled: true, iconStyle: "filled",
    lineSpacing: "1.7", sectionSpacing: "24", fontSize: "14"
  },
  creative: {
    fontFamily: "'Merriweather', serif", headingFont: "'Playfair Display', serif", fontWeight: "400",
    textAlign: "center", primaryColor: "#e11d48", secondaryColor: "#f43f5e", bgColor: "#fff1f2",
    dividerStyle: "line", layout: "single", sidebarPos: "left", contentWidth: "800", sectionStyle: "flat",
    borderRadius: "0", padding: "0", highlightHeaders: true, skillStyle: "progress", skillColor: "#fb7185",
    profileShape: "circle", headerAlign: "centered", headerBanner: false, iconsEnabled: true, iconStyle: "outline",
    lineSpacing: "1.8", sectionSpacing: "32", fontSize: "15"
  }
};

// ── Tag Input Component ──
const TagInput = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) { setTags([...tags, input.trim()]); }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length) { setTags(tags.slice(0, -1)); }
  };
  return (
    <div className="tag-input-wrap">
      <div className="tag-list">
        {tags.map((tag, i) => (
          <span className="tag-chip" key={i}>
            {tag}
            <button className="tag-remove" onClick={() => setTags(tags.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <input className="tag-field" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={tags.length === 0 ? placeholder : 'Add more...'} />
    </div>
  );
};

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Style');
  const [sugs, setSugs] = useState(initSuggestions);
  const [aiPrompt, setAiPrompt] = useState('');

  // ── Style State (Huge Canva-like Schema) ──
  const [resumeStyle, setResumeStyle] = useState({ ...THEME_PRESETS.corporate, profileImage: null });

  // ── My Content State ──
  const [personalInfo, setPersonalInfo] = useState({ fullName: 'Alex Johnson', jobTitle: 'Senior Frontend Engineer', email: 'alex@email.com', phone: '+1 555-0100', city: 'San Francisco', linkedin: 'in/alexj', portfolio: '' });
  const [summary, setSummary] = useState('Senior Frontend Engineer with 5+ years of experience building scalable web applications. Passionate about UI/UX and performance optimization.');
  const [experiences, setExperiences] = useState([{ jobTitle: 'Senior Frontend Engineer', company: 'Stripe', startDate: '2022-01', endDate: '', current: true, description: 'Led migration of payments UI to React 18, reducing load time by 40% and improving LCP score from 3.2s to 1.1s across 200k daily users.\nArchitected a design system used by 12 teams, cutting UI development time by 35%.\nMentored 3 junior engineers and conducted 50+ technical interviews.' },]);
  const [education, setEducation] = useState([{ degree: 'B.S. Computer Science', university: 'UC Berkeley', startYear: '2018', endYear: '2022', details: '' },]);
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker']);
  const [languages, setLanguages] = useState([{ name: 'English', proficiency: 'Native / Bilingual' }]);
  const [interests, setInterests] = useState(['Open Source', 'Photography', 'Hiking']);

  // ── Collapsible section toggles ──
  const [openSections, setOpenSections] = useState({
    personal: true, summary: true, experience: true, education: true, skills: true, languages: true, interests: true,
    styleTheme: true, styleType: false, styleColor: false, styleLayout: false, styleSection: false, styleProfile: false
  });
  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Handlers
  const updatePersonal = (key) => (e) => setPersonalInfo(prev => ({ ...prev, [key]: e.target.value }));
  const addExperience = () => setExperiences(prev => [...prev, { jobTitle: '', company: '', startDate: '', endDate: '', current: false, description: '' }]);
  const removeExperience = (i) => setExperiences(prev => prev.filter((_, j) => j !== i));
  const updateExperience = (i, key, val) => setExperiences(prev => prev.map((exp, j) => j === i ? { ...exp, [key]: val } : exp));
  const addEducation = () => setEducation(prev => [...prev, { degree: '', university: '', startYear: '', endYear: '', details: '' }]);
  const removeEducation = (i) => setEducation(prev => prev.filter((_, j) => j !== i));
  const updateEducation = (i, key, val) => setEducation(prev => prev.map((edu, j) => j === i ? { ...edu, [key]: val } : edu));
  const addLanguage = () => setLanguages(prev => [...prev, { name: '', proficiency: 'Full Professional' }]);
  const removeLanguage = (i) => setLanguages(prev => prev.filter((_, j) => j !== i));
  const updateLanguage = (i, key, val) => setLanguages(prev => prev.map((lang, j) => j === i ? { ...lang, [key]: val } : lang));
  const updateStyle = (key, val) => setResumeStyle(prev => ({ ...prev, [key]: val }));

  // Image Upload Handle
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateStyle('profileImage', reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Preview Mapping Helpers
  const renderSkill = (skill, i) => {
    if(resumeStyle.skillStyle === 'progress') {
      const w = Math.floor(Math.random() * 30 + 70); // Mock percentage
      return (
        <div key={i} className="rs-skill-prog-item">
          <div className="rs-skill-name">{skill}</div>
          <div className="rs-skill-bar-wrap">
            <div className="rs-skill-bar-fill" style={{ width: `${w}%`, background: resumeStyle.skillColor || resumeStyle.primaryColor }} />
          </div>
        </div>
      );
    }
    if(resumeStyle.skillStyle === 'dots') {
      return (
        <div key={i} className="rs-skill-dot-item">
          <div className="rs-skill-name">{skill}</div>
          <div className="rs-skill-dots">
            {[1,2,3,4,5].map(d => <span key={d} className="rs-dot" style={{ background: d < 5 ? (resumeStyle.skillColor || resumeStyle.primaryColor) : '#e2e8f0' }} />)}
          </div>
        </div>
      );
    }
    return <span className="rs-skill" style={{ background: resumeStyle.skillColor, color: '#334155' }} key={i}>{skill}</span>;
  };

  // Sections builder for modular layouts
  const ContactInfo = () => (
    <div className="rs-contact" style={{ justifyContent: resumeStyle.headerAlign === 'centered' ? 'center' : 'flex-start' }}>
      {personalInfo.email && <span>{resumeStyle.iconsEnabled && <IconMail/>} {personalInfo.email}</span>}
      {personalInfo.phone && <span>{resumeStyle.iconsEnabled && <IconPhone/>} {personalInfo.phone}</span>}
      {personalInfo.city && <span>{resumeStyle.iconsEnabled && <IconMap/>} {personalInfo.city}</span>}
      {personalInfo.linkedin && <span>{resumeStyle.iconsEnabled && <IconLink/>} linkedin.com/{personalInfo.linkedin}</span>}
      {personalInfo.portfolio && <span>{resumeStyle.iconsEnabled && <IconLink/>} {personalInfo.portfolio}</span>}
    </div>
  );

  const MainContent = () => (
    <>
      {summary && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Summary</div>
          <div className="rs-summary">{summary}</div>
        </div>
      )}
      {experiences.length > 0 && experiences.some(e => e.company || e.jobTitle) && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Experience</div>
          {experiences.map((exp, i) => (
            <div key={i} className="rs-exp-item">
              <div className="rs-exp-head">
                <div className="rs-job">{exp.jobTitle}</div>
                <div className="rs-dates">{exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div className="rs-company" style={{ color: resumeStyle.primaryColor }}>{exp.company}</div>
              {exp.description && (
                <ul className="rs-bullets">
                  {exp.description.split('\n').filter(Boolean).map((b, j) => <li className="rs-bullet" key={j}>{b.replace(/^[-•]\s*/, '')}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && education.some(e => e.university || e.degree) && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Education</div>
          {education.map((edu, i) => (
            <div key={i} className="rs-edu-row">
              <div><div className="rs-school">{edu.university}</div><div className="rs-degree">{edu.degree}</div>{edu.details && <div className="rs-edu-details">{edu.details}</div>}</div>
              <div className="rs-dates">{edu.startYear} {edu.startYear && edu.endYear ? '–' : ''} {edu.endYear}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const SideContent = () => (
    <>
      <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
        <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Skills</div>
        <div className={`rs-skills ${resumeStyle.skillStyle!=='tags'?'rs-skills-col':''}`}>
          {skills.map((s,i) => renderSkill(s, i))}
        </div>
      </div>
      {languages.length > 0 && languages.some(l => l.name) && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Languages</div>
          <div className="rs-list">
            {languages.map((l, i) => (
              <div key={i} className="rs-list-item"><strong>{l.name}</strong><span className="rs-light" style={{color:resumeStyle.secondaryColor}}> — {l.proficiency}</span></div>
            ))}
          </div>
        </div>
      )}
      {interests.length > 0 && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Interests</div>
          <div className="rs-skills">{interests.map((int, i) => <span className="rs-skill" style={{background:resumeStyle.skillColor}} key={i}>{int}</span>)}</div>
        </div>
      )}
    </>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg-dark)' }}>
      <div className="builder-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </button>
          <div className="tb-divider" />
          <div className="builder-title">{personalInfo.fullName ? `${personalInfo.fullName} Resume` : 'Untitled Resume'}</div>
        </div>
        <div className="builder-tb-right">
          <button className="btn-outline" onClick={() => updateStyle('fontFamily', "'Inter', sans-serif")}>↻ Reset Styles</button>
          <div className="score-chip">ATS: 87/100</div>
          <button className="btn-solid" onClick={() => window.print()}>
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
            
            {/* ═════════ CONTENT TAB ═════════ */}
            {activeTab === 'Content' && (
              <div className="mc-form-wrapper">
                {/* Personal Info */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('personal')}><div className="mc-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div className="mc-card-title">Personal Information</div><span className={`mc-chevron ${openSections.personal ? 'open' : ''}`}>▾</span></div>
                  {openSections.personal && (
                    <div className="mc-card-body">
                      <div className="mc-field-grid">
                        <div className="mc-field"><label className="mc-label">Full Name</label><input className="mc-input" value={personalInfo.fullName} onChange={updatePersonal('fullName')} /></div>
                        <div className="mc-field"><label className="mc-label">Job Title</label><input className="mc-input" value={personalInfo.jobTitle} onChange={updatePersonal('jobTitle')} /></div>
                        <div className="mc-field"><label className="mc-label">Email</label><input className="mc-input" value={personalInfo.email} onChange={updatePersonal('email')} /></div>
                        <div className="mc-field"><label className="mc-label">Phone</label><input className="mc-input" value={personalInfo.phone} onChange={updatePersonal('phone')} /></div>
                        <div className="mc-field"><label className="mc-label">City</label><input className="mc-input" value={personalInfo.city} onChange={updatePersonal('city')} /></div>
                        <div className="mc-field"><label className="mc-label">LinkedIn</label><input className="mc-input" value={personalInfo.linkedin} onChange={updatePersonal('linkedin')} /></div>
                        <div className="mc-field mc-field-full"><label className="mc-label">Portfolio</label><input className="mc-input" value={personalInfo.portfolio} onChange={updatePersonal('portfolio')} /></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('summary')}><div className="mc-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg></div><div className="mc-card-title">Summary</div><span className={`mc-chevron ${openSections.summary ? 'open' : ''}`}>▾</span></div>
                  {openSections.summary && <div className="mc-card-body"><textarea className="mc-textarea" rows="4" value={summary} onChange={(e) => setSummary(e.target.value)} /></div>}
                </div>

                {/* Experience */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('experience')}><div className="mc-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div><div className="mc-card-title">Experience</div><span className="mc-entry-count">{experiences.length}</span><span className={`mc-chevron ${openSections.experience ? 'open' : ''}`}>▾</span></div>
                  {openSections.experience && (
                    <div className="mc-card-body">
                      {experiences.map((exp, i) => (
                        <div className="mc-entry" key={i}>
                          <div className="mc-entry-head"><span className="mc-entry-num">#{i + 1}</span>{experiences.length > 1 && <button className="mc-entry-remove" onClick={() => removeExperience(i)}>Remove</button>}</div>
                          <div className="mc-field-grid">
                            <div className="mc-field"><label className="mc-label">Job Title</label><input className="mc-input" value={exp.jobTitle} onChange={(e) => updateExperience(i, 'jobTitle', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">Company</label><input className="mc-input" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">Start Date</label><input className="mc-input" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">End Date</label><div className="mc-end-date-wrap"><input className="mc-input" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} disabled={exp.current} /><label className="mc-checkbox-label"><input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, 'current', e.target.checked)} /> Present</label></div></div>
                          </div>
                          <div className="mc-field mc-field-full"><label className="mc-label">Description (Bullets)</label><textarea className="mc-textarea" rows="4" value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} /></div>
                        </div>
                      ))}
                      <button className="mc-add-btn" onClick={addExperience}>+ Add Experience</button>
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('education')}><div className="mc-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg></div><div className="mc-card-title">Education</div><span className="mc-entry-count">{education.length}</span><span className={`mc-chevron ${openSections.education ? 'open' : ''}`}>▾</span></div>
                  {openSections.education && (
                    <div className="mc-card-body">
                      {education.map((edu, i) => (
                        <div className="mc-entry" key={i}>
                          <div className="mc-entry-head"><span className="mc-entry-num">#{i + 1}</span>{education.length > 1 && <button className="mc-entry-remove" onClick={() => removeEducation(i)}>Remove</button>}</div>
                          <div className="mc-field-grid">
                            <div className="mc-field"><label className="mc-label">Degree</label><input className="mc-input" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">University</label><input className="mc-input" value={edu.university} onChange={(e) => updateEducation(i, 'university', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">Start Year</label><input className="mc-input" value={edu.startYear} onChange={(e) => updateEducation(i, 'startYear', e.target.value)} /></div>
                            <div className="mc-field"><label className="mc-label">End Year</label><input className="mc-input" value={edu.endYear} onChange={(e) => updateEducation(i, 'endYear', e.target.value)} /></div>
                          </div>
                        </div>
                      ))}
                      <button className="mc-add-btn" onClick={addEducation}>+ Add Education</button>
                    </div>
                  )}
                </div>

                {/* Skills/Langs/Interests */}
                <div className="mc-card"><div className="mc-card-head" onClick={() => toggleSection('skills')}><div className="mc-card-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div className="mc-card-title">Skills</div><span className={`mc-chevron ${openSections.skills ? 'open' : ''}`}>▾</span></div>{openSections.skills && <div className="mc-card-body"><TagInput tags={skills} setTags={setSkills} placeholder="Add a skill..." /></div>}</div>
                <div className="mc-card"><div className="mc-card-head" onClick={() => toggleSection('languages')}><div className="mc-card-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div><div className="mc-card-title">Languages</div><span className={`mc-chevron ${openSections.languages ? 'open' : ''}`}>▾</span></div>{openSections.languages && <div className="mc-card-body">{languages.map((lang, i) => (<div className="mc-lang-row" key={i}><input className="mc-input mc-lang-name" value={lang.name} onChange={(e) => updateLanguage(i, 'name', e.target.value)} /><select className="mc-select" value={lang.proficiency} onChange={(e) => updateLanguage(i, 'proficiency', e.target.value)}>{PROFICIENCY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}</select><button className="mc-lang-remove" onClick={() => removeLanguage(i)}>×</button></div>))}<button className="mc-add-btn" onClick={addLanguage}>+ Add Language</button></div>}</div>
                <div className="mc-card"><div className="mc-card-head" onClick={() => toggleSection('interests')}><div className="mc-card-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><div className="mc-card-title">Interests</div><span className={`mc-chevron ${openSections.interests ? 'open' : ''}`}>▾</span></div>{openSections.interests && <div className="mc-card-body"><TagInput tags={interests} setTags={setInterests} placeholder="Add an interest..." /></div>}</div>
              </div>
            )}

            {/* ═════════ STYLE TAB (CANVA-LIKE SUITE) ═════════ */}
            {activeTab === 'Style' && (
              <div className="mc-form-wrapper">
                
                {/* Theme Presets */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleTheme')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                    <div className="mc-card-title">Theme Presets</div><span className={`mc-chevron ${openSections.styleTheme ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleTheme && (
                    <div className="mc-card-body theme-presets-grid">
                      <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.minimal, profileImage: resumeStyle.profileImage})}>Minimal</button>
                      <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.corporate, profileImage: resumeStyle.profileImage})}>Corporate Blue</button>
                      <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.modernDark, profileImage: resumeStyle.profileImage})}>Modern Dark</button>
                      <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.creative, profileImage: resumeStyle.profileImage})}>Creative</button>
                    </div>
                  )}
                </div>

                {/* Typography */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleType')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg></div>
                    <div className="mc-card-title">Typography</div><span className={`mc-chevron ${openSections.styleType ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleType && (
                    <div className="mc-card-body">
                      <div className="mc-field-grid">
                        <div className="mc-field"><label className="mc-label">Heading Font</label><select className="mc-select" value={resumeStyle.headingFont} onChange={(e) => updateStyle('headingFont', e.target.value)}>{FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                        <div className="mc-field"><label className="mc-label">Body Font</label><select className="mc-select" value={resumeStyle.fontFamily} onChange={(e) => updateStyle('fontFamily', e.target.value)}>{FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                        <div className="mc-field"><label className="mc-label">Font Weight (Body)</label><select className="mc-select" value={resumeStyle.fontWeight} onChange={(e) => updateStyle('fontWeight', e.target.value)}><option value="300">Light</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semi-Bold</option></select></div>
                        <div className="mc-field"><label className="mc-label">Text Align</label><select className="mc-select" value={resumeStyle.textAlign} onChange={(e) => updateStyle('textAlign', e.target.value)}><option value="left">Left Aligned</option><option value="center">Centered</option><option value="justify">Justified</option></select></div>
                      </div>
                      <div className="mc-field-grid" style={{marginTop:'15px'}}>
                        <div className="style-group"><label className="mc-label">Font Size</label><div className="slider-wrap"><input className="range-slider" type="range" min="11" max="18" step="1" value={parseInt(resumeStyle.fontSize)} onChange={(e) => updateStyle('fontSize', `${e.target.value}`)} /><span className="slider-val">{resumeStyle.fontSize}px</span></div></div>
                        <div className="style-group"><label className="mc-label">Line Spacing</label><div className="slider-wrap"><input className="range-slider" type="range" min="1.2" max="2.0" step="0.1" value={parseFloat(resumeStyle.lineSpacing)} onChange={(e) => updateStyle('lineSpacing', e.target.value)} /><span className="slider-val">{resumeStyle.lineSpacing}</span></div></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleColor')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg></div>
                    <div className="mc-card-title">Colors & Borders</div><span className={`mc-chevron ${openSections.styleColor ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleColor && (
                    <div className="mc-card-body">
                      <div className="style-group mb-4">
                        <label className="mc-label">Primary Color Preset</label>
                        <div className="color-picker-grid">
                          {COLORS.map(c => (
                            <div key={c.value} className={`color-swatch ${resumeStyle.primaryColor === c.value ? 'active' : ''}`} style={{ backgroundColor: c.value }} onClick={() => updateStyle('primaryColor', c.value)} />
                          ))}
                        </div>
                      </div>
                      <div className="mc-field-grid">
                        <div className="mc-field"><label className="mc-label">Secondary / Text Color</label><input type="color" className="color-native" value={resumeStyle.secondaryColor} onChange={(e) => updateStyle('secondaryColor', e.target.value)} /></div>
                        <div className="mc-field"><label className="mc-label">Background Color</label><input type="color" className="color-native" value={resumeStyle.bgColor} onChange={(e) => updateStyle('bgColor', e.target.value)} /></div>
                        <div className="mc-field mc-field-full"><label className="mc-label">Divider Style</label><select className="mc-select w-full" value={resumeStyle.dividerStyle} onChange={(e) => updateStyle('dividerStyle', e.target.value)}><option value="line">Solid Line</option><option value="dashed">Dashed Line</option><option value="none">None</option></select></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Layout & Structure */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleLayout')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg></div>
                    <div className="mc-card-title">Layout Structure</div><span className={`mc-chevron ${openSections.styleLayout ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleLayout && (
                    <div className="mc-card-body">
                      <div className="mc-field-grid">
                        <div className="mc-field mc-field-full">
                          <label className="mc-label">Document Layout</label>
                          <select className="mc-select w-full" value={resumeStyle.layout} onChange={(e) => updateStyle('layout', e.target.value)}>
                            <option value="single">Single Column</option>
                            <option value="left-sidebar">Left Sidebar</option>
                            <option value="right-sidebar">Right Sidebar</option>
                            <option value="two-column">Two Equal Columns</option>
                          </select>
                        </div>
                      </div>
                      <div className="style-group mt-4">
                        <label className="mc-label">Document Width</label>
                        <div className="slider-wrap"><input className="range-slider" type="range" min="600" max="1000" step="50" value={parseInt(resumeStyle.contentWidth)} onChange={(e) => updateStyle('contentWidth', `${e.target.value}`)} /><span className="slider-val">{resumeStyle.contentWidth}px</span></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section & Skills Formatting */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleSection')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><line x1="4" y1="10" x2="20" y2="10"/></svg></div>
                    <div className="mc-card-title">Sections & Skills</div><span className={`mc-chevron ${openSections.styleSection ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleSection && (
                    <div className="mc-card-body">
                      <div className="mc-field-grid">
                        <div className="mc-field"><label className="mc-label">Section Wrapper</label><select className="mc-select" value={resumeStyle.sectionStyle} onChange={(e) => updateStyle('sectionStyle', e.target.value)}><option value="flat">Standard (Flat)</option><option value="card">Card / Boxed</option></select></div>
                        <div className="mc-field"><label className="mc-label">Skills Style</label><select className="mc-select" value={resumeStyle.skillStyle} onChange={(e) => updateStyle('skillStyle', e.target.value)}><option value="tags">Tags / Pills</option><option value="progress">Progress Bars</option><option value="dots">Dot Ratings</option></select></div>
                        <div className="mc-field mc-field-full"><label className="mc-checkbox-label"><input type="checkbox" checked={resumeStyle.highlightHeaders} onChange={(e) => updateStyle('highlightHeaders', e.target.checked)} /> Highlight section headers with primary background</label></div>
                      </div>
                      <div className="mc-field-grid mt-4">
                        <div className="style-group"><label className="mc-label">Section Padding</label><div className="slider-wrap"><input className="range-slider" type="range" min="0" max="32" step="4" value={parseInt(resumeStyle.padding)} onChange={(e) => updateStyle('padding', `${e.target.value}`)} /><span className="slider-val">{resumeStyle.padding}px</span></div></div>
                        <div className="style-group"><label className="mc-label">Border Radius</label><div className="slider-wrap"><input className="range-slider" type="range" min="0" max="24" step="2" value={parseInt(resumeStyle.borderRadius)} onChange={(e) => updateStyle('borderRadius', `${e.target.value}`)} /><span className="slider-val">{resumeStyle.borderRadius}px</span></div></div>
                        <div className="style-group mc-field-full"><label className="mc-label">Space Between Sections</label><div className="slider-wrap"><input className="range-slider" type="range" min="12" max="64" step="4" value={parseInt(resumeStyle.sectionSpacing)} onChange={(e) => updateStyle('sectionSpacing', `${e.target.value}`)} /><span className="slider-val">{resumeStyle.sectionSpacing}px</span></div></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile & Header */}
                <div className="mc-card">
                  <div className="mc-card-head" onClick={() => toggleSection('styleProfile')}>
                    <div className="mc-card-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div className="mc-card-title">Profile & Header</div><span className={`mc-chevron ${openSections.styleProfile ? 'open' : ''}`}>▾</span>
                  </div>
                  {openSections.styleProfile && (
                    <div className="mc-card-body">
                      <div className="mc-field mc-field-full mb-4">
                        <label className="mc-label">Profile Image Upload</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{color: '#94a3b8', fontSize: '0.8rem'}} />
                        {resumeStyle.profileImage && <button onClick={()=>updateStyle('profileImage',null)} className="mc-lang-remove" style={{fontSize:'0.8rem'}}>Clear Image</button>}
                      </div>
                      <div className="mc-field-grid">
                        <div className="mc-field"><label className="mc-label">Image Shape</label><select className="mc-select" value={resumeStyle.profileShape} onChange={(e) => updateStyle('profileShape', e.target.value)}><option value="circle">Circle</option><option value="square">Square</option></select></div>
                        <div className="mc-field"><label className="mc-label">Header Alignment</label><select className="mc-select" value={resumeStyle.headerAlign} onChange={(e) => updateStyle('headerAlign', e.target.value)}><option value="left">Left Aligned</option><option value="centered">Centered</option><option value="right">Right Aligned</option></select></div>
                        <div className="mc-field"><label className="mc-label">Contact Icons</label><select className="mc-select" value={resumeStyle.iconsEnabled} onChange={(e) => updateStyle('iconsEnabled', e.target.value === 'true')}><option value="true">Visible</option><option value="false">Hidden</option></select></div>
                        <div className="mc-field"><label className="mc-checkbox-label" style={{height:'100%', alignItems:'flex-end'}}><input type="checkbox" checked={resumeStyle.headerBanner} onChange={(e) => updateStyle('headerBanner', e.target.checked)} /> Add Banner Background</label></div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeTab === 'Settings' && <div style={{ padding: '2rem', color: '#94a3b8', textAlign: 'center' }}>Settings area.</div>}
          </div>
        </div>

        {/* ── LIVE PREVIEW PANEL ── */}
        <div className="preview-panel">
          <div className="pp-head">
            <div className="pp-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-dot" /> Live Preview
            </div>
            <div className="pp-zoom"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> 75%</div>
          </div>
          <div className="pp-scroll">
            
            {/* INJECT DYNAMIC STYLE STATE HERE */}
            <div className={`resume-sheet layout-${resumeStyle.layout}`} style={{
              width: `${resumeStyle.contentWidth}px`,
              fontFamily: resumeStyle.fontFamily,
              fontSize: `${resumeStyle.fontSize}px`,
              fontWeight: resumeStyle.fontWeight,
              lineHeight: resumeStyle.lineSpacing,
              textAlign: resumeStyle.textAlign,
              backgroundColor: resumeStyle.bgColor,
              '--doc-accent': resumeStyle.primaryColor,
              '--doc-secondary': resumeStyle.secondaryColor,
              '--heading-font': resumeStyle.headingFont,
              '--divider-style': resumeStyle.dividerStyle === 'none' ? 'none' : `1px ${resumeStyle.dividerStyle} var(--doc-secondary)`,
              '--sec-space': `${resumeStyle.sectionSpacing}px`
            }}>

              {/* Header Configuration */}
              <div 
                className={`rs-header-wrap align-${resumeStyle.headerAlign} ${resumeStyle.headerBanner ? 'has-banner' : ''}`} 
                style={{ 
                  borderBottom: resumeStyle.layout === 'single' || resumeStyle.layout === 'two-column' ? 'var(--divider-style)' : 'none',
                  backgroundColor: resumeStyle.headerBanner ? resumeStyle.primaryColor : 'transparent',
                  color: resumeStyle.headerBanner ? 'white' : 'inherit'
                }}
              >
                {resumeStyle.profileImage && (
                  <img src={resumeStyle.profileImage} alt="Profile" className={`rs-profile-img shape-${resumeStyle.profileShape}`} />
                )}
                <div className="rs-header-text">
                  <div className="rs-name" style={{ fontFamily: resumeStyle.headingFont, color: resumeStyle.headerBanner ? 'white' : '#0f172a' }}>{personalInfo.fullName}</div>
                  <div className="rs-role" style={{ color: resumeStyle.headerBanner ? 'white' : resumeStyle.primaryColor }}>{personalInfo.jobTitle}</div>
                  <ContactInfo />
                </div>
              </div>

              {/* Grid Content Distribution based on Layout */}
              {resumeStyle.layout === 'single' && (
                <div className="rs-layout-single"><MainContent /><SideContent /></div>
              )}
              {resumeStyle.layout === 'left-sidebar' && (
                <div className="rs-layout-sidebar left"><div className="rs-sidebar"><SideContent /></div><div className="rs-main"><MainContent /></div></div>
              )}
              {resumeStyle.layout === 'right-sidebar' && (
                <div className="rs-layout-sidebar right"><div className="rs-main"><MainContent /></div><div className="rs-sidebar"><SideContent /></div></div>
              )}
              {resumeStyle.layout === 'two-column' && (
                <div className="rs-layout-two"><div className="rs-col1"><MainContent /></div><div className="rs-col2"><SideContent /></div></div>
              )}

            </div>
          </div>
        </div>

        {/* AI Sidebar remains unchanged mostly */}
        <div className="ai-panel">
          <div className="ap-head"><div className="ap-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> AI Suggestions</div></div>
          <div className="ap-scroll">
            {sugs.length === 0 && <div style={{textAlign:'center',padding:'32px 16px',color:'var(--text-muted)'}}>All suggestions reviewed!</div>}
          </div>
          <div className="ai-prompt-area"><textarea className="ai-prompt-input" placeholder="Ask AI..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} /><button className="ai-send" onClick={() => setAiPrompt('')}>Send to AI</button></div>
        </div>
      </div>
    </div>
  );
}