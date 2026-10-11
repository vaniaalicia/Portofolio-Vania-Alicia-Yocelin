import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { projects, profile } from '../data/content.js';

/* Placeholder screen used until a real screenshot is added in content.js */
function PlaceholderUI({ name, compact }) {
  return (
    <div className="ph-ui">
      <div className="nav-ph"><i /><span><i /><i /><i /></span></div>
      <div className="h" style={{ width: compact ? '80%' : '58%' }} />
      <div className="h" style={{ width: compact ? '55%' : '38%' }} />
      <div className="p" style={{ width: '70%', marginTop: 10 }} />
      <div className="p" style={{ width: '52%' }} />
      <div className="a" />
      {!compact && <div className="cards"><div /><div /><div /></div>}
      <div className="ph-label">{name} · screenshot soon</div>
    </div>
  );
}

export function Screens({ project, showChips = true }) {
  const host = project.live ? project.live.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${project.id}.vercel.app`;
  return (
    <div className="stage-art">
      {project.live && <span className="live-badge glass">Live</span>}
      <div className="browser">
        <div className="bar"><i /><i /><i /><span className="url">{host}</span></div>
        <div className="screen">
          {project.desktop ? <img src={project.desktop} alt={`${project.name} on desktop`} loading="lazy" /> : <PlaceholderUI name={project.name} />}
        </div>
      </div>
      <div className="phone">
        <div className="screen">
          {project.mobile ? <img src={project.mobile} alt={`${project.name} on mobile`} loading="lazy" /> : <PlaceholderUI name={project.name} compact />}
        </div>
      </div>
      {showChips && (
        <div className="stack-chip glass">
          <small>BUILT WITH</small>
          {project.stack.map((s) => <span key={s}>{s}</span>)}
        </div>
      )}
    </div>
  );
}

export default function Work({ onOpen, onAll }) {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const swipe = useRef(null);
  // only "featured" projects here; everything is on the All projects page
  const featured = projects.map((pr, gi) => ({ ...pr, gi })).filter((pr) => pr.featured !== false);
  const p = featured[Math.min(active, featured.length - 1)];

  useEffect(() => {
    const el = swipe.current;
    if (!el) return undefined;
    const on = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width + 14 : 1;
      setSlide(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="work-head">
        <div data-reveal>
          <span className="label">My Work</span>
          <h2 id="work-title" className="h2">Selected <em>work.</em></h2>
        </div>
        <button type="button" className="btn view-all" onClick={onAll} data-reveal style={{ '--d': '200ms' }}>
          View all projects <Icon name="arrowRight" size={14} />
        </button>
      </div>

      {/* desktop: list + sneak peek */}
      <div className="work-grid" data-stagger>
        <div style={{ '--i': 0 }}>
          <ul className="proj-list">
            {featured.map((pr, i) => (
              <li key={pr.id}>
                <button
                  type="button"
                  className={i === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => (i === active ? onOpen(pr.gi) : setActive(i))}
                  aria-current={i === active}
                >
                  <span className="t">{pr.name}</span>
                  <span className="k">{pr.type}</span>
                </button>
              </li>
            ))}
          </ul>
          <a className="more-link" href={profile.github} target="_blank" rel="noreferrer">More on GitHub <Icon name="external" size={13} /></a>
        </div>

        <div className="stage" style={{ '--i': 2 }}>
          <div key={p.id} className="stage-fade">
            <Screens project={p} />
            <div className="stage-info">
              <div>
                <div className="kind">{p.type}</div>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
              </div>
              <button type="button" className="btn primary" onClick={() => onOpen(p.gi)}>
                View project <Icon name="arrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile: one project per swipe */}
      <div className="work-mobile">
        <div className="swipe" ref={swipe}>
          {featured.map((pr) => (
            <div key={pr.id} className="swipe-card">
              <Screens project={pr} showChips={false} />
              <div className="swipe-info glass">
                <div className="kind">{pr.type}</div>
                <h3>{pr.name}</h3>
                <p>{pr.summary}</p>
                <button type="button" className="btn primary" onClick={() => onOpen(pr.gi)}>View project <Icon name="arrowRight" size={13} /></button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn view-all-m" onClick={onAll}>View all projects <Icon name="arrowRight" size={13} /></button>
        <div className="dots" aria-hidden="true">
          {featured.map((pr, i) => <i key={pr.id} className={i === slide ? 'is-on' : ''} />)}
        </div>
      </div>
    </section>
  );
}