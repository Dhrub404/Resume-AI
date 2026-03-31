import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { api } from '../api';
import '../styles/templates.css';

// Static thumbnail visuals (kept client-side since they're just UI decorations)
const thumbs = {
  'modern': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#e2e8f0', marginBottom:5 }} />
      <div style={{ height:4, background:'#4F6EF7', borderRadius:1, marginBottom:4, width:'90%' }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:3, width:'70%' }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'85%' }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'90%' }} />
    </div>
  ),
  'classic': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
      <div style={{ height:5, background:'#1e293b', borderRadius:1, marginBottom:4, width:'80%' }} />
      <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:7, width:'60%' }} />
      <div style={{ height:1, background:'#e2e8f0', marginBottom:5 }} />
      <div style={{ height:3, background:'#1e293b', borderRadius:1, marginBottom:3, width:'50%' }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
      <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
    </div>
  ),
  'executive': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px', display:'grid', gridTemplateColumns:'1fr 2fr', gap:4 }}>
      <div style={{ background:'#1e293b', borderRadius:2, padding:5 }}>
        <div style={{ width:14, height:14, borderRadius:'50%', background:'rgba(255,255,255,0.8)', marginBottom:4 }} />
        <div style={{ height:1.5, background:'rgba(255,255,255,0.4)', marginBottom:2, borderRadius:1 }} />
        <div style={{ height:1.5, background:'rgba(255,255,255,0.4)', borderRadius:1, width:'80%' }} />
      </div>
      <div style={{ paddingTop:2 }}>
        <div style={{ height:3, background:'#1e293b', borderRadius:1, marginBottom:3, width:'80%' }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'75%' }} />
      </div>
    </div>
  ),
  'creative': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
      <div style={{ height:5, background:'#059669', borderRadius:1, marginBottom:4, width:'85%' }} />
      <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:6, width:'55%' }} />
      <div style={{ height:2, background:'#059669', borderRadius:1, marginBottom:4, width:'45%' }} />
      <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
      <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
    </div>
  ),
  'minimal': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
      <div style={{ height:5, background:'#334155', borderRadius:1, marginBottom:3, width:'75%' }} />
      <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:8, width:'50%' }} />
      <div style={{ height:3, background:'#334155', borderRadius:1, marginBottom:3, width:'45%' }} />
      <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
      <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'72%' }} />
    </div>
  ),
  'tech': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px', display:'grid', gridTemplateColumns:'20px 1fr', gap:4 }}>
      <div style={{ background:'#1e293b', borderRadius:2, padding:'6px 3px', display:'flex', flexDirection:'column', gap:3, alignItems:'center' }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(255,255,255,0.7)' }} />
        <div style={{ height:1.5, background:'rgba(255,255,255,0.3)', width:'100%', borderRadius:1 }} />
        <div style={{ height:1.5, background:'rgba(255,255,255,0.3)', width:'100%', borderRadius:1 }} />
      </div>
      <div>
        <div style={{ height:4, background:'#4F6EF7', borderRadius:1, marginBottom:3 }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'90%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
      </div>
    </div>
  ),
  'elegant': (
    <div style={{ width:75, background:'#fffbf7', borderRadius:3, padding:'8px 7px', border:'1px solid #f0e6d3' }}>
      <div style={{ height:5, background:'#92400e', borderRadius:1, marginBottom:4, width:'80%' }} />
      <div style={{ height:1, background:'#d97706', marginBottom:5 }} />
      <div style={{ height:2, background:'#78716c', borderRadius:1, marginBottom:2, width:'95%' }} />
      <div style={{ height:2, background:'#78716c', borderRadius:1, width:'88%' }} />
    </div>
  ),
  'compact': (
    <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px 7px' }}>
      <div style={{ height:4, background:'#1e293b', borderRadius:1, marginBottom:2, width:'70%' }} />
      <div style={{ height:1.5, background:'#94a3b8', borderRadius:1, marginBottom:5, width:'55%' }} />
      <div style={{ height:2, background:'#7c3aed', borderRadius:1, marginBottom:2, width:'40%' }} />
      {[90,80,85,75].map((w,i) => (
        <div key={i} style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:`${w}%` }} />
      ))}
    </div>
  ),
};

const badgeMap = { 1: { badge: 'popular', label: 'Popular' }, 3: { badge: 'new', label: 'New' }, 6: { badge: 'new', label: 'New' } };

const filters = ['All', 'Professional', 'Creative', 'Minimal', 'Two-Column'];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.authenticatedRequest('/templates/');
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : (data.results || []);
          setTemplates(list);
          if (list.length > 0) setSelected(list[0].id);
        }
      } catch (err) { console.error('Failed to load templates:', err); }
    };
    fetchTemplates();
  }, []);

  // Clone template → personal resume copy → navigate to builder
  const handleUseTemplate = async (templateId, e) => {
    if (e) e.stopPropagation();
    setLoading(true);
    try {
      const response = await api.authenticatedRequest(`/templates/${templateId}/use/`, {
        method: 'POST',
      });
      if (response.ok) {
        const newResume = await response.json();
        navigate(`/builder?id=${newResume.id}`);
      }
    } catch (err) { console.error('Failed to use template:', err); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout title="Resume Builder">
      <div className="templates-header">
        <h2>Choose a Template</h2>
        <p>Pick a design that matches your style. Each template creates a fresh copy — your originals are never touched.</p>
      </div>

      <div className="templates-filters">
        {filters.map(f => (
          <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="templates-grid">
        {templates.filter(t => activeFilter === 'All' || t.category === activeFilter).map(t => {
          const badgeInfo = badgeMap[t.id];
          return (
            <div key={t.id} className={`tpl-card ${selected === t.id ? 'selected' : ''}`} onClick={() => setSelected(t.id)}>
              <div className="tpl-preview">
                {thumbs[t.slug] || thumbs['modern']}
                {badgeInfo && <div className={`tpl-badge badge-${badgeInfo.badge}`}>{badgeInfo.label}</div>}
                {selected === t.id && (
                  <div className="selected-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
              <div className="tpl-body">
                <div className="tpl-name">{t.name}</div>
                <div className="tpl-desc">{t.description}</div>
                <div className="tpl-actions">
                  {selected === t.id ? (
                    <div className="tpl-selected-label">Selected</div>
                  ) : (
                    <>
                      <button className="tpl-preview-btn">Preview</button>
                      <button className="tpl-use-btn" disabled={loading} onClick={(e) => handleUseTemplate(t.id, e)}>Use This</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => handleUseTemplate(selected)}
            disabled={loading}
            style={{ background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, padding: '12px 32px', cursor: 'pointer' }}
          >
            {loading ? 'Creating...' : `Continue with ${templates.find(t => t.id === selected)?.name || ''} Template →`}
          </button>
        </div>
      )}
    </AppLayout>
  );
}