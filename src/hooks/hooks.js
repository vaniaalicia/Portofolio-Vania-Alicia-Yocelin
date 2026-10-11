import { useEffect, useRef, useState, useCallback } from 'react';

const THEMES = ['dark', 'sunset', 'clean'];
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Current theme + setter. Saved in localStorage, applied to <html data-theme>. */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    const t = document.documentElement.dataset.theme;
    return THEMES.includes(t) ? t : 'dark';
  });

  const setTheme = useCallback((t) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('vania-theme', t); } catch (e) { /* storage blocked */ }
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]);
  }, [theme, setTheme]);

  return { theme, setTheme, cycleTheme, themes: THEMES };
}

/* ---------- smooth, eased scrolling ---------- */
let animating = false;
export const isAnimatingScroll = () => animating;

export function smoothScrollTo(target, duration = 1300) {
  if (prefersReduced()) { window.scrollTo(0, target); return Promise.resolve(); }
  return new Promise((resolve) => {
    animating = true;
    const start = window.scrollY;
    const dist = target - start;
    const t0 = performance.now();
    const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else { animating = false; resolve(); }
    };
    requestAnimationFrame(step);
  });
}

/** Smooth-scroll to a section id. */
export function scrollToId(id) {
  if (id === 'contact') {
    const end = document.documentElement.scrollHeight - window.innerHeight;
    return smoothScrollTo(end, Math.min(1800, 700 + Math.abs(end - window.scrollY) * 0.12));
  }
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();
  const y = el.getBoundingClientRect().top + window.scrollY;
  return smoothScrollTo(y, Math.min(1800, 700 + Math.abs(y - window.scrollY) * 0.12));
}

/* ---------- landing ⇄ hook: one gesture moves a whole scene ---------- */
let goHookHandler = null;
export const goToHook = () => goHookHandler && goHookHandler();

export function useSceneSnap() {
  useEffect(() => {
    let lockUntil = 0;
    const hookTop = () => {
      const h = document.getElementById('hook');
      return h ? h.offsetTop : window.innerHeight;
    };
    const targetFor = (dir) => {
      const y = window.scrollY;
      const h = hookTop();
      if (dir > 0 && y < h - 4) return h;
      if (dir < 0 && y > 2 && y <= h + 4) return 0;
      return null;
    };
    const go = (t) => {
      smoothScrollTo(t, 1500).then(() => { lockUntil = performance.now() + 380; });
    };
    goHookHandler = () => go(hookTop());

    const overlayOpen = () => Boolean(document.querySelector('.page-overlay, .detail, .menu.is-open'));

    const onWheel = (e) => {
      if (overlayOpen()) return;
      const now = performance.now();
      const inZone = window.scrollY <= hookTop() + 4;
      if (animating) { e.preventDefault(); return; }
      // swallow the trackpad's leftover momentum right after a scene change
      if (now < lockUntil && inZone) { e.preventDefault(); lockUntil = now + 220; return; }
      if (Math.abs(e.deltaY) < 3) return;
      const t = targetFor(Math.sign(e.deltaY));
      if (t !== null) { e.preventDefault(); go(t); }
    };

    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY === null || overlayOpen()) return;
      if (animating) { e.preventDefault(); return; }
      const dy = touchY - e.touches[0].clientY;
      const t = targetFor(Math.sign(dy));
      if (t !== null) {
        e.preventDefault();
        if (Math.abs(dy) > 24) { touchY = null; go(t); }
      }
    };

    const onKey = (e) => {
      if (overlayOpen()) return;
      if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
      let dir = 0;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) dir = 1;
      if (['ArrowUp', 'PageUp'].includes(e.key)) dir = -1;
      if (!dir) return;
      if (e.key === ' ' && e.target.closest && e.target.closest('button, a')) return;
      const t = targetFor(dir);
      if (t !== null) { e.preventDefault(); go(t); }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      goHookHandler = null;
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
}

/** Adds "is-in" to every [data-reveal] / [data-stagger] element once it scrolls into view. */
export function useRevealAll() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-in), [data-stagger]:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** true once the element has scrolled into view (stays true). */
export function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

/** Which section id is currently in the middle of the screen. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let current = null;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);
  return active;
}

/** Counts up from 0 to `to` while `start` is true (resets to 0 when false). */
export function useCountUp(to, start, duration = 1200) {
  const [n, setN] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!start) { setN(0); return undefined; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to, start, duration]);
  return n;
}
