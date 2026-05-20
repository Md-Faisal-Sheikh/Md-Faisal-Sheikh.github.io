// Three.js portfolio scene.
// Exposes window.PortfolioScene with three layouts (orbit / helix / arc),
// cursor parallax, focus state, and a layout-switch transition.

(function () {
  const TWO_PI = Math.PI * 2;

  // ── text texture ──────────────────────────────────────────────────────
  function makeCardTexture(work, opts) {
    const W = 1024, H = 640;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const accent = opts.accent || "#7BF6FF";
    const accent2 = opts.accent2 || "#FF4FD8";
    const isResearch = work.kind === "research";

    // background — dark glass
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "rgba(14,16,24,0.96)");
    bg.addColorStop(1, "rgba(6,7,12,0.98)");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    // hairline grid
    g.strokeStyle = "rgba(255,255,255,0.04)";
    g.lineWidth = 1;
    for (let x = 0; x <= W; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = 0; y <= H; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }

    // accent edge — top-left corner brackets
    const c1 = isResearch ? accent2 : accent;
    g.strokeStyle = c1;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(36, 96); g.lineTo(36, 36); g.lineTo(120, 36);
    g.moveTo(W - 120, 36); g.lineTo(W - 36, 36); g.lineTo(W - 36, 96);
    g.moveTo(36, H - 96); g.lineTo(36, H - 36); g.lineTo(120, H - 36);
    g.moveTo(W - 120, H - 36); g.lineTo(W - 36, H - 36); g.lineTo(W - 36, H - 96);
    g.stroke();

    // code chip
    g.fillStyle = c1;
    g.font = "500 28px ui-monospace, 'JetBrains Mono', Menlo, monospace";
    g.fillText(work.code, 64, 92);

    // tag
    g.fillStyle = "rgba(245,245,250,0.55)";
    g.font = "400 26px ui-monospace, 'JetBrains Mono', Menlo, monospace";
    g.textAlign = "right";
    g.fillText(work.tag.toUpperCase(), W - 64, 92);
    g.textAlign = "left";

    // title — editorial serif
    g.fillStyle = "#F5F5FA";
    g.font = "italic 600 132px 'Playfair Display', 'Cormorant Garamond', Georgia, serif";
    // wrap if too long
    const words = work.title.split(" ");
    let line = "", lines = [];
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (g.measureText(test).width > W - 128 && line) { lines.push(line); line = w; }
      else line = test;
    }
    lines.push(line);
    let ty = H / 2 + 12;
    if (lines.length === 1) ty += 0;
    if (lines.length === 2) ty -= 56;
    for (const l of lines) { g.fillText(l, 64, ty); ty += 124; }

    // year
    g.fillStyle = "rgba(245,245,250,0.5)";
    g.font = "400 26px ui-monospace, 'JetBrains Mono', Menlo, monospace";
    g.fillText(work.year, 64, H - 64);

    // kind
    g.textAlign = "right";
    g.fillStyle = c1;
    g.fillText(isResearch ? "RESEARCH PAPER" : "PROJECT", W - 64, H - 64);
    g.textAlign = "left";

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // ── card mesh ─────────────────────────────────────────────────────────
  function makeCard(work, opts) {
    const w = 1.6, h = 1.0;
    const tex = makeCardTexture(work, opts);
    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false,
    });
    const geo = new THREE.PlaneGeometry(w, h);
    const card = new THREE.Mesh(geo, mat);

    // neon edge — ring outline using thin frame
    const frame = new THREE.Group();
    const edgeColor = work.kind === "research"
      ? new THREE.Color(opts.accent2)
      : new THREE.Color(opts.accent);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: edgeColor, transparent: true, opacity: 0.85,
    });
    const t = 0.014;
    const top = new THREE.Mesh(new THREE.PlaneGeometry(w + t * 2, t), edgeMat);
    top.position.y = h / 2;
    const bot = top.clone(); bot.position.y = -h / 2;
    const lef = new THREE.Mesh(new THREE.PlaneGeometry(t, h + t * 2), edgeMat);
    lef.position.x = -w / 2;
    const rig = lef.clone(); rig.position.x = w / 2;
    frame.add(top, bot, lef, rig);

    // outer halo — soft bloom plate behind
    const haloMat = new THREE.MeshBasicMaterial({
      color: edgeColor, transparent: true, opacity: 0.18, depthWrite: false,
    });
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.45, h + 0.45), haloMat);
    halo.position.z = -0.02;

    const group = new THREE.Group();
    group.add(halo);
    group.add(card);
    group.add(frame);
    group.userData = { work, edgeColor, baseMat: mat, frameMat: edgeMat, haloMat };
    return group;
  }

  // ── starfield ─────────────────────────────────────────────────────────
  function makeStarfield() {
    const N = 1400;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 30 + Math.random() * 40;
      const theta = Math.random() * TWO_PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      colors[i * 3]     = 0.6 + t * 0.4;
      colors[i * 3 + 1] = 0.7 + t * 0.3;
      colors[i * 3 + 2] = 0.95;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, transparent: true, opacity: 0.7,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }

  // ── grid floor (used by arc layout) ───────────────────────────────────
  function makeGrid(accent) {
    const g = new THREE.GridHelper(60, 60, accent, accent);
    g.material.transparent = true;
    g.material.opacity = 0.18;
    g.position.y = -2.4;
    return g;
  }

  // ── layouts ───────────────────────────────────────────────────────────
  function layoutOrbit(works) {
    const out = [];
    const N = works.length;
    const R = 4.6;
    // fibonacci sphere
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const p = new THREE.Vector3(x * R, y * R * 0.9, z * R);
      const lookAt = new THREE.Vector3(0, 0, 0);
      out.push({ pos: p, lookAt });
    }
    return out;
  }
  function layoutHelix(works) {
    const out = [];
    const N = works.length;
    const turns = 2.4;
    const R = 3.4;
    const H = 9;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const a = t * turns * TWO_PI;
      const p = new THREE.Vector3(
        Math.cos(a) * R,
        (t - 0.5) * H,
        Math.sin(a) * R,
      );
      const lookAt = new THREE.Vector3(0, p.y, 0);
      out.push({ pos: p, lookAt });
    }
    return out;
  }
  function layoutArc(works) {
    // curved gallery wall in front of camera, two rows
    const out = [];
    const N = works.length;
    const cols = 6;
    const rows = Math.ceil(N / cols);
    const R = 7.5;
    const arcSpan = Math.PI * 0.85;
    for (let i = 0; i < N; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const t = cols === 1 ? 0.5 : col / (cols - 1);
      const a = -arcSpan / 2 + t * arcSpan;
      const y = (rows === 1) ? 0 : (row - (rows - 1) / 2) * -1.4;
      const p = new THREE.Vector3(
        Math.sin(a) * R,
        y,
        -Math.cos(a) * R + 1.5,
      );
      // orient toward camera at origin
      const lookAt = new THREE.Vector3(0, y * 0.4, 2.5);
      out.push({ pos: p, lookAt });
    }
    return out;
  }
  const LAYOUTS = { orbit: layoutOrbit, helix: layoutHelix, arc: layoutArc };

  // ── scene class ───────────────────────────────────────────────────────
  class PortfolioScene {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.opts = Object.assign({
        accent: "#7BF6FF",
        accent2: "#FF4FD8",
        layout: "orbit",
        intensity: 0.6,   // 0..1 parallax depth
        autoSpin: true,
      }, opts || {});
      this.works = window.PORTFOLIO.works;
      this.focusedId = null;
      this.hoverId = null;
      this.onHover = null;
      this.onSelect = null;
      this._mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this._spin = 0;
      this._init();
    }

    _init() {
      const c = this.canvas;
      const renderer = new THREE.WebGLRenderer({
        canvas: c, antialias: true, alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setClearColor(0x05060A, 1);
      this.renderer = renderer;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05060A, 0.05);
      this.scene = scene;

      const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
      cam.position.set(0, 0, 11);
      cam.lookAt(0, 0, 0);
      this.cam = cam;

      this.world = new THREE.Group();
      scene.add(this.world);

      this.starfield = makeStarfield();
      scene.add(this.starfield);

      this.grid = makeGrid(new THREE.Color(this.opts.accent));
      scene.add(this.grid);

      // build cards
      this.cards = this.works.map((w) => {
        const c = makeCard(w, this.opts);
        this.world.add(c);
        return c;
      });
      // initial layout
      this._targets = LAYOUTS[this.opts.layout](this.works);
      this._currents = this._targets.map((t) => ({
        pos: t.pos.clone(),
        lookAt: t.lookAt.clone(),
      }));
      this.cards.forEach((card, i) => {
        card.position.copy(this._currents[i].pos);
        card.lookAt(this._currents[i].lookAt);
      });

      // raycaster
      this.raycaster = new THREE.Raycaster();
      this._pointer = new THREE.Vector2();

      this._bindEvents();
      this._resize();
      this._lastT = performance.now();
      this._loop = this._loop.bind(this);
      requestAnimationFrame(this._loop);
    }

    _bindEvents() {
      window.addEventListener("resize", () => this._resize());
      const c = this.canvas;
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        this._mouse.tx = nx;
        this._mouse.ty = ny;
        this._pointer.x = nx;
        this._pointer.y = ny;
        this._pickHover();
      });
      c.addEventListener("pointerdown", (e) => {
        if (this.hoverId && this.onSelect) this.onSelect(this.hoverId);
      });
      c.addEventListener("pointerleave", () => {
        if (this.hoverId) {
          this.hoverId = null;
          if (this.onHover) this.onHover(null);
        }
      });
    }

    _pickHover() {
      this.raycaster.setFromCamera(this._pointer, this.cam);
      const hits = this.raycaster.intersectObjects(this.cards.map(c => c.children[1]), false);
      let id = null;
      if (hits.length) {
        const card = hits[0].object.parent;
        id = card.userData.work.id;
      }
      if (id !== this.hoverId) {
        this.hoverId = id;
        document.body.style.cursor = id ? "pointer" : "";
        if (this.onHover) this.onHover(id);
      }
    }

    _resize() {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.renderer.setSize(w, h, false);
      this.cam.aspect = w / Math.max(1, h);
      this.cam.updateProjectionMatrix();
    }

    setLayout(name) {
      if (!LAYOUTS[name]) return;
      this.opts.layout = name;
      this._targets = LAYOUTS[name](this.works);
    }
    setIntensity(v) { this.opts.intensity = Math.max(0, Math.min(1.4, v)); }
    setFocus(id) { this.focusedId = id; }

    _loop(now) {
      const dt = Math.min(0.05, (now - this._lastT) / 1000);
      this._lastT = now;

      // ease pointer
      this._mouse.x += (this._mouse.tx - this._mouse.x) * 0.08;
      this._mouse.y += (this._mouse.ty - this._mouse.y) * 0.08;

      // gentle auto-spin
      if (this.opts.autoSpin && !this.focusedId) this._spin += dt * 0.06;

      // ease cards toward layout targets
      this.cards.forEach((card, i) => {
        const target = this._targets[i];
        const cur = this._currents[i];
        cur.pos.lerp(target.pos, 0.06);
        cur.lookAt.lerp(target.lookAt, 0.06);

        // base layout transform (with auto-spin around Y)
        const base = cur.pos.clone();
        const cs = Math.cos(this._spin), sn = Math.sin(this._spin);
        const bx = base.x * cs - base.z * sn;
        const bz = base.x * sn + base.z * cs;

        // focus: pull card toward camera if it's the focused one,
        // push others back & dim
        let tx = bx, ty = base.y, tz = bz;
        let opacity = 1, haloOp = 0.18;
        if (this.focusedId) {
          const isFocus = card.userData.work.id === this.focusedId;
          if (isFocus) {
            // bring forward, center
            const fwd = new THREE.Vector3(0, 0, 6);
            tx = fwd.x; ty = fwd.y; tz = fwd.z;
            opacity = 1; haloOp = 0.45;
          } else {
            tx *= 1.4; tz *= 1.4; ty *= 1.1;
            opacity = 0.18; haloOp = 0.05;
          }
        } else if (this.hoverId === card.userData.work.id) {
          // small pop on hover
          opacity = 1; haloOp = 0.42;
        } else {
          opacity = 0.93; haloOp = 0.18;
        }

        // ease toward final transform
        card.position.x += (tx - card.position.x) * 0.1;
        card.position.y += (ty - card.position.y) * 0.1;
        card.position.z += (tz - card.position.z) * 0.1;
        // look at center (or camera if focused)
        const lookTarget = this.focusedId === card.userData.work.id
          ? this.cam.position
          : new THREE.Vector3(
              (cur.lookAt.x) * cs - (cur.lookAt.z) * sn,
              cur.lookAt.y,
              (cur.lookAt.x) * sn + (cur.lookAt.z) * cs,
            );
        card.lookAt(lookTarget);

        // material opacity
        card.userData.baseMat.opacity = lerp(card.userData.baseMat.opacity ?? 1, opacity, 0.1);
        card.userData.baseMat.transparent = true;
        card.userData.frameMat.opacity = lerp(card.userData.frameMat.opacity, opacity, 0.1);
        card.userData.haloMat.opacity = lerp(card.userData.haloMat.opacity, haloOp, 0.1);
      });

      // cursor parallax — rotate world slightly
      const k = this.opts.intensity;
      const rx = -this._mouse.y * 0.35 * k;
      const ry =  this._mouse.x * 0.55 * k;
      this.world.rotation.x += (rx - this.world.rotation.x) * 0.06;
      this.world.rotation.y += (ry - this.world.rotation.y) * 0.06;

      // camera dolly when focusing
      const targetZ = this.focusedId ? 9 : 11;
      this.cam.position.z += (targetZ - this.cam.position.z) * 0.05;

      // starfield slow drift
      this.starfield.rotation.y += dt * 0.01;

      // grid intensity follows layout (only show in arc)
      const gridOp = this.opts.layout === "arc" ? 0.22 : 0.0;
      this.grid.material.opacity += (gridOp - this.grid.material.opacity) * 0.06;

      this.renderer.render(this.scene, this.cam);
      requestAnimationFrame(this._loop);
    }
  }
  function lerp(a, b, t) { return a + (b - a) * t; }

  window.PortfolioScene = PortfolioScene;
})();
