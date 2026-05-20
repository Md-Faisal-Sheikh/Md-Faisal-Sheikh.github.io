const data = window.PORTFOLIO;

function App() {
  const featured = data.projects.filter((project) => data.featuredProjects.includes(project.name));
  const originalProjects = data.projects.filter((project) => project.type === "Original");
  const forkedProjects = data.projects.filter((project) => project.type === "Fork");

  return (
    <main className="site-shell">
      <Header />
      <Hero />
      <section className="stats-band" aria-label="Profile stats">
        {data.stats.map((stat) => (
          <article className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>
      <Section id="about" eyebrow="Profile" title="About">
        <div className="about-grid">
          <div className="about-copy">
            {data.profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="focus-panel">
            <h3>Focus Areas</h3>
            <div className="chip-list">
              {data.focusAreas.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </Section>
      <Section id="featured" eyebrow="Selected work" title="Featured Projects">
        <ProjectGrid projects={featured} featured />
      </Section>
      <Section id="skills" eyebrow="Technical stack" title="Skills">
        <div className="skills-grid">
          {data.skills.map((group) => (
            <article className="skill-card" key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <Section id="experience" eyebrow="Background" title="Experience">
        <div className="timeline">
          {data.experience.map((item) => (
            <article className="timeline-row" key={`${item.role}-${item.org}`}>
              <span>{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-org">{item.org}</p>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section id="achievements" eyebrow="Proof of work" title="Achievements">
        <div className="evidence-grid">
          {data.achievements.map((item) => (
            <article className="evidence-card" key={item.title}>
              <span>{item.meta}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="certificates" eyebrow="Credentials" title="Certificates & Training">
        <div className="certificate-list">
          {data.certificates.map((item) => (
            <article className="certificate-card" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <div className="certificate-meta">
                <span>{item.issuer}</span>
                <strong>{item.date}</strong>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section id="projects" eyebrow="Repository index" title="All GitHub Projects">
        <div className="project-summary">
          <span>{originalProjects.length} original repositories</span>
          <span>{forkedProjects.length} forked or contributed repositories</span>
          <span>{data.projects.length} total public repositories</span>
        </div>
        <ProjectGrid projects={data.projects} />
      </Section>
      <Contact />
    </main>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="brand-lockup">
        <img src={data.profile.avatar} alt="" />
        <span>{data.profile.shortName}</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#about">About</a>
        <a href="#featured">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#achievements">Achievements</a>
        <a href="#certificates">Certificates</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <span className="eyebrow">{data.profile.status}</span>
        <h1>{data.profile.name}</h1>
        <p className="hero-role">{data.profile.role}</p>
        <p className="hero-headline">{data.profile.headline}</p>
        <div className="hero-meta">
          <span>{data.profile.company}</span>
          <span>{data.profile.location}</span>
        </div>
        <div className="hero-actions">
          <a className="btn primary" href="https://github.com/Md-Faisal-Sheikh" target="_blank" rel="noreferrer">View GitHub</a>
          <a className="btn" href="https://www.linkedin.com/in/md-faisal-sheikh-5a9b46265" target="_blank" rel="noreferrer">View LinkedIn</a>
        </div>
      </div>
      <aside className="profile-card" aria-label="Profile card">
        <img src={data.profile.avatar} alt="Md. Faisal Sheikh" />
        <div>
          <h2>{data.profile.shortName}</h2>
          <p>{data.profile.role}</p>
        </div>
        <dl>
          <div><dt>Company</dt><dd>{data.profile.company}</dd></div>
          <div><dt>Location</dt><dd>{data.profile.location}</dd></div>
          <div><dt>GitHub</dt><dd>@Md-Faisal-Sheikh</dd></div>
        </dl>
      </aside>
    </section>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ProjectGrid({ projects, featured = false }) {
  return (
    <div className={featured ? "project-grid featured-grid" : "project-grid"}>
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          <div className="project-topline">
            <span>{project.type}</span>
            <span>{project.updated}</span>
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-tags">
            <span>{project.language || "Repository"}</span>
          </div>
          <div className="project-actions">
            <a href={project.url} target="_blank" rel="noreferrer">Repository</a>
            {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live</a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div>
        <span className="eyebrow">Contact</span>
        <h2>Let's connect.</h2>
        <p>For collaboration, internships, research, AI, or software opportunities, reach out through GitHub or LinkedIn.</p>
      </div>
      <div className="contact-links">
        {data.profile.links.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.label}>{link.label}</a>
        ))}
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
