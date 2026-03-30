import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <button
          style={{ background:'var(--accent)', border:'none', borderRadius:8, color:'#fff', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, padding:'7px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}
          onClick={() => navigate('/builder')}
        >
          Back to Builder
        </button>
      }
    >
      <div className="analysis-grid">
        <div className="score-card">
          <div className="score-ring-wrap">
            <svg viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#2A2D38" strokeWidth="10"/>
              <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#2ECC8A" strokeWidth="10"
                strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"/>
            </svg>
            <div className="score-num-overlay">
              <div className="score-big">{score}</div>
              <div className="score-denom">/100</div>
            </div>
          </div>
          <div className="score-grade">Grade: B+</div>
          <div className="score-detail">
            Your resume ranks in the<br/>top 25% for Software Engineer roles
          </div>
        </div>

        <div className="breakdown-card">
          <div className="bk-title">Score Breakdown</div>
          {breakdown.map((b, i) => (
            <div className="bk-item" key={i}>
              <div className="bk-label">{b.label}</div>
              <div className="bk-bar-wrap">
                <div className="bk-bar" style={{ width: `${b.pct}%`, background: b.color }} />
              </div>
              <div className="bk-val" style={{ color: b.color }}>{b.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="keywords-row">
        <div className="kw-card">
          <div className="kw-head" style={{ color: 'var(--success)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Keywords Found ({foundKw.length})
          </div>
          <div className="kw-tags">
            {foundKw.map(k => <span className="kw-tag kw-found" key={k}>{k}</span>)}
          </div>
        </div>
        <div className="kw-card">
          <div className="kw-head" style={{ color: 'var(--danger)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Missing Keywords ({missKw.length})
          </div>
          <div className="kw-tags">
            {missKw.map(k => <span className="kw-tag kw-miss" key={k}>{k}</span>)}
          </div>
        </div>
      </div>

      <div className="suggestions-section">
        <div className="sug-section-title">Improvement Suggestions</div>
        {suggestions.map((s, i) => (
          <div className="sug-row" key={i}>
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
          </div>
        ))}
      </div>

      <div className="history-card">
        <div className="history-head">Score History</div>
        {history.map((h, i) => (
          <div className="hist-row" key={i}>
            <div className="hist-date">{h.date}</div>
            <div className="hist-bar-wrap"><div className="hist-bar" style={{ width: `${h.val}%` }} /></div>
            <div className="hist-val" style={{ color: h.val >= 80 ? 'var(--success)' : h.val >= 70 ? 'var(--warning)' : 'var(--danger)' }}>{h.val}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}