import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import '../styles/builder.css';

import ContentPanel from '../components/builder/ContentPanel';
import StylePanel, { THEME_PRESETS } from '../components/builder/StylePanel';

// ── Icons (Dynamically styled based on iconStyle) ──
const getIconProps = (style) => ({
  fill: style === 'filled' ? 'currentColor' : 'none',
  strokeWidth: style === 'outline' ? '2.5' : (style === 'filled' ? '1' : '1.5'),
});

const IconMail = ({ istyle }) => <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" {...getIconProps(istyle)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone = ({ istyle }) => <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" {...getIconProps(istyle)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconMap = ({ istyle }) => <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" {...getIconProps(istyle)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconLink = ({ istyle }) => <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" {...getIconProps(istyle)}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

const initSuggestions = [
  { type:'improve', typeLabel:'Improve', original:'worked on website features', improved:'Developed and shipped 12 responsive web features, increasing user engagement by 30% and reducing bounce rate by 18%.' },
  { type:'fix', typeLabel:'Fix Grammar', original:'Builded a CI/CD pipeline for deploy', improved:'Built and maintained a CI/CD pipeline using GitHub Actions, reducing deployment time from 45 to 8 minutes.' },
  { type:'good', typeLabel:'Strong', original:null, improved:'Your skills section has excellent keyword coverage for senior engineering roles.' },
];

const SAMPLE_DATA = {
  personalInfo: {
    fullName: 'John Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-1234',
    city: 'San Francisco, CA',
    linkedin: 'johndoe',
    portfolio: 'johndoe.dev'
  },
  summary: 'Results-driven Senior Software Engineer with 8+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Proven track record of leading cross-functional teams and delivering high-impact technical solutions.',
  experiences: [
    {
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      startDate: 'Jan 2020',
      endDate: 'Present',
      current: true,
      description: '• Led the development of a high-traffic e-commerce platform using React and Node.js.\n• Optimized database queries, reducing API latency by 40%.\n• Mentored junior developers and implemented CI/CD best practices.'
    },
    {
      jobTitle: 'Software Engineer',
      company: 'Creative Apps LLC',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      current: false,
      description: '• Developed and maintained multiple client-facing web applications.\n• Collaborated with designers to implement responsive and intuitive user interfaces.\n• Improved application performance by 25% through code refactor and caching strategies.'
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      university: 'State University',
      startYear: '2012',
      endYear: '2016',
      details: 'GPA: 3.8/4.0'
    }
  ],
  skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'SQL', 'Git'],
  languages: [
    { name: 'English', proficiency: 'Native / Bilingual' },
    { name: 'Spanish', proficiency: 'Professional Working' }
  ],
  interests: ['Open Source', 'Photography', 'Hiking']
};

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('id');

  const [currentId, setCurrentId] = useState(paramId);
  const [activeTab, setActiveTab] = useState('Style');
  const [sugs, setSugs] = useState(initSuggestions);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [toast, setToast] = useState(null);

  const saveTimer = useRef(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Style & Content States ──
  const [resumeStyle, setResumeStyle] = useState({ ...THEME_PRESETS.corporate, profileImage: null });
  const [personalInfo, setPersonalInfo] = useState(SAMPLE_DATA.personalInfo);
  const [summary, setSummary] = useState(SAMPLE_DATA.summary);
  const [experiences, setExperiences] = useState(SAMPLE_DATA.experiences);
  const [education, setEducation] = useState(SAMPLE_DATA.education);
  const [skills, setSkills] = useState(SAMPLE_DATA.skills);
  const [languages, setLanguages] = useState(SAMPLE_DATA.languages);
  const [interests, setInterests] = useState(SAMPLE_DATA.interests);

  // Initialization (API fetch)
  useEffect(() => {
    const initResume = async () => {
      if (paramId) {
        try {
          const response = await api.authenticatedRequest(`/resumes/${paramId}/`);
          if (response.ok) {
            const data = await response.json();
            setResumeTitle(data.title || 'Untitled Resume');
            setCurrentId(String(data.id));
            if (data.content && Object.keys(data.content).length > 0) {
              if (data.content.personalInfo) setPersonalInfo(data.content.personalInfo);
              if (data.content.summary) setSummary(data.content.summary);
              if (data.content.experiences) setExperiences(data.content.experiences);
              if (data.content.education) setEducation(data.content.education);
              if (data.content.skills) setSkills(data.content.skills);
              if (data.content.languages) setLanguages(data.content.languages);
              if (data.content.interests) setInterests(data.content.interests);
              if (data.content.resumeStyle) {
                setResumeStyle(prev => ({ ...prev, ...data.content.resumeStyle }));
              }
            }
          }
        } catch (err) { console.error('Failed to load format:', err); }
      } else {
        try {
          const initialContent = { personalInfo, summary, experiences, education, skills, languages, interests, resumeStyle };
          const response = await api.authenticatedRequest('/resumes/', {
            method: 'POST', 
            body: JSON.stringify({ 
              title: "My New Resume", 
              content: initialContent 
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentId(String(data.id));
            setSearchParams({ id: data.id }, { replace: true });
          }
        } catch (err) { console.error('Failed to init format:', err); }
      }
    };
    initResume();
  }, [paramId, setSearchParams]);

  // Unified Save payload
  const autoSave = useCallback(() => {
    if (!currentId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const fullContent = { personalInfo, summary, experiences, education, skills, languages, interests, resumeStyle };
        await api.authenticatedRequest(`/resumes/${currentId}/`, {
          method: 'PUT',
          body: JSON.stringify({ title: resumeTitle || personalInfo.fullName + " Resume", content: fullContent }),
        });
      } catch (err) { console.error('Save failed:', err); } 
      finally { setSaving(false); }
    }, 1500);
  }, [currentId, personalInfo, summary, experiences, education, skills, languages, interests, resumeStyle, resumeTitle]);

  useEffect(() => { if (currentId) autoSave(); return () => { if(saveTimer.current) clearTimeout(saveTimer.current); }; }, [autoSave, currentId]);

  // AI Logic
  const handleAskAi = async () => {
    if (!aiPrompt.trim() || !currentId) return;
    setAiLoading(true);
    try {
      const response = await api.authenticatedRequest(`/resumes/${currentId}/ask_ai/`, {
        method: 'POST', body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && Array.isArray(data.suggestions)) setSugs(data.suggestions);
      }
    } catch (err) { console.error('AI error:', err); } 
    finally { setAiLoading(false); setAiPrompt(''); }
  };

  // ── UI Control Handlers ──
  const [openSections, setOpenSections] = useState({
    personal: true, summary: true, experience: true, education: true, skills: true, languages: true, interests: true,
    styleTheme: true, styleType: false, styleColor: false, styleLayout: false, styleSection: false, styleProfile: false
  });
  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateStyle('profileImage', reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ── Missing Features (Star & Percentage Styling) ──
  const renderSkill = (skill, i) => {
    const w = Math.floor(Math.random() * 30 + 70); // Mock score 70-100%
    const cColor = resumeStyle.skillColor || resumeStyle.primaryColor;

    if(resumeStyle.skillStyle === 'progress') {
      return (
        <div key={i} className="rs-skill-prog-item">
          <div className="rs-skill-name">{skill}</div>
          <div className="rs-skill-bar-wrap"><div className="rs-skill-bar-fill" style={{ width: `${w}%`, background: cColor }} /></div>
        </div>
      );
    }
    if(resumeStyle.skillStyle === 'dots') {
      return (
        <div key={i} className="rs-skill-dot-item">
          <div className="rs-skill-name">{skill}</div>
          <div className="rs-skill-dots">{[1,2,3,4,5].map(d => <span key={d} className="rs-dot" style={{ background: d < 5 ? cColor : '#e2e8f0' }} />)}</div>
        </div>
      );
    }
    if(resumeStyle.skillStyle === 'stars') {
      return (
        <div key={i} className="rs-skill-star-item" style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
          <div className="rs-skill-name">{skill}</div>
          <div className="rs-skill-stars" style={{color: cColor, fontSize:'1.1em', letterSpacing:'-2px'}}>★★★★<span style={{color: '#e2e8f0'}}>★</span></div>
        </div>
      );
    }
    if(resumeStyle.skillStyle === 'percentages') {
      return (
        <div key={i} className="rs-skill-pct-item" style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', borderBottom:`1px dotted #cbd5e1`, margin:'2px 0'}}>
          <div className="rs-skill-name" style={{fontWeight:500}}>{skill}</div>
          <div className="rs-skill-pct" style={{color: cColor, fontWeight:700, fontSize:'0.9rem'}}>{w}%</div>
        </div>
      );
    }
    return <span className="rs-skill" style={{ background: cColor, color: '#334155' }} key={i}>{skill}</span>;
  };

  const ContactInfo = () => (
    <div className="rs-contact" style={{ justifyContent: resumeStyle.headerAlign === 'centered' ? 'center' : 'flex-start' }}>
      {personalInfo.email && <span>{resumeStyle.iconsEnabled && <IconMail istyle={resumeStyle.iconStyle}/>} {personalInfo.email}</span>}
      {personalInfo.phone && <span>{resumeStyle.iconsEnabled && <IconPhone istyle={resumeStyle.iconStyle}/>} {personalInfo.phone}</span>}
      {personalInfo.city && <span>{resumeStyle.iconsEnabled && <IconMap istyle={resumeStyle.iconStyle}/>} {personalInfo.city}</span>}
      {personalInfo.linkedin && <span>{resumeStyle.iconsEnabled && <IconLink istyle={resumeStyle.iconStyle}/>} linkedin.com/{personalInfo.linkedin}</span>}
      {personalInfo.portfolio && <span>{resumeStyle.iconsEnabled && <IconLink istyle={resumeStyle.iconStyle}/>} {personalInfo.portfolio}</span>}
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
              {exp.description && <ul className="rs-bullets">{exp.description.split('\n').filter(Boolean).map((b, j) => <li className="rs-bullet" key={j}>{b.replace(/^[-•]\s*/, '')}</li>)}</ul>}
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
        <div className={`rs-skills ${resumeStyle.skillStyle!=='tags'?'rs-skills-col':''}`}>{skills.map((s,i) => renderSkill(s, i))}</div>
      </div>
      {languages.length > 0 && languages.some(l => l.name) && (
        <div className={`rs-section ${resumeStyle.sectionStyle==='card'?'rs-card':''}`} style={{ marginBottom: `${resumeStyle.sectionSpacing}px`, borderRadius: `${resumeStyle.borderRadius}px`, padding: `${resumeStyle.padding}px` }}>
          <div className={`rs-sec-title ${resumeStyle.highlightHeaders?'rs-hl-header':''}`}>Languages</div>
          <div className="rs-list">{languages.map((l, i) => (<div key={i} className="rs-list-item"><strong>{l.name}</strong><span className="rs-light" style={{color:resumeStyle.secondaryColor}}> — {l.proficiency}</span></div>))}</div>
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
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 24px', borderRadius: 12,
          background: toast.type === 'error' ? 'linear-gradient(135deg, #ff4d4d, #cc0000)' : 'linear-gradient(135deg, #4F6EF7, #3b5de7)',
          color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(79,110,247,0.35)',
          display: 'flex', alignItems: 'center', gap: 10, animation: 'slideInRight 0.35s ease-out',
        }}><span style={{ fontSize: 18 }}>{toast.type === 'error' ? '❌' : '✅'}</span>{toast.message}</div>
      )}
      <div className="builder-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Dashboard</button>
          <div className="tb-divider" />
          <div className="builder-title">
            <input 
              style={{background:'transparent', border:'none', color:'inherit', fontSize:'inherit', fontWeight:'inherit', outline:'none'}}
              value={resumeTitle} onChange={e => setResumeTitle(e.target.value)}
            />
          </div>
          {saving && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Saving...</span>}
        </div>
        <div className="builder-tb-right">
          <button className="btn-outline" onClick={() => updateStyle('fontFamily', "'Inter', sans-serif")}>↻ Reset</button>
          <button className="btn-outline" onClick={() => navigate(`/analysis?id=${currentId}`)}>Analyze</button>
          <button className="btn-solid" onClick={() => window.print()}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export</button>
        </div>
      </div>

      <div className="workspace">
        <div className="editor-panel">
          <div className="ep-tabs">
            {['Content', 'Style'].map(t => (
              <div key={t} className={`ep-tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>{t}</div>
            ))}
          </div>
          <div className="ep-scroll">
            
            {/* Inject modular panels! */}
            {activeTab === 'Content' && (
              <ContentPanel 
                personalInfo={personalInfo} updatePersonal={updatePersonal}
                summary={summary} setSummary={setSummary}
                experiences={experiences} addExperience={addExperience} removeExperience={removeExperience} updateExperience={updateExperience}
                education={education} addEducation={addEducation} removeEducation={removeEducation} updateEducation={updateEducation}
                skills={skills} setSkills={setSkills}
                languages={languages} addLanguage={addLanguage} removeLanguage={removeLanguage} updateLanguage={updateLanguage}
                interests={interests} setInterests={setInterests}
                openSections={openSections} toggleSection={toggleSection}
              />
            )}

            {activeTab === 'Style' && (
              <StylePanel 
                resumeStyle={resumeStyle} 
                setResumeStyle={setResumeStyle} 
                updateStyle={updateStyle} 
                openSections={openSections} 
                toggleSection={toggleSection} 
                handleImageUpload={handleImageUpload} 
              />
            )}
          </div>
        </div>

        {/* ── LIVE PREVIEW PANEL ── */}
        <div className="preview-panel">
          <div className="pp-head"><div className="pp-label"><span className="live-dot" /> Live Preview</div></div>
          <div className="pp-scroll">
            <div className={`resume-sheet layout-${resumeStyle.layout}`} style={{
              width: `${resumeStyle.contentWidth}px`, fontFamily: resumeStyle.fontFamily, fontSize: `${resumeStyle.fontSize}px`,
              fontWeight: resumeStyle.fontWeight, lineHeight: resumeStyle.lineSpacing, textAlign: resumeStyle.textAlign, backgroundColor: resumeStyle.bgColor,
              '--doc-accent': resumeStyle.primaryColor, '--doc-secondary': resumeStyle.secondaryColor, '--heading-font': resumeStyle.headingFont,
              '--divider-style': resumeStyle.dividerStyle === 'none' ? 'none' : `1px ${resumeStyle.dividerStyle} var(--doc-secondary)`, '--sec-space': `${resumeStyle.sectionSpacing}px`
            }}>
              <div className={`rs-header-wrap align-${resumeStyle.headerAlign} ${resumeStyle.headerBanner ? 'has-banner' : ''}`} style={{ borderBottom: resumeStyle.layout === 'single' || resumeStyle.layout === 'two-column' ? 'var(--divider-style)' : 'none', backgroundColor: resumeStyle.headerBanner ? resumeStyle.primaryColor : 'transparent', color: resumeStyle.headerBanner ? 'white' : 'inherit' }}>
                {resumeStyle.profileImage && <img src={resumeStyle.profileImage} alt="Profile" className={`rs-profile-img shape-${resumeStyle.profileShape}`} />}
                <div className="rs-header-text">
                  <div className="rs-name" style={{ fontFamily: resumeStyle.headingFont, color: resumeStyle.headerBanner ? 'white' : '#0f172a' }}>{personalInfo.fullName}</div>
                  <div className="rs-role" style={{ color: resumeStyle.headerBanner ? 'white' : resumeStyle.primaryColor }}>{personalInfo.jobTitle}</div>
                  <ContactInfo />
                </div>
              </div>
              {resumeStyle.layout === 'single' && <div className="rs-layout-single"><MainContent /><SideContent /></div>}
              {resumeStyle.layout === 'left-sidebar' && <div className="rs-layout-sidebar left"><div className="rs-sidebar"><SideContent /></div><div className="rs-main"><MainContent /></div></div>}
              {resumeStyle.layout === 'right-sidebar' && <div className="rs-layout-sidebar right"><div className="rs-main"><MainContent /></div><div className="rs-sidebar"><SideContent /></div></div>}
              {resumeStyle.layout === 'two-column' && <div className="rs-layout-two"><div className="rs-col1"><MainContent /></div><div className="rs-col2"><SideContent /></div></div>}
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="ai-panel">
          <div className="ap-head"><div className="ap-title">AI Suggestions</div></div>
          <div className="ap-scroll">
            {sugs.map((s,i) => (
              <div className="sug-card" key={i} style={{marginBottom:'10px', padding:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'8px'}}>
                <div style={{color: s.type === 'fix'?'#ef4444':'#fbbf24', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'4px'}}>{s.typeLabel}</div>
                <div style={{fontSize:'0.85rem'}}>{s.improved}</div>
              </div>
            ))}
            {sugs.length === 0 && <div style={{textAlign:'center',padding:'32px 16px',color:'var(--text-muted)'}}>All suggestions reviewed!</div>}
          </div>
          <div className="ai-prompt-area">
            <textarea className="ai-prompt-input" placeholder="Ask AI..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
            <button className="ai-send" onClick={handleAskAi}>{aiLoading ? 'Thinking...' : 'Send to AI'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}