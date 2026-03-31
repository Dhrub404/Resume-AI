import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, slideUpItem, scaleHover, tapEffect } from '../utils/motionVariants';
import AppLayout from '../components/layout/AppLayout';
import '../styles/templates.css';

const templates = [
  {
    id: 1, name: 'Modern', desc: 'Clean with blue accents', badge: 'popular', badgeLabel: 'Popular', category: 'Professional',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
        <div style={{ width:16, height:16, borderRadius:'50%', background:'#e2e8f0', marginBottom:5 }} />
        <div style={{ height:4, background:'#4F6EF7', borderRadius:1, marginBottom:4, width:'90%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:3, width:'70%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'85%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'70%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'90%' }} />
      </div>
    ),
  },
  {
    id: 2, name: 'Classic', desc: 'Traditional & timeless', badge: null, category: 'Professional',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
        <div style={{ height:5, background:'#1e293b', borderRadius:1, marginBottom:4, width:'80%' }} />
        <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:7, width:'60%' }} />
        <div style={{ height:1, background:'#e2e8f0', marginBottom:5 }} />
        <div style={{ height:3, background:'#1e293b', borderRadius:1, marginBottom:3, width:'50%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'85%' }} />
        <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
      </div>
    ),
  },
  {
    id: 3, name: 'Executive', desc: 'Two-column bold layout', badge: 'new', badgeLabel: 'New', category: 'Two-Column',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px', display:'grid', gridTemplateColumns:'1fr 2fr', gap:4 }}>
        <div style={{ background:'#1e293b', borderRadius:2, padding:5 }}>
          <div style={{ width:14, height:14, borderRadius:'50%', background:'rgba(255,255,255,0.8)', marginBottom:4 }} />
          <div style={{ height:1.5, background:'rgba(255,255,255,0.4)', marginBottom:2, borderRadius:1 }} />
          <div style={{ height:1.5, background:'rgba(255,255,255,0.4)', marginBottom:2, borderRadius:1, width:'80%' }} />
        </div>
        <div style={{ paddingTop:2 }}>
          <div style={{ height:3, background:'#1e293b', borderRadius:1, marginBottom:3, width:'80%' }} />
          <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
          <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'90%' }} />
          <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'75%' }} />
        </div>
      </div>
    ),
  },
  {
    id: 4, name: 'Creative', desc: 'Bold green accents', badge: null, category: 'Creative',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
        <div style={{ height:5, background:'#059669', borderRadius:1, marginBottom:4, width:'85%' }} />
        <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:6, width:'55%' }} />
        <div style={{ height:2, background:'#059669', borderRadius:1, marginBottom:4, width:'45%' }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'80%' }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
      </div>
    ),
  },
  {
    id: 5, name: 'Minimal', desc: 'Ultra clean, no color', badge: null, category: 'Minimal',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'8px 7px' }}>
        <div style={{ height:5, background:'#334155', borderRadius:1, marginBottom:3, width:'75%' }} />
        <div style={{ height:2, background:'#94a3b8', borderRadius:1, marginBottom:8, width:'50%' }} />
        <div style={{ height:3, background:'#334155', borderRadius:1, marginBottom:3, width:'45%' }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2 }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'88%' }} />
        <div style={{ height:1.5, background:'#e2e8f0', borderRadius:1, width:'72%' }} />
      </div>
    ),
  },
  {
    id: 6, name: 'Tech', desc: 'Dark sidebar, modern', badge: 'new', badgeLabel: 'New', category: 'Two-Column',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px', display:'grid', gridTemplateColumns:'20px 1fr', gap:4 }}>
        <div style={{ background:'#1e293b', borderRadius:2, padding:'6px 3px', display:'flex', flexDirection:'column', gap:3, alignItems:'center' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(255,255,255,0.7)' }} />
          <div style={{ height:1.5, background:'rgba(255,255,255,0.3)', width:'100%', borderRadius:1 }} />
          <div style={{ height:1.5, background:'rgba(255,255,255,0.3)', width:'100%', borderRadius:1 }} />
          <div style={{ height:1.5, background:'rgba(255,255,255,0.3)', width:'100%', borderRadius:1 }} />
        </div>
        <div>
          <div style={{ height:4, background:'#4F6EF7', borderRadius:1, marginBottom:3 }} />
          <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'90%' }} />
          <div style={{ height:2, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:'80%' }} />
          <div style={{ height:2, background:'#e2e8f0', borderRadius:1, width:'70%' }} />
        </div>
      </div>
    ),
  },
  {
    id: 7, name: 'Elegant', desc: 'Serif fonts, classic feel', badge: null, category: 'Professional',
    thumb: (
      <div style={{ width:75, background:'#fffbf7', borderRadius:3, padding:'8px 7px', border:'1px solid #f0e6d3' }}>
        <div style={{ height:5, background:'#92400e', borderRadius:1, marginBottom:4, width:'80%' }} />
        <div style={{ height:1, background:'#d97706', marginBottom:5 }} />
        <div style={{ height:2, background:'#78716c', borderRadius:1, marginBottom:2, width:'95%' }} />
        <div style={{ height:2, background:'#78716c', borderRadius:1, marginBottom:2, width:'80%' }} />
        <div style={{ height:2, background:'#78716c', borderRadius:1, width:'88%' }} />
      </div>
    ),
  },
  {
    id: 8, name: 'Compact', desc: 'Fits more in one page', badge: null, category: 'Minimal',
    thumb: (
      <div style={{ width:75, background:'#fff', borderRadius:3, padding:'6px 7px' }}>
        <div style={{ height:4, background:'#1e293b', borderRadius:1, marginBottom:2, width:'70%' }} />
        <div style={{ height:1.5, background:'#94a3b8', borderRadius:1, marginBottom:5, width:'55%' }} />
        <div style={{ height:2, background:'#7c3aed', borderRadius:1, marginBottom:2, width:'40%' }} />
        {[90,80,85,75,88,70].map((w,i) => (
          <div key={i} style={{ height:1.5, background:'#e2e8f0', borderRadius:1, marginBottom:2, width:`${w}%` }} />
        ))}
      </div>
    ),
  },
];

