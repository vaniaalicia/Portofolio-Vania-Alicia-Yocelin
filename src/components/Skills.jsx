import { useRef, useState } from 'react';
import { useInView } from '../hooks/hooks.js';
import { skills, skillFilters } from '../data/content.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
const CATEGORY_LABEL = { languages: 'Language', web: 'Web', tools: 'Tool & Design' };

function SkillCard({ skill, index, hidden }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      style={{ '--i': index }}
      className={`card ${flipped ? 'is-flipped' : ''} ${hidden ? 'is-hidden' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${skill.name}. ${flipped ? 'Showing details' : 'Flip for details'}`}
    >
      <span className="card-inner">
        <span className="face front">
          <span className="num">{ROMAN[index] || index + 1}</span>
          <span className={`seal ${skill.tone}`}>{skill.seal}</span>
          <span className="cname">{skill.name}</span>
          <span className="ccat">{CATEGORY_LABEL[skill.category]}</span>
        </span>
        <span className="face back">
          <span className="bh">{skill.name}</span>
          <span className="tag">{CATEGORY_LABEL[skill.category]}</span>
          <span className="bp">{skill.use}</span>
          <span className="lvl"><i>{skill.level}</i></span>
        </span>
      </span>
    </button>
  );
}

export default function Skills() {
  const [filter, setFilter] = useState('all');
  const deckRef = useRef(null);
  const inView = useInView(deckRef, 0.15);
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="skills-head" data-reveal>
        <span className="label center">Skills</span>
        <h2 id="skills-title" className="h2">My <em>toolkit.</em></h2>
        <p>Flip a card to see how I use each one.</p>
      </div>
      <div className="tabs" role="group" aria-label="Filter skills" data-reveal style={{ '--d': '150ms' }}>
        {skillFilters.map((f) => (
          <button key={f.id} type="button" className="tab" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className={`deck ${inView ? 'is-in' : ''}`} ref={deckRef}>
        {skills.map((s, i) => (
          <SkillCard key={s.name} skill={s} index={i} hidden={filter !== 'all' && s.category !== filter} />
        ))}
      </div>
    </section>
  );
}
