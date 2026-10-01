import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { galleryItems, type GalleryItem } from './galleryData';
import TeamPage from './TeamPage';
import EnrollmentPage from './EnrollmentPage';
import { schoolDetails, tuitionFees } from './schoolDetails';
import { useSiteMotion } from './useSiteMotion';

const asset = (name: string) => `/assets/${name}`;

const navItems = [
  ['Home', '/'], ['About', '/about'], ['Programs', '/programs'],
  ['Admissions', '/admissions'], ['Team', '/team'], ['Gallery', '/gallery'],
  ['Events', '/events'], ['Blog', '/blog'], ['Contact', '/contact'],
] as const;

function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  const hash = to.split('#')[1];
  window.setTimeout(() => hash ? document.getElementById(hash)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) : window.scrollTo({ top: 0, behavior: 'instant' }), 40);
}

function SiteLink({ to, children, className = '', onClick, ...rest }: {
  to: string; children: ReactNode; className?: string; onClick?: () => void;
  'aria-label'?: string;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && to.startsWith('/')) {
      event.preventDefault();
      navigate(to);
    }
  }
  return <a href={to} className={className} onClick={handleClick} {...rest}>{children}</a>;
}

type IconName = 'pin' | 'phone' | 'clock' | 'mail' | 'heart' | 'users' | 'sparkle' | 'book' | 'award' | 'timer' | 'calendar' | 'file' | 'check' | 'leaf' | 'arrow' | 'send' | 'menu' | 'close' | 'sun';

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.5 10a15 15 0 0 0 6.5 6.5l1.5-1.5a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    mail: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
    heart: <path d="M20.8 8.2c0 5-8.8 10.8-8.8 10.8S3.2 13.2 3.2 8.2a4.4 4.4 0 0 1 8.8-.8 4.4 4.4 0 0 1 8.8.8Z"/>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.4a3 3 0 0 1 0 5.2M18 14a5 5 0 0 1 3 4.6V20"/></>,
    sparkle: <><path d="m12 2 1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9L12 2ZM20 19l.5 1.5L22 21l-1.5.5L20 23l-.5-1.5L18 21l1.5-.5L20 19Z"/></>,
    book: <><path d="M12 5a9 9 0 0 0-9-2v15a9 9 0 0 1 9 2 9 9 0 0 1 9-2V3a9 9 0 0 0-9 2v15"/></>,
    award: <><circle cx="12" cy="8" r="5"/><path d="m8 12-1 9 5-3 5 3-1-9"/></>,
    timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6M12 2v3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/></>,
    file: <><path d="M5 2h9l5 5v15H5zM14 2v5h5M8 12h8M8 16h8"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
    leaf: <><path d="M20 3C10 3 4 8 4 15a6 6 0 0 0 6 6c7 0 12-6 10-18ZM4 21c2-5 6-9 12-12"/></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand({ light = false }: { light?: boolean }) {
  return <SiteLink to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Early Childhood Montessori home">
    <img src={asset('school-logo.jpg')} alt="" />
    <span className="brand-words"><strong>Early Childhood</strong><small>Montessori</small></span>
  </SiteLink>;
}

