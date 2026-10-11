// ─────────────────────────────────────────────────────────────
//  All the words on the website live here.
//  Change text, links, skills, experience or projects in this file
//  and the page updates automatically. No need to touch the layout.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Vania',
  fullName: 'Vania Alicia Yocelin',
  role: 'Computer Science Student',
  tagline: 'The girl behind the code',
  landingLine: 'Where code meets curiosity and creativity.',
  // TODO: pick the email you want recruiters to use
  email: 'vania.yocelin@binus.ac.id',
  // TODO: replace with your real links
  linkedin: 'https://www.linkedin.com/in/your-username',
  github: 'https://github.com/your-username',
  // Put your CV file in the /public folder with this exact name
  cv: '/Vania-Alicia-Yocelin-CV.pdf',
  location: 'Jakarta, Indonesia',
};

// Contact form (the "Contact" page).
// To receive messages straight in your inbox without opening the visitor's email app:
// 1. go to https://web3forms.com, enter your email, and copy the "Access Key" they send you
// 2. paste it below. Until then, the form opens the visitor's email app with everything filled in.
export const contactForm = {
  accessKey: '',
  needs: ['Internship opportunity', 'Freelance / project', 'Collaboration', 'Just saying hi'],
};

export const stats = [
  { value: 5, suffix: '', label: 'projects shipped' },
  { value: 10, suffix: '+', label: 'skills' },
  { value: 2, suffix: '+', label: 'years of coding' },
];

export const about = {
  title: "Designer's eye.",
  titleAccent: "Engineer's mindset.",
  paragraphs: [
    'Computer Science student at BINUS University with a background in graphic design. I care about how a product feels to use, not only whether it works, and I bring that attention to detail into every interface I build.',
    "Right now I'm focused on web development while leading teams in my campus cybersecurity community, where I've learned to plan, communicate, and deliver with other people.",
  ],
  chips: ['React', 'JavaScript', 'HTML', 'CSS', 'Python', 'C / C++', 'Figma', 'Canva'],
  facts: [
    { label: 'Currently', value: 'Computer Science at BINUS University · Class of 2028', color: 'opal' },
    { label: 'Based in', value: 'Jakarta, Indonesia', color: 'fae' },
    { label: 'Open to', value: 'Internships & collaborative projects', color: 'blood' },
    { label: 'Strengths', value: 'UI & visual design · Team leadership · Fast learner', color: 'opal' },
    { label: 'Currently learning', value: 'React and modern front-end development', color: 'fae' },
  ],
};

// category: 'languages' | 'web' | 'tools'
// seal: short text shown in the circle on the card front
// tone: 'fae' | 'opal' | 'blood'
// level: shown on the back of the card
export const skills = [
  { name: 'Python', category: 'languages', seal: 'Py', tone: 'fae', level: 'Comfortable', use: 'Scripts, data tasks and my first algorithms classes.' },
  { name: 'C', category: 'languages', seal: 'C', tone: 'opal', level: 'Comfortable', use: 'Learning how memory and pointers really work.' },
  { name: 'C++', category: 'languages', seal: 'C++', tone: 'blood', level: 'Comfortable', use: 'Data structures and object-oriented programming coursework.' },
  { name: 'HTML', category: 'web', seal: '</>', tone: 'fae', level: 'Confident', use: 'Semantic, accessible structure for every page I build.' },
  { name: 'CSS', category: 'web', seal: '{ }', tone: 'opal', level: 'Confident', use: 'Layouts, responsive design and animation.' },
  { name: 'React', category: 'web', seal: 'Re', tone: 'blood', level: 'Learning', use: 'Component-based interfaces, like this portfolio.' },
  { name: 'JavaScript', category: 'web', seal: 'JS', tone: 'fae', level: 'Comfortable', use: 'Interactivity and logic in the browser.' },
  { name: 'VS Code', category: 'tools', seal: 'VS', tone: 'opal', level: 'Daily driver', use: 'Where all my code gets written and debugged.' },
  { name: 'Figma', category: 'tools', seal: 'Fi', tone: 'fae', level: 'Comfortable', use: 'Wireframes and UI mockups before I write code.' },
  { name: 'Canva', category: 'tools', seal: 'Ca', tone: 'blood', level: 'Confident', use: 'Posters, feeds and brand assets for organizations.' },
  { name: 'Illustration', category: 'tools', seal: '✎', tone: 'fae', level: 'Confident', use: 'Digital painting and visual storytelling.' },
  { name: 'Leadership', category: 'tools', seal: '◈', tone: 'opal', level: 'Proven', use: 'Leading teams and events in campus organizations.' },
];

