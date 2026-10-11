import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { profile, contactForm } from '../data/content.js';

/*
  Contact page with a short form: name, email, what they need, message.
  If contactForm.accessKey is set (web3forms.com, free), the message is sent
  straight to Vania's inbox. Otherwise the visitor's email app opens with
  everything already filled in.
*/
export default function ContactPage({ onClose }) {
  const box = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', need: contactForm.needs[0], message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    box.current && box.current.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = form.name.trim() && emailOk && form.message.trim();

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    if (!contactForm.accessKey) {
      const subject = `${form.need} · from ${form.name}`;
      const body = `Hi Vania,\n\n${form.message}\n\n— ${form.name}\n${form.email}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactForm.accessKey,
          subject: `Portfolio: ${form.need} · from ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          need: form.need,
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="page-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-page-title" ref={box} tabIndex={-1}>
      <div className="detail-bg" />
      <div className="detail-top">
        <button type="button" onClick={onClose}><Icon name="arrowLeft" size={14} /> Back</button>
        <span className="pager">CONTACT</span>
      </div>

      <div className="page-body contact-body">
        <div className="contact-intro">
          <span className="label">Contact</span>
          <h1 id="contact-page-title" className="h2 page-title">Let&apos;s work <em>together.</em></h1>
          <p className="page-sub">Tell me a little about what you need. I&apos;ll reply to your email as soon as I can.</p>
          <div className="contact-direct">
            <a href={`mailto:${profile.email}`}><Icon name="mail" size={15} />{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={15} />LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Icon name="github" size={15} />GitHub</a>
          </div>
        </div>

        <div className="contact-card glass">
          {status === 'sent' ? (
            <div className="sent">
              <span className="sent-ic"><Icon name="check" size={22} /></span>
              <h2>Thank you, {form.name.split(' ')[0] || 'friend'}!</h2>
              <p>
                {contactForm.accessKey
                  ? "Your message is on its way. I'll get back to you soon."
                  : 'Your email app should open with your message ready. Just press send.'}
              </p>
              <button type="button" className="btn" onClick={onClose}>Back to the portfolio</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label className="field">
                <span>Name</span>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" aria-invalid={touched && !form.name.trim()} />
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" aria-invalid={touched && !emailOk} />
                {touched && !emailOk && <em className="err">Please enter a valid email so I can reply.</em>}
              </label>
              <fieldset className="field">
                <span>What do you need?</span>
                <div className="needs">
                  {contactForm.needs.map((n) => (
                    <button key={n} type="button" className="tab" aria-pressed={form.need === n} onClick={() => setForm((f) => ({ ...f, need: n }))}>{n}</button>
                  ))}
                </div>
              </fieldset>
              <label className="field">
                <span>Message</span>
                <textarea rows={5} value={form.message} onChange={set('message')} placeholder="A few lines about the role, project or idea…" aria-invalid={touched && !form.message.trim()} />
              </label>
              {status === 'error' && <p className="err">Something went wrong. Please email me directly at {profile.email}.</p>}
              <button type="submit" className="btn primary send" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'} <Icon name="arrowRight" size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
