import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, slideUpItem, scaleHover, TRANSITIONS } from '../utils/motionVariants';
import AppLayout from '../components/layout/AppLayout';
import '../styles/analysis.css';

const breakdown = [
  { label: 'Keywords Match (30%)', pct: 82, color: '#4F6EF7' },
  { label: 'Action Verbs (15%)', pct: 90, color: '#2ECC8A' },
  { label: 'Section Completeness (20%)', pct: 95, color: '#2ECC8A' },
  { label: 'Experience Quality (20%)', pct: 78, color: '#E8A63A' },
  { label: 'Formatting (15%)', pct: 88, color: '#2ECC8A' },
];

const foundKw = ['React','TypeScript','Node.js','AWS','Docker','CI/CD','REST API','Agile','GraphQL','PostgreSQL'];
const missKw = ['Kubernetes','Terraform','Microservices','Redis','System Design'];

const suggestions = [
  { bg:'rgba(232,166,58,0.1)', stroke:'#E8A63A', title:'Add Kubernetes to skills', desc:'High-demand keyword missing. 80% of senior SWE roles require it.', impact:'+4 pts', impactCls:'impact-hi' },
  { bg:'rgba(79,110,247,0.1)', stroke:'#4F6EF7', title:'Quantify more achievements', desc:'Only 2 of 6 bullet points include numbers. Add metrics to the remaining 4.', impact:'+3 pts', impactCls:'impact-md' },
  { bg:'rgba(224,92,92,0.1)', stroke:'#E05C5C', title:'Add a professional summary', desc:'A 2-3 sentence summary at the top can increase ATS pass rate by ~15%.', impact:'+5 pts', impactCls:'impact-hi' },
];

const history = [
  { date: 'Mar 28', val: 87 },
  { date: 'Mar 25', val: 82 },
  { date: 'Mar 20', val: 76 },
  { date: 'Mar 15', val: 68 },
  { date: 'Mar 10', val: 61 },
];

const RADIUS = 58;
const CIRC = 2 * Math.PI * RADIUS;
const score = 87;
const offset = CIRC - (score / 100) * CIRC;

export default function AnalysisPage() {
  const navigate = useNavigate();
  return (
    <AppLayout
      title="ATS Analysis"
      topbarRight={
        <motion.button
          style={{ background:'var(--accent)', border:'none', borderRadius:8, color:'#fff', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, padding:'7px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}
          onClick={() => navigate('/builder')}
        >
          Back to Builder
        </motion.button>
      }
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="analysis-grid">
          <motion.div className="score-card" variants={slideUpItem} whileHover={scaleHover}>
          <div className="score-ring-wrap">
            <svg viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#2A2D38" strokeWidth="10"/>
              <motion.circle 
                cx="80" cy="80" r={RADIUS} fill="none" stroke="#2ECC8A" strokeWidth="10"
                strokeDasharray={CIRC} 
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <motion.div 
              className="score-num-overlay"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, ...TRANSITIONS.appleSpring }}
            >
              <div className="score-big">{score}</div>
              <div className="score-denom">/100</div>
            </motion.div>
          </div>
          <motion.div className="score-grade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Grade: B+</motion.div>
          <div className="score-detail">
            Your resume ranks in the<br/>top 25% for Software Engineer roles
          </div>
        </motion.div>

        <motion.div className="breakdown-card" variants={slideUpItem}>
          <div className="bk-title">Score Breakdown</div>
          {breakdown.map((b, i) => (
            <div className="bk-item" key={i}>
              <div className="bk-label">{b.label}</div>
              <div className="bk-bar-wrap">
                <motion.div 
                  className="bk-bar" 
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: [0.32, 0.72, 0, 1] }}
                  style={{ background: b.color }} 
                />
              </div>
              <motion.div className="bk-val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + (i * 0.1) }} style={{ color: b.color }}>{b.pct}%</motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="keywords-row">
        <motion.div className="kw-card" variants={slideUpItem}>
          <div className="kw-head" style={{ color: 'var(--success)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Keywords Found ({foundKw.length})
          </div>
          <motion.div className="kw-tags" variants={staggerContainer} initial="hidden" animate="show">
            {foundKw.map(k => <motion.span variants={slideUpItem} whileHover={{ scale: 1.05 }} className="kw-tag kw-found" key={k}>{k}</motion.span>)}
          </motion.div>
        </motion.div>
        <motion.div className="kw-card" variants={slideUpItem}>
          <div className="kw-head" style={{ color: 'var(--danger)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Missing Keywords ({missKw.length})
          </div>
          <motion.div className="kw-tags" variants={staggerContainer} initial="hidden" animate="show">
            {missKw.map(k => <motion.span variants={slideUpItem} whileHover={{ scale: 1.05 }} className="kw-tag kw-miss" key={k}>{k}</motion.span>)}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="suggestions-section" variants={slideUpItem}>
        <div className="sug-section-title">Improvement Suggestions</div>
        {suggestions.map((s, i) => (
          <motion.div className="sug-row" key={i} whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div className="sug-row-icon" style={{ background: s.bg }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={s.stroke} strokeWidth="2.2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
            </div>
            <div className="sug-row-content">
              <p>{s.title}</p>
              <span>{s.desc}</span>
            </div>
            <div className={`impact-badge ${s.impactCls}`}>{s.impact}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="history-card" variants={slideUpItem}>
        <div className="history-head">Score History</div>
        {history.map((h, i) => (
          <div className="hist-row" key={i}>
            <div className="hist-date">{h.date}</div>
            <div className="hist-bar-wrap">
              <motion.div 
                className="hist-bar" 
                initial={{ width: 0 }}
                animate={{ width: `${h.val}%` }}
                transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
            <div className="hist-val" style={{ color: h.val >= 80 ? 'var(--success)' : h.val >= 70 ? 'var(--warning)' : 'var(--danger)' }}>{h.val}</div>
          </div>
        ))}
      </motion.div>
      </motion.div>
    </AppLayout>
  );
}