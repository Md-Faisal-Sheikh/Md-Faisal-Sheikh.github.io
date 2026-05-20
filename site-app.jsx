const data = window.SITE_DATA;

function App() {
  const featured = data.projects.filter((project) => data.featuredProjects.includes(project.name));
  const originalProjects = data.projects.filter((project) => project.type === "Original");
  const forkedProjects = data.projects.filter((project) => project.type === "Fork");

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <section className="container stats-grid" aria-label="Profile stats">
        {data.stats.map((stat) => (
          <Card className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Card>
        ))}
      </section>
      <Section id="about" eyebrow="Profile" title="About">
        <div className="about-grid">
          <Card className="about-copy">
            {data.profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Card>
          <Card className="focus-panel">
            <h3>Focus Areas</h3>
            <div className="badge-list">
              {data.focusAreas.map((item) => <Badge key={item}>{item}</Badge>)}
            </div>
          </Card>
        </div>
      </Section>
      <Section id="featured" eyebrow="Selected work" title="Featured Projects">
        <ProjectGrid projects={featured} featured />
      </Section>
      <Section id="skills" eyebrow="Technical stack" title="Skills">
        <div className="skills-grid">
          {data.skills.map((group) => (
            <Card className="skill-card" key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
      <Section id="experience" eyebrow="Background" title="Experience">
        <Card className="timeline">
          {data.experience.map((item) => (
            <article className="timeline-row" key={`${item.role}-${item.org}`}>
              <Badge variant="outline">{item.period}</Badge>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-org">{item.org}</p>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </Card>
      </Section>
      <Section id="achievements" eyebrow="Proof of work" title="Achievements">
        <div className="evidence-grid">
          {data.achievements.map((item) => (
            <Card className="evidence-card" key={item.title}>
              <Badge>{item.meta}</Badge>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section id="certificates" eyebrow="Credentials" title="Certificates & Training">
        <div className="certificate-list">
          {data.certificates.map((item) => (
            <Card className="certificate-card" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <div className="certificate-meta">
                <span>{item.issuer}</span>
                <strong>{item.date}</strong>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section id="projects" eyebrow="Repository index" title="All GitHub Projects">
        <div className="project-summary">
          <Badge variant="secondary">{originalProjects.length} original repositories</Badge>
          <Badge variant="secondary">{forkedProjects.length} forked or contributed repositories</Badge>
          <Badge variant="secondary">{data.projects.length} total public repositories</Badge>
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
    <section className="container hero-section" id="top">
      <div className="hero-copy">
        <Badge>{data.profile.status}</Badge>
        <h1>{data.profile.name}</h1>
        <p className="hero-role">{data.profile.role}</p>
        <p className="hero-headline">{data.profile.headline}</p>
        <div className="hero-meta">
          <Badge variant="secondary">{data.profile.company}</Badge>
          <Badge variant="secondary">{data.profile.location}</Badge>
        </div>
        <div className="hero-actions">
          <Button href="https://github.com/Md-Faisal-Sheikh" primary>View GitHub</Button>
          <Button href="https://www.linkedin.com/in/md-faisal-sheikh-5a9b46265">View LinkedIn</Button>
        </div>
      </div>
      <Card className="profile-card">
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
      </Card>
    </section>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section className="container content-section" id={id}>
      <div className="section-heading">
        <span>{eyebrow}</span>
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
        <Card className="project-card" key={project.name}>
          <div className="project-topline">
            <Badge variant={project.type === "Original" ? "default" : "outline"}>{project.type}</Badge>
            <span>{project.updated}</span>
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-tags">
            <Badge variant="secondary">{project.language || "Repository"}</Badge>
          </div>
          <div className="project-actions">
            <Button href={project.url} primary>Repository</Button>
            {project.live && <Button href={project.live}>Live</Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <section className="container contact-section" id="contact">
      <div>
        <Badge>Contact</Badge>
        <h2>Let's connect.</h2>
        <p>For collaboration, internships, research, AI, or software opportunities, reach out through GitHub or LinkedIn.</p>
      </div>
      <div className="contact-links">
        {data.profile.links.map((link, index) => (
          <Button href={link.url} primary={index === 0} key={link.label}>{link.label}</Button>
        ))}
      </div>
    </section>
  );
}

function Card({ className = "", children }) {
  return <article className={`card ${className}`}>{children}</article>;
}

function Badge({ variant = "default", children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

function Button({ href, primary = false, children }) {
  return <a className={primary ? "button button-primary" : "button button-outline"} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
