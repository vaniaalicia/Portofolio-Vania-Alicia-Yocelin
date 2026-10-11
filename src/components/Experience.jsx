import { useRef, useState } from 'react';
import { useInView } from '../hooks/hooks.js';
import { experience, experienceFilters } from '../data/content.js';

export default function Experience() {
  const [filter, setFilter] = useState('all');
  const scroller = useRef(null);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, 0.2);

  const items = experience.filter((e) => filter === 'all' || e.category === filter);
  const count = (id) => (id === 'all' ? experience.length : experience.filter((e) => e.category === id).length);

  // drag to scroll with the mouse (touch already scrolls natively)
  const onDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { active: true, x: e.clientX, left: scroller.current.scrollLeft, moved: false };
    scroller.current.classList.add('is-dragging');
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    scroller.current.scrollLeft = drag.current.left - dx;
  };
  const onUp = () => {
    drag.current.active = false;
    scroller.current && scroller.current.classList.remove('is-dragging');
  };

  return (
    <section id="experience" className="section experience" aria-labelledby="exp-title">
      <div className="exp-head">
        <div data-reveal>
          <span className="label">Experience</span>
          <h2 id="exp-title" className="h2">Where I&apos;ve <em>grown.</em></h2>
        </div>
        <div className="tabs" role="group" aria-label="Filter experience" data-reveal style={{ '--d': '150ms' }}>
          {experienceFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`tab cat-${f.id}`}
              aria-pressed={filter === f.id}
              onClick={() => { setFilter(f.id); scroller.current && scroller.current.scrollTo({ left: 0 }); }}
            >
              {f.id !== 'all' && <span className="dot" />}
              {f.label} <span className="count">{count(f.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-wrap" ref={wrapRef}>
        <div
          className="timeline"
          ref={scroller}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          tabIndex={0}
          aria-label="Experience timeline, scroll sideways"
        >
          <div className={`track ${inView ? 'is-in' : ''}`} key={filter}>
            {items.length === 0 && <p className="empty-note">Nothing here yet, coming soon.</p>}
            {items.map((e, i) => (
              <article key={e.title + e.org} style={{ '--i': i }} className={`tl-item cat-${e.category} ${i % 2 === 0 ? 'up' : 'down'}`}>
                <span className="tl-node" />
                <span className="tl-stem" />
                <span className="tl-year">{e.year}</span>
                <div className="xp glass">
                  <span className="cat">{experienceFilters.find((f) => f.id === e.category)?.label}</span>
                  <span className="when">{e.period}</span>
                  <h3 className="xp-title">{e.title}</h3>
                  <div className="org">{e.org}</div>
                  <p>{e.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}