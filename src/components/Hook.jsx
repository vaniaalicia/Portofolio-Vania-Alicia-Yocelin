import { useRef, useState } from 'react';
import bookCover from '../assets/book-cover.webp';
import bookOpen from '../assets/book-open.webp';
import Icon from './Icon.jsx';
import { profile, stats, sections } from '../data/content.js';
import { useCountUp, scrollToId } from '../hooks/hooks.js';

const TOC_STYLE = {
  about: { icon: 'user', tone: 'opal' },
  skills: { icon: 'spark', tone: 'fae' },
  experience: { icon: 'compass', tone: 'blood' },
  work: { icon: 'books', tone: 'thorn' },
  contact: { icon: 'mail', tone: 'fae' },
};

function Stat({ value, suffix, label, start }) {
  const n = useCountUp(value, start);
  return (
    <div className="stat">
      <b>{n}{suffix}</b>
      <span>{label}</span>
    </div>
  );
}

export default function Hook({ onContact }) {
  // closed → opening → open → closing → closed
  const [state, setState] = useState('closed');
  const timer = useRef(0);

  const toggle = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(timer.current);
    if (state === 'closed') {
      if (reduced) { setState('open'); return; }
      setState('opening');
      timer.current = setTimeout(() => setState('open'), 820);
    } else if (state === 'open') {
      if (reduced) { setState('closed'); return; }
      setState('closing');
      timer.current = setTimeout(() => setState('closed'), 720);
    }
  };

  const onBookClick = (e) => {
    if (e.target.closest('.toc button')) return; // let the contents links work
    toggle();
  };
  const onKey = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); toggle(); }
  };

  const isOpen = state === 'open' || state === 'opening';

  return (
    <section id="hook" className="hook" aria-label="Introduction">
      <div className="hook-inner">
        <div className="hook-text">
          <p className="hello" data-reveal style={{ '--d': '0ms' }}>Hi there, I&apos;m</p>
          <h1 className="name" data-reveal style={{ '--d': '120ms' }}>{profile.name}<em>.</em></h1>
          <p className="tagline" data-reveal style={{ '--d': '240ms' }}>{profile.tagline}</p>
          <p className="role" data-reveal style={{ '--d': '360ms' }}>{profile.role}</p>
          <div className="hook-btns" data-reveal style={{ '--d': '480ms' }}>
            <a className="btn" href={profile.cv} target="_blank" rel="noreferrer"><Icon name="file" />View CV</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" />LinkedIn</a>
          </div>
        </div>

        <div className="book-col" data-reveal style={{ '--d': '200ms' }}>
          <div
            className="book-zone"
            data-state={state}
            onClick={onBookClick}
            onKeyDown={onKey}
            role="button"
            tabIndex={0}
            aria-label={isOpen ? 'Close the book' : 'Open the portfolio book'}
            aria-expanded={isOpen}
          >
            <div className="book-light" />
            <div className="book-shadow" />
            <div className="book-float">
              <img className="book-closed" src={bookCover} alt="A leather book titled Portfolio, Vania" draggable="false" />
              <div className="book-opened" aria-hidden={!isOpen}>
                <img src={bookOpen} alt="" draggable="false" />
                <div className="page left">
                  <div className="stats">
                    {stats.map((s, i) => (
                      <div key={s.label} style={{ display: 'contents' }}>
                        {i > 0 && <div className="divider" />}
                        <Stat {...s} start={isOpen} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="page right">
                  <div className="toc-title">CONTENTS</div>
                  <ul className="toc">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => (s.id === 'contact' ? onContact() : scrollToId(s.id))} tabIndex={state === 'open' ? 0 : -1}>
                          <span className={`ic ${TOC_STYLE[s.id].tone}`}><Icon name={TOC_STYLE[s.id].icon} /></span>
                          <span>
                            <span className="tt">{s.label}</span>
                            <span className="tb">{s.blurb}</span>
                          </span>
                          <span className="arrow" aria-hidden="true">→</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <span className={`click-open ${state === 'closed' ? '' : 'is-gone'}`}>CLICK TO OPEN</span>
        </div>
      </div>
    </section>
  );
}
