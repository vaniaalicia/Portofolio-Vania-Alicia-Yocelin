import { about } from '../data/content.js';

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-grid">
        <div className="about-main glass" data-reveal>
          <span className="label">About Me</span>
          <h2 id="about-title" className="h2">
            {about.title}<br /><em>{about.titleAccent}</em>
          </h2>
          {about.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          <div className="chips" data-stagger style={{ '--base': '450ms' }}>
            {about.chips.map((c, i) => <span key={c} className="chip" style={{ '--i': i }}>{c}</span>)}
          </div>
        </div>
        <div className="facts" data-stagger style={{ '--base': '200ms' }}>
          {about.facts.map((f, i) => (
            <div key={f.label} className={`fact glass c-${f.color}`} style={{ '--i': i }}>
              <small>{f.label}</small>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
