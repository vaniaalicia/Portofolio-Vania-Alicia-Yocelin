import { useState } from 'react';
import Icon from './Icon.jsx';
import { profile } from '../data/content.js';
import { smoothScrollTo } from '../hooks/hooks.js';

export default function Footer({ onContact }) {
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Hello Vania')}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch (e) {
      const t = document.createElement('textarea');
      t.value = profile.email; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const toTop = () => smoothScrollTo(0, 1800);

  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <div className="footer-grid" data-stagger>
        <div style={{ '--i': 0 }}>
          <div className="eyebrow">Contact</div>
          <h2 id="contact-title">Let&apos;s work <em>together.</em></h2>
          <p>I&apos;m currently looking for internship opportunities in software and front-end development.</p>
        </div>
        <div style={{ '--i': 2 }}>
          <div className="eyebrow">Get in touch</div>
          <p>Send me a message or email me directly. I&apos;ll get back to you as soon as I can.</p>
          <div className="btns">
            <button type="button" className="btn primary square" onClick={onContact}><Icon name="mail" size={15} />Send a message</button>
            <a className="btn ghost square" href={profile.cv} target="_blank" rel="noreferrer"><Icon name="download" size={15} />Download CV</a>
          </div>
        </div>
        <div style={{ '--i': 4 }}>
          <div className="eyebrow">Elsewhere</div>
          <div className="clist">
            <div>
              <small>Email</small>
              <span>
                <a href={mailto}>{profile.email}</a>
                <button type="button" className="copy-btn" onClick={copy} aria-label="Copy email address">
                  <Icon name={copied ? 'check' : 'copy'} size={13} />{copied ? 'Copied' : 'Copy'}
                </button>
              </span>
            </div>
            <div><small>LinkedIn</small><a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></div>
            <div><small>GitHub</small><a href={profile.github} target="_blank" rel="noreferrer">{profile.github.replace(/^https?:\/\/(www\.)?/, '')}</a></div>
            <div><small>Location</small><span>{profile.location}</span></div>
          </div>
        </div>
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} {profile.fullName}. All rights reserved.</span>
        <button type="button" onClick={toTop}>Back to top <Icon name="arrowUp" size={12} /></button>
      </div>
      <div className={`toast ${copied ? 'is-on' : ''}`} role="status">Email copied</div>
    </footer>
  );
}
