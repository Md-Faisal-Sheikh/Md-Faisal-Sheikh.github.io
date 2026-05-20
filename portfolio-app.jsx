// React UI overlay for the portfolio.
// Sidebar nav, hero, project detail panel, section overlays, tweaks panel.

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "orbit",
  "intensity": 0.6,
  "palette": ["#7BF6FF", "#FF4FD8"]
}/*EDITMODE-END*/;

const PALETTES = [
  ["#7BF6FF", "#FF4FD8"],   // cyan + magenta
  ["#A8FF60", "#FF8A3D"],   // acid + amber
  ["#9C8CFF", "#56F0C8"],   // violet + mint
  ["#FFE066", "#FF4D6D"],   // sun + coral
];

const SECTIONS = [
  { key: "work",     label: "Work" },
  { key: "research", label: "Research" },
  { key: "about",    label: "About" },
  { key: "skills",   label: "Skills" },
  { key: "writing",  label: "Writing" },
  { key: "resume",   label: "Resume" },
  { key: "contact",  label: "Contact" },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [hoverId, setHoverId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [overlay, setOverlay] = useState(null); // section key or null
  const [filter, setFilter] = useState("all");  // all | project | research
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  const works = window.PORTFOLIO.works;
  const data = window.PORTFOLIO;

  // boot scene once
  useEffect(() => {
    const s = new window.PortfolioScene(canvasRef.current, {
      accent: t.palette[0],
      accent2: t.palette[1],
      layout: t.layout,
      intensity: t.intensity,
    });
    s.onHover = (id) => setHoverId(id);
    s.onSelect = (id) => setFocusId(id);
    sceneRef.current = s;
    return () => { /* leave running */ };
    // eslint-disable-next-line
  }, []);

  // sync tweaks → scene
  useEffect(() => { sceneRef.current?.setLayout(t.layout); }, [t.layout]);
  useEffect(() => { sceneRef.current?.setIntensity(t.intensity); }, [t.intensity]);
  useEffect(() => { sceneRef.current?.setFocus(focusId); }, [focusId]);

  // filter applies via dimming the work title list, scene shows all
  const filtered = useMemo(() => {
    if (filter === "all") return works;
    return works.filter(w => w.kind === filter);
  }, [filter]);

  const focusedWork = focusId ? works.find(w => w.id === focusId) : null;
  const hoveredWork = hoverId ? works.find(w => w.id === hoverId) : null;

  const accent = t.palette[0];
  const accent2 = t.palette[1];

  return (
    <div className="root" style={{ "--ac": accent, "--ac2": accent2 }}>
      <canvas ref={canvasRef} className="stage"></canvas>

      <div className="vignette"></div>
      <div className="scanlines"></div>

      {/* top bar */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden></span>
          <span className="brand-name">{data.hero.name}</span>
          <span className="brand-sep">·</span>
          <span className="brand-role">{data.hero.role}</span>
        </div>
        <div className="meta">
          <span className="meta-dot"></span>
          Available · 2026
        </div>
      </header>

      {/* left sidebar */}
      <nav className="sidebar">
        <div className="side-label">Index</div>
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.key}>
              <button
                className={"nav-btn" + (overlay === s.key ? " active" : "")}
                onClick={() => {
                  if (s.key === "work" || s.key === "research") {
                    setOverlay(null);
                    setFilter(s.key === "work" ? "project" : "research");
                    setFocusId(null);
                  } else {
                    setOverlay(o => o === s.key ? null : s.key);
                  }
                }}
              >
                <span className="nav-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="nav-lbl">{s.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              className={"nav-btn" + (filter === "all" && !overlay ? " active" : "")}
              onClick={() => { setFilter("all"); setOverlay(null); setFocusId(null); }}
            >
              <span className="nav-num">00</span>
              <span className="nav-lbl">All</span>
            </button>
          </li>
        </ul>
        <div className="side-foot">
          <div className="side-loc">{data.hero.location}</div>
        </div>
      </nav>

      {/* hero copy — bottom-left */}
      {!focusId && !overlay && (
        <div className="hero">
          <div className="hero-eyebrow">— Selected works · {works.length}</div>
          <h1 className="hero-title">
            <span className="ital">Instruments</span> for thinking,<br/>
            <span className="ital">interfaces</span> for reading.
          </h1>
          <p className="hero-sub">{data.hero.tagline}</p>
          <div className="hero-cta">
            <span className="cta-hint">Drag to explore · Click any tile</span>
          </div>
        </div>
      )}

      {/* project list — right side */}
      {!focusId && !overlay && (
        <aside className="works">
          <div className="works-head">
            <span>Catalogue</span>
            <span className="works-count">{filtered.length}/{works.length}</span>
          </div>
          <div className="works-filter">
            <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "project" ? "on" : ""} onClick={() => setFilter("project")}>Projects</button>
            <button className={filter === "research" ? "on" : ""} onClick={() => setFilter("research")}>Research</button>
          </div>
          <ul className="works-list">
            {filtered.map((w) => (
              <li
                key={w.id}
                className={
                  "work-row" +
                  (hoverId === w.id ? " hovered" : "") +
                  (w.kind === "research" ? " research" : "")
                }
                onMouseEnter={() => setHoverId(w.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setFocusId(w.id)}
              >
                <span className="work-code">{w.code}</span>
                <span className="work-title">{w.title}</span>
                <span className="work-tag">{w.tag}</span>
                <span className="work-year">{w.year}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* hover preview chip near cursor area, bottom center */}
      {hoveredWork && !focusId && !overlay && (
        <div className="hover-chip">
          <span className="hc-dot" style={{ background: hoveredWork.kind === "research" ? accent2 : accent }}></span>
          <span className="hc-code">{hoveredWork.code}</span>
          <span className="hc-title">{hoveredWork.title}</span>
        </div>
      )}

      {/* project detail */}
      {focusedWork && (
        <div className="detail">
          <button className="detail-close" onClick={() => setFocusId(null)}>← Back to catalogue</button>
          <div className="detail-grid">
            <div className="detail-meta">
              <div className="dm-code" style={{ color: focusedWork.kind === "research" ? accent2 : accent }}>
                {focusedWork.code}
              </div>
              <div className="dm-kind">{focusedWork.kind === "research" ? "Research paper" : "Project"}</div>
              <div className="dm-year">{focusedWork.year}</div>
              <div className="dm-tag">{focusedWork.tag}</div>
            </div>
            <div className="detail-body">
              <h2 className="detail-title">{focusedWork.title}</h2>
              <p className="detail-blurb">{focusedWork.blurb}</p>
              <div className="detail-cs">
                <div className="cs-label">Case study</div>
                <div className="cs-rows">
                  <div className="cs-row"><span>Role</span><span>Research, design, build</span></div>
                  <div className="cs-row"><span>Duration</span><span>14 weeks · 2 sprints</span></div>
                  <div className="cs-row"><span>Team</span><span>Solo — w/ external review</span></div>
                  <div className="cs-row"><span>Status</span><span>{focusedWork.kind === "research" ? "Published" : "Shipped · Live"}</span></div>
                </div>
                <div className="cs-stub">
                  <div className="cs-stub-bar" style={{ background: focusedWork.kind === "research" ? accent2 : accent }}></div>
                  <div className="cs-stub-text">Full case study · placeholder. Drop in process notes, screens, citations, repo links here.</div>
                </div>
              </div>
              <div className="detail-actions">
                <button className="d-btn primary">{focusedWork.kind === "research" ? "Read paper (PDF)" : "Visit project"}</button>
                <button className="d-btn">Source</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* section overlays */}
      {overlay && (
        <SectionOverlay sectionKey={overlay} onClose={() => setOverlay(null)} accent={accent} accent2={accent2} />
      )}

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Spatial layout" />
        <TweakRadio label="Arrangement" value={t.layout}
          options={["orbit", "helix", "arc"]}
          onChange={(v) => setTweak("layout", v)} />
        <TweakSlider label="3D intensity" value={t.intensity} min={0} max={1.4} step={0.05}
          onChange={(v) => setTweak("intensity", v)} />
        <TweakSection label="Neon palette" />
        <TweakColor label="Pair" value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak("palette", v)} />
        <TweakSection label="Demo" />
        <TweakButton label="Pick random work" onClick={() => {
          const ws = window.PORTFOLIO.works;
          const id = ws[Math.floor(Math.random() * ws.length)].id;
          setFocusId(id);
        }} />
      </TweaksPanel>
    </div>
  );
}

function SectionOverlay({ sectionKey, onClose, accent, accent2 }) {
  const data = window.PORTFOLIO;

  let body;
  if (sectionKey === "about") {
    body = (
      <div className="sec sec-about">
        <h2 className="sec-h">About</h2>
        <div className="sec-prose">
          {data.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    );
  } else if (sectionKey === "skills") {
    body = (
      <div className="sec sec-skills">
        <h2 className="sec-h">Stack &amp; craft</h2>
        <div className="skills-grid">
          {data.skills.map((g) => (
            <div key={g.group} className="skill-col">
              <div className="skill-head" style={{ color: accent }}>{g.group}</div>
              <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (sectionKey === "writing") {
    body = (
      <div className="sec sec-writing">
        <h2 className="sec-h">Writing</h2>
        <ul className="write-list">
          {data.writing.map((w, i) => (
            <li key={i} className="write-row">
              <span className="w-date">{w.date}</span>
              <span className="w-title">{w.title}</span>
              <span className="w-kind" style={{ color: accent2 }}>{w.kind}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (sectionKey === "resume") {
    body = (
      <div className="sec sec-resume">
        <h2 className="sec-h">Trajectory</h2>
        <ul className="res-list">
          {data.resume.map((r, i) => (
            <li key={i} className="res-row">
              <span className="r-year">{r.year}</span>
              <span className="r-role">{r.role}</span>
              <span className="r-org">{r.org}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (sectionKey === "contact") {
    body = (
      <div className="sec sec-contact">
        <h2 className="sec-h">Get in touch</h2>
        <a className="big-mail" href={`mailto:${data.contact.email}`} style={{ color: accent }}>
          {data.contact.email}
        </a>
        <ul className="contact-list">
          {data.contact.socials.map((s) => (
            <li key={s.label}>
              <span className="cl-label">{s.label}</span>
              <span className="cl-handle">{s.handle}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="overlay">
      <button className="overlay-close" onClick={onClose}>← Back</button>
      <div className="overlay-inner">{body}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
