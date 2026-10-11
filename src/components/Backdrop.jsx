import { useEffect, useRef } from 'react';
import landDark from '../assets/background-landing.webp';
import landSunset from '../assets/light-1.webp';
import bookDark from '../assets/background-bookpage.webp';
import bookSunset from '../assets/light-2.webp';
import longDark from '../assets/background-longpage.webp';
import longSunset from '../assets/light-3.webp';
import girlLantern from '../assets/girl-lantern.webp';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v) => v * v * (3 - 2 * v);

/*
  The lantern girl's route, in the staircase image's own coordinates
  (0..1 of its width / height, measured at her feet). Both staircase images
  (dark + golden hour) share the same layout.
  Start: the glowing door at the top → down four flights, zig-zagging →
  end: the arched doorway at the bottom left, where she fades out.
*/
const PATH = [
  [0.25, 0.235], // glowing door (start)
  [0.34, 0.265], // floor in front of the first flight
  [0.72, 0.36], // bottom of flight 1 (down to the right)
  [0.92, 0.4], // ledge on the right
  [0.95, 0.47], // top of flight 2
  [0.5, 0.6], // bottom of flight 2 (down to the left)
  [0.88, 0.77], // bottom of flight 3 (down to the right)
  [0.32, 0.885], // bottom of flight 4 (down to the left)
  [0.24, 0.885], // into the lower-left doorway
];
const IMG_W = 1024;
const IMG_H = 1536;

/*
  One fixed background behind the whole site. Scenes (landing → book clouds →
  long staircase) cross-fade as you scroll. The staircase pans slowly while the
  girl walks along its steps, so she always stays on the stairs.
*/
export default function Backdrop() {
  const root = useRef(null);
  const walker = useRef(null);
  const longDarkEl = useRef(null);
  const longSunsetEl = useRef(null);

  useEffect(() => {
    let raf = 0;
    let loop = 0;
    let s = 0; // where she is along the path (0..1), eased toward the target
    let target = 0;
    let stopTimer = 0;

    const layout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sc = Math.max(vw / IMG_W, vh / IMG_H);
      return { vw, vh, W: IMG_W * sc, H: IMG_H * sc };
    };

    // path length in screen pixels, so her pace is even on every flight
    const pointAt = (u, W, H) => {
      const seg = [];
      let total = 0;
      for (let i = 0; i < PATH.length - 1; i += 1) {
        const d = Math.hypot((PATH[i + 1][0] - PATH[i][0]) * W, (PATH[i + 1][1] - PATH[i][1]) * H);
        seg.push(d);
        total += d;
      }
      let d = clamp(u) * total;
      let i = 0;
      while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i += 1; }
      const t = seg[i] ? d / seg[i] : 0;
      return {
        x: PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * t,
        y: PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * t,
        dx: PATH[i + 1][0] - PATH[i][0],
      };
    };

    const placeWalker = (p, wLong) => {
      const w = walker.current;
      if (!w) return;
      const { vw, vh, W, H } = layout();
      const pt = pointAt(s, W, H);
      let sx = (vw - W) / 2 + pt.x * W;
      const sy = (vh - H) * p + pt.y * H;
      if (vw <= 820) sx = clamp(sx, vw * 0.1, vw * 0.9);
      w.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      w.style.width = `${Math.max(38, W * 0.07).toFixed(1)}px`;
      w.classList.toggle('facing-left', pt.dx < 0);
      const fadeIn = smooth(clamp((wLong - 0.5) / 0.5));
      const fadeOut = 1 - smooth(clamp((s - 0.965) / 0.035));
      w.style.opacity = (fadeIn * fadeOut).toFixed(3);
    };

    // the staircase is sized like background-size: cover and slid with a GPU transform,
    // so panning doesn't repaint the whole image every frame
    const panLong = (p) => {
      const { vw, vh, W, H } = layout();
      const x = (vw - W) / 2;
      const y = (vh - H) * p;
      [longDarkEl.current, longSunsetEl.current].forEach((el) => {
        if (!el) return;
        el.style.width = `${W.toFixed(1)}px`;
        el.style.height = `${H.toFixed(1)}px`;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    };

    const prev = {};
    const setVar = (node, key, val) => {
      if (prev[key] === val) return;
      prev[key] = val;
      node.style.setProperty(key, val);
    };

    let lastP = 0;
    let lastWLong = 0;
    const step = () => {
      const diff = target - s;
      s += diff * 0.12;
      if (Math.abs(diff) < 0.0004) s = target;
      placeWalker(lastP, lastWLong);
      if (s !== target) loop = requestAnimationFrame(step);
      else {
        loop = 0;
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => walker.current && walker.current.classList.remove('is-walking'), 150);
      }
    };

    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const hook = document.getElementById('hook');
      const about = document.getElementById('about');
      const hookTop = hook ? hook.offsetTop : vh;
      const descTop = about ? about.offsetTop : vh * 2;
      const end = Math.max(1, document.documentElement.scrollHeight - vh);

      const t1 = clamp(y / Math.max(1, hookTop));
      const t2 = clamp((y - hookTop) / Math.max(1, descTop - hookTop));
      const s1 = smooth(t1);
      const s2 = smooth(t2);
      const wLong = s2;

      // the staircase starts panning when About begins to come in
      const pStart = descTop - vh * 0.15;
      const p = clamp((y - pStart) / Math.max(1, end - pStart));

      // only touch CSS variables when they actually change (avoids restyling the page on every scroll frame)
      setVar(el, '--w-land', (1 - s1).toFixed(3));
      setVar(el, '--w-book', (s1 * (1 - s2)).toFixed(3));
      setVar(el, '--w-long', wLong.toFixed(3));
      setVar(document.documentElement, '--t1', t1.toFixed(3));

      lastP = p;
      lastWLong = wLong;
      target = p;
      // background and girl move in the same frame, so she never slides against the steps
      panLong(p);
      placeWalker(p, wLong);
      if (walker.current && Math.abs(target - s) > 0.0004) walker.current.classList.add('is-walking');
      if (!loop) loop = requestAnimationFrame(step);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    s = target; // start in place on load
    placeWalker(lastP, lastWLong);
    const late = setTimeout(update, 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
      clearTimeout(stopTimer);
      clearTimeout(late);
    };
  }, []);

  return (
    <div className="backdrop" ref={root} aria-hidden="true">
      <div className="bd-art land dark" style={{ backgroundImage: `url(${landDark})` }} />
      <div className="bd-art land sunset" style={{ backgroundImage: `url(${landSunset})` }} />
      <div className="bd-art book dark" style={{ backgroundImage: `url(${bookDark})` }} />
      <div className="bd-art book sunset" style={{ backgroundImage: `url(${bookSunset})` }} />
      <div className="bd-art long dark" ref={longDarkEl} style={{ backgroundImage: `url(${longDark})` }} />
      <div className="bd-art long sunset" ref={longSunsetEl} style={{ backgroundImage: `url(${longSunset})` }} />
      <div className="bd-tint" />
      <div className="bd-glows">
        <span className="glow opal" style={{ left: '-14%', top: '48%', width: '48vw', height: '46vw' }} />
        <span className="glow blood" style={{ right: '-10%', top: '52%', width: '44vw', height: '42vw' }} />
        <span className="glow fae" style={{ right: '4%', top: '-22%', width: '40vw', height: '34vw' }} />
      </div>
      <div className="bd-vignette" />
      <div className="walker" ref={walker}>
        <div className="walker-inner">
          <div className="pool" />
          <img src={girlLantern} alt="" />
          <div className="lamp" />
        </div>
      </div>
    </div>
  );
}