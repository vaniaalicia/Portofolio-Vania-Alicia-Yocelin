import { useEffect, useRef, useState } from 'react';
import starLine from '../assets/star-line.webp';
import star from '../assets/star-single.webp';
import girl from '../assets/girl-falling.webp';
import ThemePicker from './ThemePicker.jsx';
import { profile } from '../data/content.js';
import { goToHook } from '../hooks/hooks.js';

// floating motes of light (fixed values so the layout never jumps between renders)
const MOTES = Array.from({ length: 26 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${(r(1) * 100).toFixed(1)}%`,
    top: `${(30 + r(2) * 70).toFixed(1)}%`,
    size: 1.5 + r(3) * 3,
    dur: 12 + r(4) * 14,
    delay: -r(5) * 26,
    o: 0.35 + r(6) * 0.55,
  };
});

export default function Landing({ theme, themes, setTheme }) {
  const ref = useRef(null);
  const [igniting, setIgniting] = useState(false);

  // gentle parallax on mouse move (desktop only)
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) - 0.5).toFixed(3));
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) - 0.5).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const followTheLight = () => {
    setIgniting(true);
    setTimeout(() => setIgniting(false), 1400);
    setTimeout(goToHook, 180);
  };

  return (
    <section id="landing" ref={ref} className={`landing ${igniting ? 'is-igniting' : ''}`} aria-label="Welcome">
      <span className="logo landing-logo"><img src={star} alt="" /> {profile.name}</span>
      <ThemePicker theme={theme} themes={themes} setTheme={setTheme} className="landing-theme" />

      <div className="landing-stage">
        <div className="par" style={{ '--k': -26 }}>
          {MOTES.map((m, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="mote"
              style={{ left: m.left, top: m.top, width: m.size, height: m.size, '--dur': `${m.dur}s`, '--delay': `${m.delay}s`, '--o': m.o }}
            />
          ))}
        </div>

        <div className="par" style={{ '--k': -8 }}>
          <div className="star-rays" />
          <div className="star-halo" />
          <img className="star-line" src={starLine} alt="" />
          <svg className="follow" viewBox="0 0 180 180" aria-hidden="true">
            <defs><path id="follow-arc" d="M 115 26 A 74 74 0 0 1 152 138" /></defs>
            <text><textPath href="#follow-arc">follow the light</textPath></text>
          </svg>
          <button type="button" className="star-button" onClick={followTheLight} aria-label="Follow the light: enter the portfolio" />
        </div>

        <div className="par" style={{ '--k': -18 }}>
          <div className="girl-wrap">
            <div className="girl-halo" />
            <img src={girl} alt="Illustration of a girl falling gently toward a glowing star" />
          </div>
        </div>
      </div>

      <div className="landing-bottom">
        <p className="landing-tagline">{profile.landingLine}</p>
        <button type="button" className="scroll-hint" onClick={followTheLight}>
          <span className="hint-desktop">SCROLL</span>
          <span className="hint-mobile">SWIPE UP</span>
          <span className="drip" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
