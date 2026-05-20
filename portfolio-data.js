// Portfolio content — placeholders the user will replace later.
window.PORTFOLIO = {
  hero: {
    name: "Ada Renaud",
    role: "Researcher · Designer",
    tagline: "Building instruments at the intersection of machine learning, interface design, and printed matter.",
    location: "Brooklyn, NY · CET / EST",
  },
  about: {
    paragraphs: [
      "I'm an independent researcher and designer working on tools that make systems legible — for engineers, for curious readers, for the people who have to live inside the products we ship.",
      "Previously: Visiting Researcher at the Institute for Computational Aesthetics; design lead on three shipped products; co-author on six peer-reviewed papers across HCI, generative systems, and information design.",
      "I write about typography, latent space, and the strange middle ground between research and craft. Available for select consulting in 2026.",
    ],
  },
  skills: [
    { group: "Research", items: ["Generative models", "HCI methods", "Information theory", "Visual perception"] },
    { group: "Craft",    items: ["Type design", "Editorial layout", "Motion", "WebGL / shaders"] },
    { group: "Stack",    items: ["TypeScript", "Python · PyTorch", "GLSL", "Rust", "Figma / Cavalry"] },
  ],
  resume: [
    { year: "2024 — present", role: "Independent Researcher", org: "Self-directed" },
    { year: "2022 — 2024",    role: "Visiting Researcher",    org: "Institute for Computational Aesthetics" },
    { year: "2020 — 2022",    role: "Senior Design Lead",     org: "Foreground Labs" },
    { year: "2018 — 2020",    role: "Interaction Designer",   org: "Northwind Studio" },
    { year: "2016 — 2018",    role: "MS, Computational Design", org: "Carnegie Mellon" },
  ],
  writing: [
    { date: "Mar 2026", title: "Notes on latent typography",        kind: "Essay" },
    { date: "Jan 2026", title: "What an interface owes a reader",   kind: "Essay" },
    { date: "Nov 2025", title: "Six failures of the dashboard",     kind: "Critique" },
    { date: "Aug 2025", title: "Reading Tufte against the grain",   kind: "Review" },
  ],
  contact: {
    email: "ada@renaud.studio",
    socials: [
      { label: "GitHub",   handle: "@renaud" },
      { label: "Are.na",   handle: "ada-renaud" },
      { label: "Bluesky",  handle: "@ada.renaud.studio" },
      { label: "Email",    handle: "ada@renaud.studio" },
    ],
  },
  // Twelve features, mixing built projects with research papers.
  works: [
    { id: "w01", code: "P / 01", kind: "project",  title: "Latent Field",          year: "2026", tag: "Generative · Type",      blurb: "A live typesetting system that interpolates between weight, contrast, and serif using a tiny diffusion model running on-device." },
    { id: "w02", code: "R / 01", kind: "research", title: "Thresholds",            year: "2025", tag: "Paper · Diffusion",      blurb: "Sparse-prior conditioning for low-data domains. CHI '25. Co-authored with the Institute for Computational Aesthetics." },
    { id: "w03", code: "P / 02", kind: "project",  title: "Atrium",                year: "2025", tag: "Spatial · UI",           blurb: "A spatial computing shell built around the metaphor of an interior — rooms, doors, and what you bring with you." },
    { id: "w04", code: "R / 02", kind: "research", title: "Neural Topographies",   year: "2025", tag: "Paper · Embeddings",     blurb: "Reading the geography of high-dimensional spaces through cartographic projection. UIST '25." },
    { id: "w05", code: "P / 03", kind: "project",  title: "Refraction",            year: "2024", tag: "Tool · WebGL",           blurb: "An open-source shader editor built for designers, not graphics programmers. Used by ~3,000 studios in its first year." },
    { id: "w06", code: "R / 03", kind: "research", title: "Murmur",                year: "2024", tag: "Paper · Crowds",         blurb: "Soft-attention models for pedestrian movement, trained on a decade of station footage. SIGGRAPH '24." },
    { id: "w07", code: "P / 04", kind: "project",  title: "Foundry",               year: "2024", tag: "Tool · Type",            blurb: "A type-design environment that treats glyphs as parametric programs. Won the TDC Tools award in 2024." },
    { id: "w08", code: "R / 04", kind: "research", title: "Solenoid",              year: "2023", tag: "Paper · Audio",          blurb: "Differentiable physical modelling of brass instruments in real-time. NIME '23, best paper runner-up." },
    { id: "w09", code: "P / 05", kind: "project",  title: "Halftone",              year: "2023", tag: "Product · Photo",        blurb: "A film-emulation app that grades images using printer dot models rather than LUTs. 14k MAU." },
    { id: "w10", code: "R / 05", kind: "research", title: "Periphery",             year: "2022", tag: "Paper · Attention",      blurb: "Re-deriving attention from saccade statistics; an HCI-grounded reading of transformers. CHI '23." },
    { id: "w11", code: "P / 06", kind: "project",  title: "Codex",                 year: "2022", tag: "Project · Knowledge",    blurb: "An open knowledge graph for design history. Continuously curated with a small team of editors." },
    { id: "w12", code: "R / 06", kind: "research", title: "Aperture",              year: "2021", tag: "Paper · Optics",         blurb: "Physically-based simulation of camera optics for synthetic data generation. CVPR '22." },
  ],
};