function Header({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  return <header className="site-header">
    <div className="topbar"><div className="container topbar-inner">
      <div className="topbar-left"><span><Icon name="pin" size={15}/> Ranipauwa, Pokhara-11,</span><a href="mailto:mail@earlychildhood.edu.np">mail@earlychildhood.edu.np</a></div>
      <div className="topbar-right"><a href={schoolDetails.phoneLink}><Icon name="phone" size={16}/> {schoolDetails.phone}</a><span><Icon name="clock" size={16}/> {schoolDetails.compactHours}</span></div>
    </div></div>
    <div className="nav-shell"><div className="container nav-inner">
      <Brand />
      <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={27}/></button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {navItems.map(([label, to]) => <SiteLink key={to} to={to} className={pathname === to || (to === '/admissions' && pathname === '/enroll') ? 'active' : ''} onClick={() => setOpen(false)}>{label}</SiteLink>)}
      </nav>
    </div></div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-grid">
      <div className="footer-brand"><Brand light/><p>Nurturing curious minds through child-centered Montessori education.</p></div>
      <div><h3>Quick Links</h3><SiteLink to="/about">About Us</SiteLink><SiteLink to="/programs">Our Programs</SiteLink><SiteLink to="/admissions">Admissions</SiteLink><SiteLink to="/team">Our Team</SiteLink><SiteLink to="/enroll">Enroll Your Child</SiteLink><SiteLink to="/gallery">Gallery</SiteLink><SiteLink to="/contact">Contact</SiteLink><SiteLink to="/blog">Blog</SiteLink><SiteLink to="/events">Event</SiteLink></div>
      <div><h3>Programs</h3><SiteLink to="/programs#infant">Infant Program (12-36 months)</SiteLink><SiteLink to="/programs#prenursery">Toddler Program (18-36 months)</SiteLink><SiteLink to="/programs#nursery">Preschool (3-6 years)</SiteLink></div>
      <div><h3>Contact</h3><a href={schoolMap} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={16}/> Ranipauwa, Pokhara-11, Nepal</a><a href={schoolDetails.phoneLink}><Icon name="phone" size={16}/> {schoolDetails.phone}</a><a href={`mailto:${schoolDetails.email}`}><Icon name="mail" size={16}/> {schoolDetails.email}</a><span><Icon name="clock" size={16}/><span>{schoolDetails.workingDays}<br/>{schoolDetails.workingHours}</span></span></div>
    </div>
    <div className="copyright">© 2026 Montessori Early Childhood. All rights reserved.</div>
  </div></footer>;
}

const schoolMap = 'https://www.google.com/maps/place/Early+Childhood+Montessori+school/@28.2223921,83.9922149,17z/data=!3m1!4b1!4m6!3m5!1s0x399595e69dbf461d:0x159667f2826bee09!8m2!3d28.2223921!4d83.9922149!16s%2Fg%2F11kblcdpw4?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';

function Partners() {
  return <section className="partners" aria-label="Partnered with Pocomat">
    <div className="container"><h2>Partnered with</h2><div className="partner-line">
      <a href="https://pocomat.com/pocomatdevineers-home" target="_blank" rel="noopener noreferrer" aria-label="Visit Pocomat Devineers"><img src={asset('pocomat-devineers-logo.jpg')} alt="Pocomat Devineers logo" /></a>
      <a href="https://pocomat.com/computeracademy-home" target="_blank" rel="noopener noreferrer" aria-label="Visit Pocomat Computer Academy"><img src={asset('pocomat-computer-logo.jpg')} alt="Pocomat Computer Academy logo" /></a>
    </div></div>
  </section>;
}

function Journey({ secondary = 'Email Us' }: { secondary?: 'Email Us' | 'Admission Info' }) {
  return <section className="journey"><div className="container">
    <h2>Ready To Begin Your Journey?</h2>
    <p>Schedule a tour of our school and see the Montessori method in action</p>
    <div className="journey-actions"><SiteLink className="button button-blue" to="/contact?reason=School%20visit#message">Schedule a visit</SiteLink>
      {secondary === 'Admission Info' ? <SiteLink className="button button-cream" to="/admissions">Admission Info</SiteLink> : <a className="button button-cream" href="mailto:mail@earlychildhood.edu.np">Email Us</a>}
    </div>
  </div></section>;
}

function PageBanner({ title, description, variant = 'pink' }: { title: string; description: string; variant?: 'pink' | 'blue' }) {
  return <section className={`page-banner banner-${variant}`}><div className="container">
    <h1>{title}</h1><p>{description}</p>
  </div></section>;
}

const features: { icon: IconName; title: string; detail: string }[] = [
  { icon: 'heart', title: 'Child-Centered Learning', detail: 'Each child learns at their own pace in a nurturing environment' },
  { icon: 'users', title: 'Experienced Teachers', detail: 'Certified Montessori educators passionate about early childhood' },
  { icon: 'sparkle', title: 'Hands-On Materials', detail: 'Authentic Montessori materials that engage all senses' },
  { icon: 'book', title: 'Holistic Development', detail: 'Focus on cognitive, social, emotional, and physical growth' },
  { icon: 'timer', title: 'Flexible Schedule', detail: 'Full-day and half-day programs available' },
  { icon: 'award', title: 'Proven Method', detail: 'Over 100 years of educational excellence' },
];

const programs = [
  { id: 'infant', emoji: '👶', title: 'Infant Program', age: 'Ages 12-36 months', points: ['Secure attachment with primary caregivers', 'Freedom of movement', 'Sensory exploration', 'Language-rich environment'], color: 'rose' },
  { id: 'toddler', emoji: '🧸', title: 'Toddler Program', age: 'Ages 18-36 months', points: ['Independence and self-care skills', 'Language development', 'Practical life activities', 'Social interaction'], color: 'sky' },
  { id: 'preschool', emoji: '📚', title: 'Preschool Program', age: 'Ages 3-6 years', points: ['Academic foundation', 'Cultural studies', 'Mathematical concepts', 'Reading and writing readiness'], color: 'mint' },
];

function ProgramCards({ expanded = false }: { expanded?: boolean }) {
  return <div className="program-grid">{programs.map(program => <article className={`program-card ${program.color}`} id={expanded ? program.id : undefined} key={program.title}>
    <span className="program-emoji" aria-hidden="true">{program.emoji}</span>
    <h3>{program.title}</h3><p>{program.age}</p>
    <ul>{program.points.map(point => <li key={point}>{point}</li>)}</ul>
    <SiteLink to={expanded ? '/contact?reason=Program%20inquiry#message' : `/programs#${program.id}`} className="text-link">Learn More <span aria-hidden="true">→</span></SiteLink>
  </article>)}</div>;
}

const welcomePhotos = [
  { image: 'gallery/classroom-03.jpg', alt: 'A child exploring pink Montessori blocks', position: 'center 35%' },
  { image: 'gallery/classroom-02.jpg', alt: 'Children learning together with their teacher', position: 'center 35%' },
  { image: 'gallery/classroom-01.jpg', alt: 'Books and learning resources in our classroom', position: 'center' },
  { image: 'gallery/activities-32.webp', alt: 'Children drawing and coloring in their classroom', position: 'center 18%' },
];

function HomePage() {
  return <>
    <section className="home-hero"><div className="container hero-content"><h1>Nurturing Curious Minds</h1><p>Discover the Montessori difference for your child's early year</p>
      <div className="hero-actions"><SiteLink to="/contact?reason=School%20visit#message" className="button hero-primary">Schedule a Visit</SiteLink><SiteLink to="/programs" className="button hero-secondary">Our Programs</SiteLink></div>
    </div></section>
    <section className="quote-section"><div className="container"><h2>Early Childhood Montessori &amp; Academy</h2>
      <div className="quote-row"><div><p className="quote-highlight">“Radiance on undiscovered movement”</p>
        <blockquote>"ECEC Montessori gives, your child a strong basis in the most formative and important years for developing into a responsible happy and fulfilled person."</blockquote>
        <strong>• &nbsp;Dr.Maria Montessori (1870 AD - 1952 AD)</strong>
      </div><img src={asset('montessori-portrait.png')} alt="Portrait of Maria Montessori" /></div>
    </div></section>
    <section className="welcome-section"><div className="container"><h2>Welcome to Early Childhood Montessori</h2>
      <div className="welcome-grid"><div className="welcome-copy">
        <p>For over 25 years, we've been providing exceptional Montessori education to children from infancy through kindergarten. Our carefully prepared environments encourage independence, creativity, and a lifelong love of learning.</p>
        <p>Founded on the principles of Dr. Maria Montessori, we believe in respecting each child as a unique individual and supporting their natural development through hands-on exploration and discovery.</p>
        <SiteLink to="/about" className="button button-blue rounded-small">Learn More about us</SiteLink>
      </div><div className="welcome-photos">{welcomePhotos.map(photo => <div className="welcome-photo" key={photo.image}><img src={asset(photo.image)} alt={photo.alt} style={{ objectPosition: photo.position }} loading="lazy" decoding="async" /></div>)}</div></div>
    </div></section>
    <section className="features-section"><div className="container"><div className="section-heading"><h2>Why Choose Montessori?</h2><p>Our approach fosters independence, confidence, and a natural love of learning</p></div>
      <div className="feature-grid">{features.map(feature => <article className="feature-card" key={feature.title}><span className="feature-icon"><Icon name={feature.icon} size={22}/></span><h3>{feature.title}</h3><p>{feature.detail}</p></article>)}</div>
    </div></section>
    <section className="program-section"><div className="container"><div className="section-heading"><h2>Our Programs</h2><p>Age appropriate environments designed for optimal development</p></div><ProgramCards /></div></section>
    <section className="testimonials"><div className="container"><div className="section-heading"><h2>What Parents Say</h2><p>Hear from the families who've experienced the Montessori difference</p></div>
      <div className="testimonial-grid">
        <blockquote>“Our daughter has blossomed at Montessori Early Childhood. She's more confident, independent, and loves learning!”<footer><strong>Sarah Johnson</strong><span>Parent</span></footer></blockquote>
        <blockquote>“The teachers truly understand child development. We see progress every day and our son is excited to go to school.”<footer><strong>Michael Chen</strong><span>Parent</span></footer></blockquote>
        <blockquote>“The Montessori approach has given our twins a strong foundation. They're curious, compassionate, and ready for anything.”<footer><strong>Emily Rodriguez</strong><span>Parent</span></footer></blockquote>
      </div></div></section>
    <Journey secondary="Admission Info" />
  </>;
}

function AboutPage() {
  return <><section className="about-section"><div className="container">
    <div className="section-heading about-heading"><h1>About Early Childhood Montessori &amp; Academy</h1><p>Dedicated to providing quality early childhood education in Ranipauwa,<br/> Pokhara-11 since 2005.</p><span className="heading-line"/></div>
    <div className="about-intro"><img src={asset('school-campus.jpg')} alt="Early Childhood Montessori school building and courtyard" />
      <div><p>Early Childhood Montessori &amp; Academy is dedicated to providing quality early childhood education. We believe that children learn best through exploration, creativity, and meaningful experiences.</p>
        <p>Our Montessori-inspired curriculum encourages children to become independent thinkers while developing respect, responsibility, and compassion. We strive to create a nurturing environment where every child feels loved, respected, and inspired to reach their full potential.</p>
        <p>Our child-friendly educational approach (<strong>बालमैत्री वातावरण शिक्षा</strong>) helps children develop academically, socially, emotionally, and physically through hands-on experiences.</p>
      </div></div>
    <div className="values-grid"><article className="value-card vision"><h2><Icon name="sun" size={30}/> Our Vision</h2><p>To become a leading child-centered educational institution that inspires young learners to become confident, responsible, and lifelong learners.</p></article>
      <article className="value-card mission"><h2><Icon name="leaf" size={30}/> Our Mission</h2><ul><li>Provide quality Montessori education</li><li>Foster creativity and critical thinking</li><li>Develop children's social and emotional skills</li><li>Build strong partnerships with parents</li><li>Create a safe and inclusive learning environment</li></ul></article></div>
  </div></section><Journey secondary="Admission Info" /></>;
}

function ProgramsPage() {
  const schoolPrograms: { id: string; age: string; title: string; description: string; icon: IconName; tone: string }[] = [
    { id: 'infant', age: '18 months', title: 'Infant + Toddler', description: 'Gentle introduction to a structured environment. Sensory exploration, movement, language stimulation, and bonding through guided play.', icon: 'heart', tone: 'baby' },
    { id: 'prenursery', age: '2.5–3 Years', title: 'Pre-Nursery', description: 'Building early social skills, language, and independence through creative play, storytelling, music, and Montessori sensorial activities.', icon: 'sun', tone: 'white' },
    { id: 'nursery', age: '3–4 Years', title: 'Nursery', description: 'Language development, social skills, and creative activities. Structured exploration using authentic Montessori materials in a nurturing classroom.', icon: 'book', tone: 'white dark' },
    { id: 'lower-kindergarten', age: '4–5 Years', title: 'Lower Kindergarten', description: 'Early literacy, numeracy, science, and practical life activities. Developing curiosity and foundational academic skills with hands-on learning.', icon: 'sparkle', tone: 'blue' },
    { id: 'upper-kindergarten', age: '5–6 Years', title: 'Upper Kindergarten', description: 'School readiness, leadership, confidence building, and academic preparation. Children develop responsibility and critical thinking for primary school.', icon: 'award', tone: 'slate' },
    { id: 'primary', age: '6–10 Years', title: 'Primary', description: 'Subject-specialist teachers guide children through each grade with a focus on deep understanding, independent thinking, and academic excellence.', icon: 'book', tone: 'sand' },
  ];
  const activities: { icon: IconName; label: string }[] = [
    { icon: 'book', label: 'Practical Life' }, { icon: 'sparkle', label: 'Sensorial Activities' },
    { icon: 'users', label: 'Language Development' }, { icon: 'award', label: 'Mathematics' },
    { icon: 'leaf', label: 'Cultural Studies' }, { icon: 'heart', label: 'Art & Craft' },
    { icon: 'sun', label: 'Music & Dance' }, { icon: 'sparkle', label: 'Outdoor Play' },
  ];
  return <>
    <section className="school-programs"><div className="container">
      <div className="section-heading programs-heading"><h1>Our Educational Programs</h1><p>Age-appropriate programs designed to nurture curiosity, independence,<br className="desktop-only"/> and a love of learning at every stage.</p><span className="heading-line"/></div>
      <div className="school-program-grid">{schoolPrograms.map(program => <article id={program.id} className={`school-program-card ${program.tone}`} key={program.id}>
        <div className="program-card-top"><span className="age-pill">{program.age}</span><span className="program-card-icon"><Icon name={program.icon} size={23}/></span></div>
        <h2>{program.title}</h2><p>{program.description}</p>
      </article>)}</div>
    </div></section>
    <section className="breakdown"><div className="container">
      <div className="breakdown-title"><span><Icon name="users" size={23}/></span><div><h2>Admission Breakdown</h2><p>Program structure, class duration, and capacity at a glance.</p></div></div>
      <div className="breakdown-table-wrap"><table><thead><tr><th>Program</th><th>Age Range</th><th>Class Duration</th><th>No. of Teachers</th><th>No. of Children</th></tr></thead><tbody>
        <tr><td><span className="dot purple"/>Infant + Toddler</td><td>18 months</td><td>8 months</td><td>3</td><td>12</td></tr>
        <tr><td><span className="dot red"/>Pre-Nursery</td><td>2.5–3 years</td><td>6 months</td><td>2</td><td>15</td></tr>
        <tr><td><span className="dot orange"/>Nursery</td><td>3–4 years</td><td>1 year</td><td>4 <small>2 per section</small></td><td>35 <small>Divided into 2 sections</small></td></tr>
        <tr><td><span className="dot green"/>Lower Kindergarten</td><td>4–5 years</td><td>1 year</td><td>4 <small>2 per section</small></td><td>35 <small>Divided into 2 sections</small></td></tr>
        <tr><td><span className="dot purple"/>Upper Kindergarten</td><td>5–6 years</td><td>1 year</td><td>4 <small>2 per section</small></td><td>35 <small>Divided into 2 sections</small></td></tr>
        <tr><td><span className="dot blue"/>Primary</td><td>6–10 years</td><td>1 year per grade</td><td>7 <small>Subject specialists</small></td><td>16 <small>Maximum per class</small></td></tr>
      </tbody></table></div>
      <div className="program-callouts"><p>Nursery, LKG &amp; UKG are divided into two sections of up to 17–18 children each.</p><p>Primary classes have a maximum of 16 students per class.</p><p>Primary teachers specialize in their subject areas.</p></div>
    </div></section>
    <section className="activities-section"><div className="container"><h2>Montessori Activities</h2><div className="activities-grid">{activities.map(activity => <div className="activity-tile" key={activity.label}><Icon name={activity.icon} size={22}/><span>{activity.label}</span></div>)}</div></div></section>
  </>;
}

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: 'calendar', title: 'Schedule a Tour', text: 'Visit our school and observe our classrooms in action. Meet our teachers and see the Montessori method firsthand.' },
  { icon: 'file', title: 'Submit Application', text: 'Complete our enrollment application and provide required documentation including immunization records.' },
  { icon: 'users', title: 'Parent Interview', text: "Meet with our Head of School to discuss your child's needs and our program in detail." },
  { icon: 'check', title: 'Enrollment', text: "Once accepted, complete enrollment paperwork and secure your child's spot with a deposit." },
];

