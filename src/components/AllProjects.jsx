import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { projects } from '../data/content.js';

/* Full-screen page with every project, filterable by category. */
export default function AllProjects({ onClose, onOpen }) {
  const box = useRef(null);
  const [filter, setFilter] = useState('All');
  const cats = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category || 'Other')))], []);
  const list = projects
    .map((p, gi) => ({ ...p, gi }))
    .filter((p) => filter === 'All' || (p.category || 'Other') === filter);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    box.current && box.current.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="page-overlay" role="dialog" aria-modal="true" aria-labelledby="all-title" ref={box} tabIndex={-1}>
      <div className="detail-bg" />
      <div className="detail-top">
        <button type="button" onClick={onClose}><Icon name="arrowLeft" size={14} /> Back</button>
        <span className="pager">{list.length} PROJECT{list.length === 1 ? '' : 'S'}</span>
      </div>

      <div className="page-body">
        <div className="page-head">
          <div>
            <span className="label">Archive</span>
            <h1 id="all-title" className="h2 page-title">All <em>projects.</em></h1>
            <p className="page-sub">Everything I&apos;ve built so far, from class projects to personal experiments.</p>
          </div>
          <div className="tabs" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} type="button" className="tab" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="proj-grid" key={filter}>
          {list.map((p, i) => (
            <button key={p.id} type="button" className="proj-card glass" style={{ '--i': i }} onClick={() => onOpen(p.gi)}>
              <span className="proj-thumb">
                {p.desktop ? (
                  <img src={p.desktop} alt="" loading="lazy" />
                ) : (
                  <span className="thumb-ph"><i /><i /><i /><b /></span>
                )}
                {p.featured !== false && <span className="badge">Featured</span>}
              </span>
              <span className="proj-meta">
                <span className="pm-top"><span className="kind">{p.type}</span><span className="year">{p.year}</span></span>
                <span className="pm-name">{p.name}</span>
                <span className="pm-sum">{p.summary}</span>
                <span className="pm-stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</span>
              </span>
              <span className="pm-go" aria-hidden="true"><Icon name="arrowRight" size={16} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
