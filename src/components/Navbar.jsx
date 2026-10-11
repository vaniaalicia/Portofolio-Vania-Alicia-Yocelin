import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import star from '../assets/star-single.webp';
import { scrollToId } from '../hooks/hooks.js';
import ThemePicker, { THEME_META } from './ThemePicker.jsx';

const LINKS = [
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'My Work' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ active, theme, themes, setTheme }) {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const landing = document.getElementById('landing');
      const limit = landing ? landing.offsetHeight * 0.6 : 300;
      setVisible(window.scrollY > limit);
      setScrolled(window.scrollY > (landing ? landing.offsetHeight + 40 : 400));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={`nav ${visible ? '' : 'is-hidden'} ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#landing" className="logo" onClick={(e) => go(e, 'landing')}>
          <img src={star} alt="" /> Vania
        </a>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} onClick={(e) => go(e, l.id)}>
              {l.label}
            </a>
          ))}
          <ThemePicker theme={theme} themes={themes} setTheme={setTheme} />
        </nav>

        <div className="nav-mobile">
          <ThemePicker theme={theme} themes={themes} setTheme={setTheme} />
          <button type="button" className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
            <Icon name="menu" size={15} />
          </button>
        </div>
      </header>

      <div className={`menu ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menuOpen}>
        <div className="menu-top">
          <span className="logo"><img src={star} alt="" /> Vania</span>
          <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu" tabIndex={menuOpen ? 0 : -1}>
            <Icon name="close" size={15} />
          </button>
        </div>
        <nav className="menu-links" aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} onClick={(e) => go(e, l.id)} tabIndex={menuOpen ? 0 : -1}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-theme">
          <span>Theme</span>
          <div className="seg" role="group" aria-label="Theme">
            {themes.map((t) => (
              <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)} tabIndex={menuOpen ? 0 : -1}>
                {THEME_META[t].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