const faqs = [
  ['When can my child start?', 'We accept enrollments year-round with flexible start dates. Most families begin at the start of our school year in September or January.'],
  ['Do you offer financial assistance?', 'Yes, we offer limited need-based financial aid. We also accept various childcare subsidies and offer payment plans.'],
  ['What should my child wear?', 'Comfortable, practical clothing that allows for movement and exploration. We recommend clothes that your child can manage independently.'],
  ['What is your teacher to student ratio?', 'We maintain low ratios: 1:3 for infants, 1:4 for toddlers, and 1:8 for preschoolers, exceeding state requirements.'],
  ['Do you provide meals?', 'We provide healthy morning and afternoon snacks. Families provide lunch for full-day students, and we encourage nutritious, balanced meals.'],
  ['What happens if my child misses school?', 'We understand that illness and family events happen. Please notify us of absences. Tuition is not prorated for absences.'],
];

function AdmissionsPage() {
  return <><PageBanner title="Admissions" description="Join our community and give your child a gift of Montessori education" variant="blue" />
    <section className="enrollment-section"><div className="container"><div className="section-heading"><h2>Enrollment Process</h2><p>Four simple steps to join our Montessori community</p></div>
      <div className="step-grid">{steps.map((step, index) => <article key={step.title}><span className="step-icon"><Icon name={step.icon} size={25}/></span><strong>{index + 1}</strong><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      <SiteLink className="button button-blue application-button" to="/enroll">Start Your Application</SiteLink>
    </div></section>
    <section className="tuition-section"><div className="narrow"><div className="section-heading"><h2>Tuition &amp; Fees</h2><p>Transparent pricing with flexible payment options</p></div>
      <div className="tuition-table-wrap"><table><thead><tr><th>Program</th><th>Monthly Tuition</th></tr></thead><tbody>
        {tuitionFees.map(fee => <tr key={fee.program}><td>{fee.program}</td><td>{fee.monthly}/month</td></tr>)}
      </tbody></table></div>
      <div className="additional-info"><h3>Additional Information</h3><p>Contact our admissions team for fees for other programs, registration, materials, and payment arrangements.</p><SiteLink className="text-link" to="/enroll">Apply for enrollment <span aria-hidden="true">→</span></SiteLink></div>
    </div></section>
    <section className="requirements-section"><div className="narrow"><h2>Enrollment Requirements</h2><div className="requirements-grid">
      <div className="requirement-card"><h3>Required Documents</h3><ul className="check-list"><li>Completed enrollment application</li><li>Child's birth certificate</li><li>Current immunization records</li><li>Emergency contact information</li><li>Medical release forms</li></ul></div>
      <div className="requirement-card"><h3>Age Requirements</h3><dl><dt>Infant Program</dt><dd>6 weeks to 18 months</dd><dt>Toddler Program</dt><dd>18 months to 3 years</dd><dt>Preschool Program</dt><dd>3 years to 6 years (must be potty trained)</dd></dl><p className="requirement-note"><strong>Note:</strong> Children must meet age requirements by September 1st of the enrollment year.</p></div>
    </div></div></section>
    <section className="faq-section"><div className="narrow"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqs.map(([q,a]) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></section>
    <Journey />
  </>;
}

// Lead with supplied photos in the same category order as the designer's twelve-card layout.
const featuredGalleryImages = [
  'gallery/graduation-2081-01.webp', 'gallery/outdoor-02.jpg', 'gallery/classroom-01.jpg',
  'gallery/cultural-01.jpg', 'gallery/events-10.webp', 'gallery/cultural-02.jpg',
  'gallery/outdoor-05.jpg', 'gallery/cultural-03.jpg', 'gallery/events-11.webp',
  'gallery/activities-13.jpg', 'gallery/activities-23.jpg', 'gallery/activities-27.webp',
];
const featuredImages = new Set(featuredGalleryImages);
const galleryTiles: GalleryItem[] = [
  ...featuredGalleryImages.map(image => galleryItems.find(item => item.image === image)!),
  ...galleryItems.filter(item => !featuredImages.has(item.image)),
];

function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const categories = ['All', 'Activities', 'Classroom', 'Outdoor', 'Cultural', 'Events', 'Graduation'];
  const visible = galleryTiles.filter(item => filter === 'All' || item.categories.includes(filter));
  const selectedIndex = selected ? visible.findIndex(item => item.image === selected.image) : -1;
  const showAdjacent = (step: number) => {
    if (selectedIndex >= 0) setSelected(visible[(selectedIndex + step + visible.length) % visible.length]);
  };
  useEffect(() => {
    if (!selected) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowLeft') showAdjacent(-1);
      if (event.key === 'ArrowRight') showAdjacent(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener('keydown', handleKey); };
  }, [selected, filter]);
  return <><PageBanner title="Our Gallery" description="A window into the vibrant, joyful, and purposeful daily life at Early Childhood Education Centre." />
    <section className="gallery-section"><div className="container"><div className="gallery-filters" aria-label="Filter photos">{categories.map(category => <button type="button" key={category} onClick={() => { setFilter(category); setSelected(null); }} className={filter === category ? 'selected' : ''} aria-pressed={filter === category}>{category}</button>)}</div>
      <div className="gallery-grid" key={filter}>{visible.map(item => <button type="button" className="gallery-item" key={item.image} onClick={() => setSelected(item)} aria-label={`View photo: ${item.alt}`}><img src={asset(item.image)} alt={item.alt} loading="lazy" decoding="async" /><span>{filter === 'All' ? item.categories[0] : filter}</span></button>)}</div>
    </div></section>
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.alt} onClick={e => e.stopPropagation()}><button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close photo"><Icon name="close"/></button><img key={selected.image} src={asset(selected.image)} alt={selected.alt}/><div className="lightbox-toolbar"><button type="button" onClick={() => showAdjacent(-1)} aria-label="Previous photo">←</button><p>{selected.alt}<small>{selectedIndex + 1} / {visible.length}</small></p><button type="button" onClick={() => showAdjacent(1)} aria-label="Next photo">→</button></div></div></div>}
    <Journey secondary="Admission Info" />
  </>;
}

const events = [
  { day: '15', month: 'Jan 2025', title: 'Open Admissions Day', category: 'Admissions', description: 'Visit our campus, meet our teachers, and learn about all our programs. Registration encouraged.', time: '10:00 AM – 12:00 PM', color: 'cyan' },
  { day: '14', month: 'Feb 2025', title: "Valentine's Craft Day", category: 'Activities', description: 'Children create heartfelt cards and crafts celebrating love, kindness, and friendship.', time: '9:00 AM – 12:00 PM', color: 'slate' },
  { day: '15', month: 'Feb 2025', title: 'Annual Sports Day', category: 'Sports', description: 'Fun-filled athletic events, races, and games celebrating our young champions and spirited learners.', time: '9:00 AM – 2:00 PM', color: 'steel' },
  { day: '05', month: 'Mar 2025', title: 'Spring Arts Festival', category: 'Cultural', description: 'Art exhibitions, cultural performances, and Montessori showcases for the whole family to enjoy.', time: '10:00 AM – 4:00 PM', color: 'charcoal' },
  { day: '20', month: 'Mar 2025', title: 'Parent-Teacher Meeting', category: 'Meeting', description: "Individual progress discussions with your child's teacher. Appointment booking is required.", time: '8:30 AM – 5:00 PM', color: 'electric' },
  { day: '22', month: 'Apr 2025', title: 'Earth Day Celebration', category: 'Outdoor', description: 'Nature walks, tree-planting, and eco-art activities celebrating our beautiful Himalayan environment.', time: '9:00 AM – 1:00 PM', color: 'royal' },
];

function EventsPage() {
  return <><PageBanner title="Events & Activities" description="Stay up to date with all the exciting events, celebrations, and activities happening throughout the year." />
    <section className="events-section"><div className="events-list">{events.map(event => <article className="event-card" key={event.title}><div className={`event-date ${event.color}`}><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-copy"><div className="event-title-line"><h2>{event.title}</h2><span className={`event-tag ${event.category.toLowerCase()}`}>{event.category}</span></div><p>{event.description}</p><small><Icon name="clock" size={15}/> {event.time}</small></div></article>)}</div></section>
    <Journey />
  </>;
}

const posts = [
  { image: 'blog-montessori.png', tag: 'Montessori', date: 'Dec 10, 2024', title: '5 Ways Montessori Education Benefits Your Child', excerpt: 'Discover how the Montessori method builds independence, creativity, and a deep love of learning from the very earliest years of life.', color: 'blue' },
  { image: 'blog-parenting.jpg', tag: 'Parenting', date: 'Nov 28, 2024', title: "Supporting Your Child's Learning at Home", excerpt: 'Simple, effective strategies for Montessori-inspired activities that complement school learning and strengthen family bonds.', color: 'green' },
  { image: 'blog-outdoor.jpg', tag: 'Activities', date: 'Nov 15, 2024', title: 'The Importance of Outdoor Play in Early Childhood', excerpt: 'Research shows outdoor play is essential for cognitive, physical, and emotional development. Here is how we bring it to life every day.', color: 'yellow' },
  { image: 'blog-school-life.jpg', tag: 'School Life', date: 'Oct 30, 2024', title: 'Annual Day 2024: A Celebration of Young Talent', excerpt: "Our Annual Day was a spectacular showcase of students' creativity, confidence, and love for the performing arts in Pokhara.", color: 'orange' },
  { image: 'blog-cultural.jpg', tag: 'Cultural', date: 'Oct 14, 2024', title: 'Holi Festival: Colors, Joy & Community', excerpt: 'Our annual Holi celebration brought together students, teachers, and parents in a vibrant explosion of color and laughter.', color: 'purple' },
  { image: 'blog-admissions.png', tag: 'Admissions', date: 'Oct 1, 2024', title: "What to Expect in Your Child's First Week", excerpt: 'Transition tips and what the first week at Early Childhood Education Centre looks like — for both excited children and their parents.', color: 'teal' },
];

function BlogPage() {
  const [selected, setSelected] = useState<(typeof posts)[number] | null>(null);
  return <><PageBanner title="Blog & Insights" description="Thoughtful articles, expert tips, and heartwarming stories from our Montessori educators and child development team." />
    <section className="blog-section"><div className="container blog-grid">{posts.map(post => <article className="blog-card" key={post.title}>
      <div className="blog-image"><img src={asset(post.image)} alt=""/><span className={`post-tag ${post.color}`}>{post.tag}</span></div>
      <div className="blog-content"><small><Icon name="clock" size={15}/> {post.date}</small><h2>{post.title}</h2><p>{post.excerpt}</p><button type="button" className="read-link" onClick={() => setSelected(post)}>Read Article <Icon name="arrow" size={17}/></button></div>
    </article>)}</div></section>
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><article role="dialog" aria-modal="true" aria-label={selected.title} className="article-dialog" onClick={e => e.stopPropagation()}><button type="button" className="modal-close" aria-label="Close article" onClick={() => setSelected(null)}><Icon name="close"/></button><img src={asset(selected.image)} alt=""/><div><small>{selected.tag} · {selected.date}</small><h2>{selected.title}</h2><p>{selected.excerpt}</p><p>Learn more about our approach by speaking with our Montessori educators or arranging a visit to the school.</p><SiteLink to="/contact?reason=School%20visit#message" className="button button-blue" onClick={() => setSelected(null)}>Visit our school</SiteLink></div></article></div>}
    <Journey />
  </>;
}

function ContactPage() {
  const [notice, setNotice] = useState('');
  const queryReason = new URLSearchParams(window.location.search).get('reason');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') || '');
    const phone = String(values.get('phone') || '');
    const email = String(values.get('email') || '');
    const message = String(values.get('message') || '');
    const subject = queryReason || `Website inquiry from ${name}`;
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
    setNotice('Your email app will open with the message. Please send it there to finish.');
    window.location.href = `mailto:mail@earlychildhood.edu.np?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return <><PageBanner title="Contact Us" description="We would love to hear from you. Reach out to our team anytime — we are here to help your family." />
    <section className="contact-section"><div className="container"><div className="contact-heading"><span className="eyebrow">Get in Touch</span><h2>We Would Love to Hear from You</h2><p>Visit us at Tulsi Marg, Ranipauwa, Pokhara — or reach out anytime and we will<br className="desktop-only"/> respond promptly.</p></div>
      <div className="contact-grid"><div className="contact-details"><img className="contact-school" src={asset('school-campus.jpg')} alt="Early Childhood Montessori campus"/>
        <div className="contact-info-card"><span className="info-icon address"><Icon name="pin"/></span><div><h3>Address</h3><p>11 Tulsi Marg (Tulsimarga), Ranipauwa<br/>Pokhara-11, Gandaki Province 33700, Nepal</p><small>Plus Code: 6XCW+HXG Pokhara</small></div></div>
        <div className="contact-info-card"><span className="info-icon phone"><Icon name="phone"/></span><div><h3>Phone</h3><p><a href={schoolDetails.phoneLink}>{schoolDetails.phone}</a></p><small>Call us {schoolDetails.workingDays}, {schoolDetails.workingHours}</small></div></div>
        <div className="contact-info-card"><span className="info-icon email"><Icon name="mail"/></span><div><h3>Email</h3><p><a href="mailto:mail@earlychildhood.edu.np">mail@earlychildhood.edu.np</a></p><small><a href="mailto:ececmontessori@gmail.com">ececmontessori@gmail.com</a></small></div></div>
        <div className="contact-info-card"><span className="info-icon hours"><Icon name="clock"/></span><div><h3>Working Hours</h3><p>{schoolDetails.workingDays}: {schoolDetails.workingHours}</p><small>Saturday &amp; Sunday: Closed</small></div></div>
        <div className="map-embed"><iframe title="Map showing Early Childhood Montessori School in Ranipauwa, Pokhara" src="https://www.google.com/maps?q=28.2223921%2C83.9922149&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
        <a className="map-button" href={schoolMap} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={17}/> Open in Google Maps — Early Childhood Montessori School</a>
      </div><div className="contact-form-panel" id="message"><h3>Send Us a Message</h3><p>We typically reply within one business day.</p>
        <form onSubmit={submit}><div className="input-row"><label>Full Name<input name="name" required placeholder="Your full name" autoComplete="name"/></label><label>Phone Number<input name="phone" type="tel" required placeholder="+977-98XXXXXXXX" autoComplete="tel"/></label></div>
          <label>Email Address<input name="email" required type="email" placeholder="your@email.com" autoComplete="email"/></label>
          <label>Message<textarea name="message" required rows={4} placeholder="Tell us about your child and what you would like to know..."/></label>
          <button className="send-button" type="submit">Send Message <Icon name="send" size={18}/></button>
          {notice && <p role="status" className="form-notice">{notice}</p>}
        </form><small className="email-direct">Or email us directly at <a href="mailto:mail@earlychildhood.edu.np">mail@earlychildhood.edu.np</a></small>
      </div></div>
    </div></section><Journey />
  </>;
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname.replace(/\/$/, '') || '/');
  useSiteMotion(pathname);
  useEffect(() => {
    const update = () => setPathname(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', update);
    if (window.location.hash) window.setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView(), 120);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const page: Record<string, ReactNode> = {
    '/': <HomePage />, '/about': <AboutPage />, '/programs': <ProgramsPage />,
    '/admissions': <AdmissionsPage />, '/enroll': <EnrollmentPage />, '/team': <TeamPage />, '/gallery': <GalleryPage />,
    '/events': <EventsPage />, '/blog': <BlogPage />, '/contact': <ContactPage />,
  };
  return <><div className="reading-progress" aria-hidden="true"><span /></div><Header pathname={pathname}/><main className="page-content" key={pathname}>{page[pathname] || <section className="not-found"><h1>Page not found</h1><SiteLink to="/" className="button button-blue">Return home</SiteLink></section>}</main><Partners /><Footer /></>;
}

export default App;