const filters = ['All', 'Professional', 'Creative', 'Minimal', 'Two-Column'];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <AppLayout title="Resume Builder">
      <div className="templates-header">
        <h2>Choose a Template</h2>
        <p>Pick a design that matches your style. You can switch templates anytime without losing your content.</p>
      </div>

      <motion.div className="templates-filters" variants={staggerContainer} initial="hidden" animate="show">
        {filters.map(f => (
          <motion.button 
            variants={slideUpItem}
            whileHover={scaleHover}
            whileTap={tapEffect}
            key={f} 
            className={`filter-btn ${activeFilter === f ? 'active' : ''}`} 
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="templates-grid" layout>
        <AnimatePresence>
          {templates.filter(t => activeFilter === 'All' || t.category === activeFilter).map(t => (
            <motion.div 
              key={t.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              whileHover={{ y: -8, boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.5)", scale: 1.02 }}
              className={`tpl-card ${selected === t.id ? 'selected' : ''}`} 
              onClick={() => setSelected(t.id)}
            >
              <div className="tpl-preview">
              {t.thumb}
              {t.badge && <div className={`tpl-badge badge-${t.badge}`}>{t.badgeLabel}</div>}
              {selected === t.id && (
                <div className="selected-check">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
            <div className="tpl-body">
              <div className="tpl-name">{t.name}</div>
              <div className="tpl-desc">{t.desc}</div>
              <div className="tpl-actions">
                {selected === t.id ? (
                  <div className="tpl-selected-label">Selected</div>
                ) : (
                  <>
                    <button className="tpl-preview-btn">Preview</button>
                    <button className="tpl-use-btn" onClick={(e) => { e.stopPropagation(); navigate(`/builder?template=${t.id}`); }}>Use This</button>
                  </>
                )}
              </div>
            </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/builder?template=${selected}`)}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, padding: '12px 32px', cursor: 'pointer' }}
        >
          Continue with {templates.find(t => t.id === selected)?.name} Template →
        </motion.button>
      </div>
    </AppLayout>
  );
}