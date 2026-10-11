import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { projects } from '../data/content.js';
import { Screens } from './Work.jsx';

/* Full-screen, visual-first project page. Opens over the site, Esc closes it. */
export default function ProjectDetail({ index, onClose, onGo }) {
  const p = projects[index] || projects[0];
  const box = useRef(null);
  const nextIndex = (index + 1) % projects.length;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    box.current && box.current.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => { box.current && box.current.scrollTo({ top: 0 }); }, [index]);

  const images = [
    ...(p.desktop ? [{ src: p.desktop, cap: 'Desktop' }] : []),
    ...(p.mobile ? [{ src: p.mobile, cap: 'Mobile' }] : []),
    ...p.gallery.map((g) => (typeof g === 'string' ? { src: g, cap: '' } : g)),
  ];

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" ref={box} tabIndex={-1}>
      <div className="detail-bg" />
      <div className="detail-top">
        <button type="button" onClick={onClose}><Icon name="arrowLeft" size={14} /> Back to all work</button>
        <span className="pager">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
      </div>

      <div className="detail-body">
        <div className="detail-info">
          <div className="kind">{p.type}</div>
          <h1 id="detail-title">{p.name}</h1>
          <p className="sum">{p.summary}</p>
          <div className="detail-facts">
            <div><small>ROLE</small>{p.role}</div>
            <div><small>BUILT WITH</small>{p.stack.join(' · ')}</div>
            <div><small>DELIVERED</small>{p.delivered}</div>
          </div>
          <div className="detail-cta">
            {p.live && <a className="btn primary" href={p.live} target="_blank" rel="noreferrer">Visit live site <Icon name="external" size={13} /></a>}
            {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noreferrer"><Icon name="github" /> View code</a>}
          </div>
        </div>

        <div>
          {images.length > 0 ? (
            <div className="gallery">
              {images.map((im) => (
                <figure key={im.src}>
                  <img src={im.src} alt={`${p.name} ${im.cap}`} />
                  {im.cap && <figcaption>{im.cap}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <Screens project={p} />
          )}
        </div>
      </div>

      <div className="next-proj">
        <button type="button" onClick={() => onGo(nextIndex)}>
          Next project
          <b>{projects[nextIndex].name} <Icon name="arrowRight" size={16} /></b>
        </button>
      </div>
    </div>
  );
}
