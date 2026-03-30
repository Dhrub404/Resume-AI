import React, { useState } from 'react';

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

const PROFICIENCY_LEVELS = ['Native / Bilingual', 'Full Professional', 'Professional Working', 'Limited Working', 'Elementary'];

export default function ContentPanel({
  personalInfo, updatePersonal,
  summary, setSummary,
  experiences, addExperience, removeExperience, updateExperience,
  education, addEducation, removeEducation, updateEducation,
  skills, setSkills,
  languages, addLanguage, removeLanguage, updateLanguage,
  interests, setInterests,
  openSections, toggleSection
}) {
  return (
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
                <div className="mc-entry-head"><span className="mc-entry-num">#{i + 1}</span><button className="mc-entry-remove" onClick={() => removeExperience(i)}>Remove</button></div>
                <div className="mc-field-grid">
                  <div className="mc-field"><label className="mc-label">Job Title</label><input className="mc-input" value={exp.jobTitle} onChange={(e) => updateExperience(i, 'jobTitle', e.target.value)} /></div>
                  <div className="mc-field"><label className="mc-label">Company</label><input className="mc-input" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} /></div>
                  <div className="mc-field"><label className="mc-label">Start Date</label><input className="mc-input" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} /></div>
                  <div className="mc-field"><label className="mc-label">End Date</label><div className="mc-end-date-wrap"><input className="mc-input" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} disabled={exp.current} /></div></div>
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
                <div className="mc-entry-head"><span className="mc-entry-num">#{i + 1}</span><button className="mc-entry-remove" onClick={() => removeEducation(i)}>Remove</button></div>
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
  );
}
