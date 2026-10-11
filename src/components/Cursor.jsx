import { useEffect, useRef, useState } from 'react';
import star from '../assets/star-single.webp';

/*
  Star cursor (all themes) + a soft glow that trails the mouse (Clean theme only,
  shown via CSS). Only on devices with a real mouse.
*/
export default function Cursor() {
  const ref = useRef(null);
  const spot = useRef(null);
  const [enabled] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add('has-custom-cursor');
    const el = ref.current;
    const sp = spot.current;
    let x = -200, y = -200, sx = -400, sy = -400, raf = 0;

    const loop = () => {
      // the glow eases toward the pointer so it feels like it's following, not glued
      sx += (x - sx) * 0.12;
      sy += (y - sy) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      sp.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      raf = Math.abs(x - sx) + Math.abs(y - sy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
      const clickable = e.target.closest && e.target.closest('a, button, [role="button"]');
      el.classList.toggle('is-hover', Boolean(clickable));
      sp.classList.toggle('is-hover', Boolean(clickable));
      el.classList.remove('is-hidden');
      sp.classList.add('on');
    };
    const onLeave = () => { el.classList.add('is-hidden'); sp.classList.remove('on'); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={spot} className="spot" aria-hidden="true" />
      <div ref={ref} className="cursor is-hidden" aria-hidden="true">
        <img src={star} alt="" />
      </div>
    </>
  );
}