export const skillFilters = [
  { id: 'all', label: 'All' },
  { id: 'languages', label: 'Languages' },
  { id: 'web', label: 'Web' },
  { id: 'tools', label: 'Tools & Design' },
];

// category: 'leadership' | 'media' | 'learning' | 'volunteer' | 'achievement'
// TODO: check every "description" line and rewrite it in your own words
export const experience = [
  {
    category: 'leadership', title: 'Project Manager', org: 'LDKA · Cyber Security Community', period: '2026 – 2027', year: '2026',
    description: "Leading the planning of the community's leadership training for new members.",
  },
  {
    category: 'leadership', title: 'Regional Head', org: 'Cyber Security Community · Alam Sutera', period: '2025 – 2026', year: '2025',
    description: 'Coordinating the regional team, its programs, and its members.',
  },
  {
    category: 'media', title: 'Director, Cyber Fortify Video', org: 'CSC · Media & Publication Division', period: '2025 – 2026', year: '2025',
    description: "Directed the community's cyber-awareness video from concept to final cut.",
  },
  {
    category: 'leadership', title: 'Freshman Leader & Partner', org: 'BINUS University · B29', period: '2025', year: '2025',
    description: 'Guided a group of new students through their first semester on campus.',
  },
  {
    category: 'learning', title: 'B.Sc. Computer Science', org: 'BINUS University', period: '2024 – 2028', year: '2024',
    description: 'Algorithms, software engineering, and web development.',
  },
  {
    category: 'achievement', title: '1st Place, 3D Bulletin Board', org: 'Museum Waja Sampai Kaputing', period: '2023', year: '2023',
    description: 'Won out of 144 participants for Indonesian Museum Day.',
  },
  {
    category: 'leadership', title: 'Treasurer, Student Council', org: 'SMA Kristen Kanaan Banjarmasin', period: '2022 – 2023', year: '2022',
    description: "Managed the council's budget and finances.",
  },
];

export const experienceFilters = [
  { id: 'all', label: 'All' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'media', label: 'Media & Publication' },
  { id: 'learning', label: 'Learning' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'achievement', label: 'Achievement' },
];

// Projects for "My Work".
// Put screenshots in /public/projects/ and write the path, e.g. '/projects/plan-desktop.png'
// desktop = wide screenshot, mobile = phone screenshot, gallery = extra images for the detail page
// TODO: replace these placeholders with your real projects
// featured: true → shown in "Selected work". Every project appears on the "All projects" page.
// category is used for the filters on the "All projects" page (e.g. 'Web', 'Mobile', 'AI', 'Design').
export const projects = [
  {
    id: 'project-one',
    featured: true,
    category: 'Web',
    year: '2026',
    name: 'Project One',
    type: 'Web App',
    summary: 'One line on what the website does and who it helps.',
    stack: ['React', 'Tailwind', 'Supabase'],
    role: 'Front-end developer',
    delivered: 'Responsive web app',
    live: '',
    repo: '',
    desktop: '',
    mobile: '',
    gallery: [],
  },
  {
    id: 'project-two',
    featured: true,
    category: 'Web',
    year: '2025',
    name: 'Project Two',
    type: 'Website',
    summary: 'One line on what the website does and who it helps.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    role: 'Designer & developer',
    delivered: 'Marketing website',
    live: '',
    repo: '',
    desktop: '',
    mobile: '',
    gallery: [],
  },
  {
    id: 'project-three',
    featured: true,
    category: 'Web',
    year: '2025',
    name: 'Project Three',
    type: 'Web App',
    summary: 'One line on what the website does and who it helps.',
    stack: ['Node.js', 'Express', 'PostgreSQL'],
    role: 'Full-stack developer',
    delivered: 'Web app with database',
    live: '',
    repo: '',
    desktop: '',
    mobile: '',
    gallery: [],
  },
  {
    id: 'project-four',
    featured: false,
    category: 'AI',
    year: '2025',
    name: 'Project Four',
    type: 'AI / ML',
    summary: 'One line on what the project does and who it helps.',
    stack: ['Python', 'Flask'],
    role: 'Developer',
    delivered: 'Prediction web app',
    live: '',
    repo: '',
    desktop: '',
    mobile: '',
    gallery: [],
  },
];

export const sections = [
  { id: 'about', label: 'About Me', blurb: 'Who I am and what drives me.' },
  { id: 'skills', label: 'Skills', blurb: 'Tools and technologies I work with.' },
  { id: 'experience', label: 'Experience', blurb: "Where I've been and what I've learned." },
  { id: 'work', label: 'My Work', blurb: "Selected projects I've built." },
  { id: 'contact', label: 'Contact', blurb: "Let's talk about working together." },
];
