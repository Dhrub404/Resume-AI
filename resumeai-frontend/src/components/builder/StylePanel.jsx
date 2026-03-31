import React from 'react';
import { FONTS, COLORS, THEME_PRESETS } from '../../utils/themeConstants';

export default function StylePanel({ resumeStyle, setResumeStyle, updateStyle, openSections, toggleSection, handleImageUpload }) {
  return (
    <div className="mc-form-wrapper">
      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleTheme')}><div className="mc-card-title">Theme Presets</div><span className={`mc-chevron ${openSections.styleTheme ? 'open' : ''}`}>▾</span></div>
        {openSections.styleTheme && (
          <div className="mc-card-body theme-presets-grid">
            <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.minimal, profileImage: resumeStyle.profileImage})}>Minimal</button>
            <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.corporate, profileImage: resumeStyle.profileImage})}>Corporate Blue</button>
            <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.modernDark, profileImage: resumeStyle.profileImage})}>Modern Dark</button>
            <button className="theme-btn" onClick={() => setResumeStyle({...THEME_PRESETS.creative, profileImage: resumeStyle.profileImage})}>Creative</button>
          </div>
        )}
      </div>

      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleType')}><div className="mc-card-title">Typography</div><span className={`mc-chevron ${openSections.styleType ? 'open' : ''}`}>▾</span></div>
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

      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleColor')}><div className="mc-card-title">Colors & Borders</div><span className={`mc-chevron ${openSections.styleColor ? 'open' : ''}`}>▾</span></div>
        {openSections.styleColor && (
          <div className="mc-card-body">
            <div className="style-group mb-4">
              <label className="mc-label">Primary Color Preset</label>
              <div className="color-picker-grid">{COLORS.map(c => <div key={c.value} className={`color-swatch ${resumeStyle.primaryColor === c.value ? 'active' : ''}`} style={{ backgroundColor: c.value }} onClick={() => updateStyle('primaryColor', c.value)} />)}</div>
            </div>
            <div className="mc-field-grid">
              <div className="mc-field"><label className="mc-label">Secondary / Text Color</label><input type="color" className="color-native" value={resumeStyle.secondaryColor} onChange={(e) => updateStyle('secondaryColor', e.target.value)} /></div>
              <div className="mc-field"><label className="mc-label">Background Color</label><input type="color" className="color-native" value={resumeStyle.bgColor} onChange={(e) => updateStyle('bgColor', e.target.value)} /></div>
              <div className="mc-field mc-field-full"><label className="mc-label">Divider Style</label><select className="mc-select w-full" value={resumeStyle.dividerStyle} onChange={(e) => updateStyle('dividerStyle', e.target.value)}><option value="line">Solid Line</option><option value="dashed">Dashed Line</option><option value="none">None</option></select></div>
            </div>
          </div>
        )}
      </div>

      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleLayout')}><div className="mc-card-title">Layout Structure</div><span className={`mc-chevron ${openSections.styleLayout ? 'open' : ''}`}>▾</span></div>
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

      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleSection')}><div className="mc-card-title">Sections & Skills</div><span className={`mc-chevron ${openSections.styleSection ? 'open' : ''}`}>▾</span></div>
        {openSections.styleSection && (
          <div className="mc-card-body">
            <div className="mc-field-grid">
              <div className="mc-field"><label className="mc-label">Section Wrapper</label><select className="mc-select" value={resumeStyle.sectionStyle} onChange={(e) => updateStyle('sectionStyle', e.target.value)}><option value="flat">Standard (Flat)</option><option value="card">Card / Boxed</option></select></div>
              <div className="mc-field">
                <label className="mc-label">Skills Style</label>
                <select className="mc-select" value={resumeStyle.skillStyle} onChange={(e) => updateStyle('skillStyle', e.target.value)}>
                  <option value="tags">Tags / Pills</option>
                  <option value="progress">Progress Bars</option>
                  <option value="dots">Dot Ratings</option>
                  <option value="stars">Star Ratings</option>
                  <option value="percentages">Percentage Text</option>
                </select>
              </div>
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

      <div className="mc-card">
        <div className="mc-card-head" onClick={() => toggleSection('styleProfile')}><div className="mc-card-title">Profile & Icons</div><span className={`mc-chevron ${openSections.styleProfile ? 'open' : ''}`}>▾</span></div>
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
              <div className="mc-field">
                <label className="mc-label">Icon Style</label>
                <select className="mc-select" value={resumeStyle.iconStyle} onChange={(e) => updateStyle('iconStyle', e.target.value)} disabled={!resumeStyle.iconsEnabled}>
                  <option value="minimal">Minimal Line</option>
                  <option value="outline">Thick Outline</option>
                  <option value="filled">Filled Box</option>
                </select>
              </div>

              <div className="mc-field mc-field-full mt-4"><label className="mc-checkbox-label" style={{height:'100%', alignItems:'flex-end'}}><input type="checkbox" checked={resumeStyle.headerBanner} onChange={(e) => updateStyle('headerBanner', e.target.checked)} /> Wrap Header with Background Banner</label></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
