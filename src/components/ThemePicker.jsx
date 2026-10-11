import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

export const THEME_META = {
  dark: { icon: 'moon', label: 'Dark', hint: 'Night castle' },
  sunset: { icon: 'sun', label: 'Sunset', hint: 'Golden hour' },
  clean: { icon: 'circle', label: 'Clean', hint: 'Minimal white' },
};

/* Small round button; clicking it opens a menu with all three themes. */
export default function ThemePicker({ theme, themes, setTheme, className = '' }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`theme-picker ${className}`} ref={box}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${THEME_META[theme].label}. Choose a theme`}
      >
        <Icon name={THEME_META[theme].icon} size={15} />
      </button>
      <div className={`theme-menu ${open ? 'is-open' : ''}`} role="menu" aria-label="Choose a theme">
        <span className="theme-menu-title">Theme</span>
        {themes.map((t) => (
          <button
            key={t}
            type="button"
            role="menuitemradio"
            aria-checked={theme === t}
            className={`theme-opt ${theme === t ? 'is-on' : ''}`}
            onClick={() => { setTheme(t); setOpen(false); }}
            tabIndex={open ? 0 : -1}
          >
            <span className={`swatch sw-${t}`} aria-hidden="true" />
            <span className="opt-text">
              <span className="opt-name">{THEME_META[t].label}</span>
              <span className="opt-hint">{THEME_META[t].hint}</span>
            </span>
            {theme === t && <Icon name="check" size={14} className="opt-check" />}
          </button>
        ))}
      </div>
    </div>
  );
}
