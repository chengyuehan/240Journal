const { useState, useRef, useEffect, useCallback, useMemo } = React;

// ============================================================
// DATA — factual model names + approximate public output speeds (tok/s)
// and output prices ($/M tokens). Visual emblems are ORIGINAL designs.
// ============================================================
const COMPANIES = [
  {
    id: 'openai',
    name: 'OpenAI',
    color: '#1aa37a',
    colorDark: '#0c6a4d',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#1aa37a" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="7" fill="none" stroke="#1aa37a" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="2.2" fill="#1aa37a" />
      </svg>
    ),
    models: [
      { name: 'GPT-5',       speed: 105, price: 10.00 },
      { name: 'GPT-5 mini',  speed: 170, price: 2.00 },
      { name: 'GPT-4o',      speed: 85,  price: 10.00 },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    color: '#d97757',
    colorDark: '#a14d2f',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <polygon points="18,4 30,12 30,24 18,32 6,24 6,12" fill="none" stroke="#d97757" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="18,11 24,15 24,21 18,25 12,21 12,15" fill="#d97757" />
      </svg>
    ),
    models: [
      { name: 'Claude Opus 4.5',   speed: 35,  price: 75.00 },
      { name: 'Claude Sonnet 4.5', speed: 70,  price: 15.00 },
      { name: 'Claude Haiku 4.5',  speed: 135, price: 1.25 },
    ],
  },
  {
    id: 'google',
    name: 'DeepMind',
    color: '#4a8df0',
    colorDark: '#2a5fb0',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <polygon points="6,30 18,6 30,30" fill="none" stroke="#4a8df0" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="14,30 18,18 22,30" fill="#4a8df0" />
      </svg>
    ),
    models: [
      { name: 'Gemini 2.5 Pro',   speed: 75,  price: 10.50 },
      { name: 'Gemini 2.5 Flash', speed: 220, price: 0.30 },
      { name: 'Gemini Nano',      speed: 300, price: 0.05 },
    ],
  },
  {
    id: 'xai',
    name: 'xAI',
    color: '#cfcfd4',
    colorDark: '#888893',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M7 8 L29 28 M29 8 L17 20" stroke="#cfcfd4" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    models: [
      { name: 'Grok 4',       speed: 75, price: 15.00 },
      { name: 'Grok 4 Fast',  speed: 180, price: 0.50 },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    color: '#5e7df0',
    colorDark: '#3852b8',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M6 18 C 6 10, 14 10, 18 18 C 22 26, 30 26, 30 18 C 30 10, 22 10, 18 18 C 14 26, 6 26, 6 18 Z"
              fill="none" stroke="#5e7df0" strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    ),
    models: [
      { name: 'Llama 4 Maverick', speed: 200, price: 0.50 },
      { name: 'Llama 4 Scout',    speed: 260, price: 0.20 },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    color: '#f5a623',
    colorDark: '#b87715',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <rect x="6" y="6"  width="6" height="6" fill="#f5a623" />
        <rect x="6" y="14" width="6" height="6" fill="#f08620" />
        <rect x="14" y="14" width="6" height="6" fill="#ef561d" />
        <rect x="6" y="22" width="6" height="6" fill="#e0331d" />
        <rect x="14" y="22" width="6" height="6" fill="#bb1f2a" />
        <rect x="22" y="22" width="6" height="6" fill="#8c1331" />
      </svg>
    ),
    models: [
      { name: 'Mistral Large 2', speed: 80,  price: 6.00 },
      { name: 'Mistral Small',   speed: 160, price: 0.30 },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    color: '#3b6cd9',
    colorDark: '#234080',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M6 18 Q 18 4, 30 18 Q 18 32, 6 18 Z" fill="none" stroke="#3b6cd9" strokeWidth="2.5" />
        <circle cx="22" cy="18" r="4" fill="#3b6cd9" />
        <circle cx="23.5" cy="16.5" r="1.2" fill="#fff" />
      </svg>
    ),
    models: [
      { name: 'DeepSeek V3.2',   speed: 60, price: 1.10 },
      { name: 'DeepSeek R1',     speed: 40, price: 2.20 },
    ],
  },
  {
    id: 'qwen',
    name: 'Qwen',
    color: '#a14cf0',
    colorDark: '#6a2db0',
    emblem: (s = 36) => (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M10 8 L26 8 L30 14 L22 28 L14 28 L6 14 Z"
              fill="none" stroke="#a14cf0" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 12 L24 22 L12 22 Z" fill="#a14cf0" />
      </svg>
    ),
    models: [
      { name: 'Qwen3 Max',   speed: 80,  price: 6.00 },
      { name: 'Qwen3 Turbo', speed: 200, price: 0.40 },
    ],
  },
];

const PUMP_PALETTE = {
  openai:    { body: '#1aa37a', dark: '#0c6a4d' },
  anthropic: { body: '#d97757', dark: '#a14d2f' },
  google:    { body: '#4a8df0', dark: '#2a5fb0' },
  xai:       { body: '#5a5a64', dark: '#2e2e36' },
  meta:      { body: '#5e7df0', dark: '#3852b8' },
  mistral:   { body: '#f5a623', dark: '#b87715' },
  deepseek:  { body: '#3b6cd9', dark: '#234080' },
  qwen:      { body: '#a14cf0', dark: '#6a2db0' },
};

// Pump positions are computed at render. Robot fuel port is anchored.
const STAGE_W = 1280;
const STAGE_H = 820;
const TANK_CAP = 100; // arbitrary "fuel" units shown in gauge

// ============================================================
// Nozzle SVG (original design)
// ============================================================
function NozzleSVG({ color = '#2a2a2a', active = false }) {
  // origin (0,0) at the trigger pivot near the top — that's the point that follows the cursor.
  return (
    <svg width="64" height="92" viewBox="-12 -10 76 102" style={{ overflow: 'visible' }}>
      {/* hose attach knob — top right */}
      <circle cx="52" cy="0" r="6" fill="#1a1a1a" />
      <circle cx="52" cy="0" r="3" fill="#444" />
      {/* handle */}
      <path d="M10 0 L 52 0 L 52 14 L 24 14 L 24 30 L 10 30 Z" fill={color} stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round" />
      {/* grip detail */}
      <rect x="14" y="4" width="34" height="3" fill="rgba(255,255,255,0.18)" />
      <rect x="14" y="9" width="34" height="2" fill="rgba(0,0,0,0.25)" />
      {/* trigger guard */}
      <path d="M14 14 Q 6 26, 14 34 L 24 34 L 24 30 L 16 30 Q 12 26, 16 22 L 24 22 L 24 14 Z" fill="#1a1a1a" />
      {/* trigger */}
      <rect x="16" y="20" width="6" height="10" rx="1" fill="#ddd" />
      {/* spout barrel */}
      <rect x="-12" y="2" width="22" height="10" fill={color} stroke="#0a0a0a" strokeWidth="1.5" />
      {/* spout tip */}
      <rect x="-12" y="3" width="6" height="8" fill="#888" stroke="#0a0a0a" strokeWidth="1.2" />
      {/* tip hole */}
      <circle cx="-10" cy="7" r="1.6" fill="#1a0a04" />
      {/* active glow */}
      {active && (
        <circle cx="-10" cy="7" r="3" fill="#ff8a3d" opacity="0.85">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

// ============================================================
// Robot (original design)
// ============================================================
function Robot({ fuelLevel }) {
  return (
    <svg viewBox="0 0 280 320" width="280" height="320">
      {/* antenna */}
      <line x1="140" y1="40" x2="140" y2="10" stroke="#9aa4b8" strokeWidth="3" />
      <circle cx="140" cy="8" r="6" fill="#ff8a3d">
        <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* head */}
      <rect x="76" y="40" width="128" height="92" rx="14" fill="#cfd6e4" stroke="#7d8aa6" strokeWidth="3" />
      <rect x="76" y="40" width="128" height="20" rx="10" fill="#aab4c8" />
      {/* eyes */}
      <rect x="96" y="76" width="34" height="34" rx="6" fill="#15202e" />
      <rect x="150" y="76" width="34" height="34" rx="6" fill="#15202e" />
      <circle cx={fuelLevel > 0 ? 116 : 113} cy="93" r="6" fill="#ff8a3d">
        <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={fuelLevel > 0 ? 170 : 167} cy="93" r="6" fill="#ff8a3d" />
      {/* mouth */}
      <rect x="110" y="118" width="60" height="6" rx="3" fill="#7d8aa6" />
      {/* neck */}
      <rect x="120" y="132" width="40" height="14" fill="#7d8aa6" />
      {/* body */}
      <rect x="58" y="146" width="164" height="140" rx="10" fill="#dbe1ee" stroke="#7d8aa6" strokeWidth="3" />
      {/* chest panel */}
      <rect x="78" y="166" width="124" height="56" rx="4" fill="#0c1219" />
      {/* chest gauge bg */}
      <rect x="86" y="178" width="108" height="14" rx="3" fill="#1a1410" stroke="#4a4435" strokeWidth="1.5" />
      <rect x="88" y="180" width={104 * fuelLevel / TANK_CAP} height="10" rx="2" fill="url(#fuelg)" />
      <defs>
        <linearGradient id="fuelg" x1="0" x2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#ffd07a" />
        </linearGradient>
      </defs>
      {/* tank readout */}
      <text x="140" y="212" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#ff8a3d" letterSpacing="2">
        TANK {fuelLevel.toFixed(0).padStart(3, '0')}/{TANK_CAP}
      </text>
      {/* arms */}
      <rect x="38" y="158" width="22" height="80" rx="6" fill="#cfd6e4" stroke="#7d8aa6" strokeWidth="3" />
      <rect x="220" y="158" width="22" height="80" rx="6" fill="#cfd6e4" stroke="#7d8aa6" strokeWidth="3" />
      <circle cx="49" cy="246" r="14" fill="#aab4c8" stroke="#7d8aa6" strokeWidth="3" />
      <circle cx="231" cy="246" r="14" fill="#aab4c8" stroke="#7d8aa6" strokeWidth="3" />
      {/* legs */}
      <rect x="92" y="286" width="36" height="24" rx="4" fill="#7d8aa6" />
      <rect x="152" y="286" width="36" height="24" rx="4" fill="#7d8aa6" />
      {/* fuel port label arrow */}
      <text x="248" y="200" fontSize="9" fill="#4a4435" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">↘</text>
    </svg>
  );
}

// ============================================================
// Hose SVG: cubic Bézier from pump nozzle anchor → nozzle tip
// ============================================================
function Hose({ from, to, color }) {
  if (!from || !to) return null;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const sag = Math.min(120, 40 + Math.abs(dx) * 0.18 + Math.max(0, dy) * 0.2);
  const c1 = { x: from.x + dx * 0.25, y: from.y + sag };
  const c2 = { x: from.x + dx * 0.75, y: to.y + sag * 0.7 };
  const d = `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
  return (
    <g>
      <path d={d} stroke="#0a0a0a" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d={d} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ============================================================
// Mountains backdrop
// ============================================================
const MountainsSVG = () => (
  <svg className="mountains" viewBox="0 0 1280 120" preserveAspectRatio="none">
    <path d="M0 100 L 120 50 L 220 80 L 340 30 L 460 70 L 600 20 L 760 60 L 900 25 L 1060 65 L 1180 35 L 1280 70 L 1280 120 L 0 120 Z" fill="#3a2a3a" />
    <path d="M0 110 L 100 80 L 240 95 L 380 70 L 540 100 L 700 75 L 880 95 L 1060 80 L 1200 100 L 1280 90 L 1280 120 L 0 120 Z" fill="#5a3a4a" opacity="0.7" />
  </svg>
);

// ============================================================
// Main App
// ============================================================
function App() {
  const [companyId, setCompanyId] = useState('anthropic');
  const company = useMemo(() => COMPANIES.find(c => c.id === companyId), [companyId]);
  const palette = PUMP_PALETTE[companyId];

  // active pumping session: { modelIdx, tokens, cost }
  const [session, setSession] = useState(null); // { idx, tokens, cost, startedAt }
  // robot tank level (units 0..TANK_CAP)
  const [fuelLevel, setFuelLevel] = useState(0);
  // global totals
  const [totals, setTotals] = useState({ tokens: 0, cost: 0 });

  // drag state per pump-index
  const [drag, setDrag] = useState(null); // { idx, pos: {x,y}, offset:{x,y} } in stage coords
  const dragRef = useRef(null);
  // when pumping, store the nozzle's anchor position so the hose visually attaches to port
  const [overPort, setOverPort] = useState(false);

  const stageRef = useRef(null);
  const portRef = useRef(null);

  // pump anchor positions (where the hose exits the pump body) in stage coords
  const [pumpAnchors, setPumpAnchors] = useState({});
  // nozzle holster positions (rest position of nozzle when not in use) per pump idx
  const [holsterPositions, setHolsterPositions] = useState({});

  // measure pump positions after layout
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageBox = stage.getBoundingClientRect();
    const anchors = {};
    const rest = {};
    company.models.forEach((_m, i) => {
      const pumpEl = stage.querySelector(`[data-pump-idx="${i}"]`);
      const holEl  = stage.querySelector(`[data-holster-idx="${i}"]`);
      if (pumpEl) {
        const pb = pumpEl.getBoundingClientRect();
        // hose exits from upper-right side of the pump body
        anchors[i] = { x: pb.right - stageBox.left - 4, y: pb.top - stageBox.top + 90 };
      }
      if (holEl) {
        const hb = holEl.getBoundingClientRect();
        rest[i] = { x: hb.left - stageBox.left - 24, y: hb.top - stageBox.top - 12 };
      }
    });
    setPumpAnchors(anchors);
    setHolsterPositions(rest);
  }, [companyId, company]);

  // port position
  const getPortCenter = useCallback(() => {
    const stage = stageRef.current;
    const port  = portRef.current;
    if (!stage || !port) return null;
    const sb = stage.getBoundingClientRect();
    const pb = port.getBoundingClientRect();
    return { x: pb.left - sb.left + pb.width/2, y: pb.top - sb.top + pb.height/2 };
  }, []);

  const distToPort = useCallback((p) => {
    const c = getPortCenter();
    if (!c || !p) return Infinity;
    const dx = c.x - p.x, dy = c.y - p.y;
    return Math.hypot(dx, dy);
  }, [getPortCenter]);

  // pointer handlers (on stage)
  const onPointerMove = useCallback((e) => {
    const cur = dragRef.current;
    if (!cur) return;
    const sb = stageRef.current.getBoundingClientRect();
    const x = e.clientX - sb.left - cur.offset.x;
    const y = e.clientY - sb.top  - cur.offset.y;
    cur.pos = { x, y };
    setDrag(d => d ? { ...d, pos: { x, y } } : d);
    // check proximity to fuel port (using the spout tip area; tip is near top-left of div)
    setOverPort(distToPort({ x: x + 0, y: y + 7 }) < 44);
  }, [distToPort]);

  const onPointerUp = useCallback(() => {
    const cur = dragRef.current;
    if (!cur) return;
    const tip = cur.pos ? { x: cur.pos.x, y: cur.pos.y + 7 } : null;
    if (tip && distToPort(tip) < 44) {
      const idx = cur.idx;
      setSession({ idx, tokens: 0, cost: 0, startedAt: performance.now() });
    }
    dragRef.current = null;
    setDrag(null);
    setOverPort(false);
  }, [distToPort]);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup',   onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup',   onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [drag, onPointerMove, onPointerUp]);

  // pumping loop: tick session.tokens & cost based on model speed/price
  useEffect(() => {
    if (!session) return;
    const model = company.models[session.idx];
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const deltaTokens = model.speed * dt;
      const deltaCost   = (deltaTokens / 1_000_000) * model.price;
      setSession(s => s ? { ...s, tokens: s.tokens + deltaTokens, cost: s.cost + deltaCost } : s);
      setTotals(t => ({ tokens: t.tokens + deltaTokens, cost: t.cost + deltaCost }));
      setFuelLevel(f => Math.min(TANK_CAP, f + deltaTokens * 0.05)); // 1 unit per ~20 tokens
    }, 60);
    return () => clearInterval(id);
  }, [session && session.idx, company]); // eslint-disable-line

  // auto-stop if tank full
  useEffect(() => {
    if (fuelLevel >= TANK_CAP && session) {
      setSession(null);
    }
  }, [fuelLevel, session]);

  const stopPump = () => setSession(null);
  const drainTank = () => setFuelLevel(0);

  // begin drag
  const beginDrag = (idx, e) => {
    e.preventDefault();
    const sb = stageRef.current.getBoundingClientRect();
    const target = e.currentTarget.getBoundingClientRect();
    // offset: pointer location relative to nozzle origin (top-left)
    const offset = { x: e.clientX - target.left, y: e.clientY - target.top };
    // initial nozzle pos at current location
    const pos = { x: target.left - sb.left, y: target.top - sb.top };
    const d = { idx, pos, offset };
    dragRef.current = d;
    setDrag(d);
    // if currently pumping this pump, lift the nozzle (end session)
    if (session && session.idx === idx) setSession(null);
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  // nozzle position resolver
  const nozzlePos = (idx) => {
    if (drag && drag.idx === idx)        return drag.pos;
    if (session && session.idx === idx) {
      const port = getPortCenter();
      if (port) return { x: port.x - 0, y: port.y - 7 };
    }
    return holsterPositions[idx] || { x: -200, y: -200 };
  };

  const hoseFor = (idx) => {
    const from = pumpAnchors[idx];
    const np = nozzlePos(idx);
    if (!from || !np) return null;
    // hose connects from pump anchor to the nozzle's "knob" location
    const to = { x: np.x + 52, y: np.y + 0 };
    return { from, to, color: palette.body };
  };

  const fmtMoney = (n) => '$' + n.toFixed(n < 0.01 ? 6 : n < 1 ? 4 : 2);
  const fmtTokens = (n) => {
    if (n < 1000) return n.toFixed(0);
    if (n < 1_000_000) return (n/1000).toFixed(2) + 'k';
    return (n/1_000_000).toFixed(3) + 'M';
  };

  return (
    <div className="stage" ref={stageRef}>
      {/* sky already via background */}
      <div className="sun" />
      <MountainsSVG />
      <div className="ground" />
      <div className="road" />

      {/* canopy */}
      <div className="canopy">AI FUEL PLAZA · 24H</div>

      {/* HUD */}
      <div className="hud">
        <h1>SESSION TOTALS</h1>
        <div className="sub">// all pumps · all stations</div>
        <div className="hud-row"><span className="k">TOKENS</span><span className="v">{fmtTokens(totals.tokens)}</span></div>
        <div className="hud-row"><span className="k">SPENT</span> <span className="v">{fmtMoney(totals.cost)}</span></div>
        <div className="hud-row"><span className="k">TANK</span>  <span className="v">{fuelLevel.toFixed(0)}/{TANK_CAP}</span></div>
        <div style={{display:'flex', gap:6, marginTop:10}}>
          <button onClick={drainTank} style={{flex:1, fontSize:10, letterSpacing:2, padding:'6px 8px', background:'#2a3445', color:'#ecead8', border:'1px solid #3a4a60', borderRadius:4, cursor:'pointer'}}>DRAIN TANK</button>
          <button onClick={() => setTotals({tokens:0,cost:0})} style={{flex:1, fontSize:10, letterSpacing:2, padding:'6px 8px', background:'#2a3445', color:'#ecead8', border:'1px solid #3a4a60', borderRadius:4, cursor:'pointer'}}>RESET $</button>
        </div>
      </div>

      {/* Price board on right */}
      <div className="price-board">
        <div className="pb-title">// {company.name.toUpperCase()} · $/M TOK (OUT)</div>
        {company.models.map((m, i) => (
          <div className="pb-row" key={m.name}>
            <span className="pb-label">{m.name}</span>
            <span className="pb-val">${m.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* station selector */}
      <div className="stations-row">
        {COMPANIES.map(c => (
          <div
            key={c.id}
            className={'station-card' + (c.id === companyId ? ' active' : '')}
            onClick={() => { setCompanyId(c.id); setSession(null); }}
          >
            <div className="emblem">{c.emblem(36)}</div>
            <div className="scname">{c.name}</div>
            <div className="pole" />
          </div>
        ))}
      </div>

      {/* pump bay */}
      <div className="pump-bay">
        {company.models.map((m, i) => {
          const isPumping = session && session.idx === i;
          const sessTokens = isPumping ? session.tokens : 0;
          const sessCost   = isPumping ? session.cost   : 0;
          return (
            <div className="pump" key={m.name} data-pump-idx={i}>
              <div className="pump-body" style={{ '--pump-color': palette.body, '--pump-color-dark': palette.dark }}>
                <div className="pump-top">{m.name.toUpperCase()}</div>
                <div className="screen">
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="lbl">PRICE</span>
                    <span className="lbl">USD</span>
                  </div>
                  <div className="val">{sessCost < 1 ? sessCost.toFixed(4) : sessCost.toFixed(2)}</div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="lbl">TOKENS</span>
                    <span className="lbl">OUT</span>
                  </div>
                  <div className="val small">{sessTokens.toFixed(0).padStart(7,'0')}</div>
                </div>
                <div className="pump-info">
                  <div className="row"><span className="k">SPEED</span><span className="v">{m.speed} t/s</span></div>
                  <div className="row"><span className="k">PRICE</span><span className="v">${m.price.toFixed(2)}/M</span></div>
                </div>
                <div className="nozzle-holster" data-holster-idx={i} />
                {isPumping && <button className="stop-btn" onClick={stopPump}>STOP</button>}
              </div>
              <div className="pump-base" />
            </div>
          );
        })}
      </div>

      {/* Robot + fuel port */}
      <div className="robot">
        <Robot fuelLevel={fuelLevel} />
        <div className="shadow" />
        <div
          ref={portRef}
          className={'fuel-port' + ((drag && overPort) ? ' target' : '')}
          style={{ left: 8, top: 178 }}
        />
      </div>

      {/* SVG hose overlay (renders behind nozzles? no, on top of stage is fine) */}
      <svg className="hose-overlay" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        {company.models.map((_m, i) => {
          const h = hoseFor(i);
          if (!h) return null;
          return <Hose key={i} from={h.from} to={h.to} color={h.color} />;
        })}
      </svg>

      {/* Nozzles (rendered absolutely over everything) */}
      {company.models.map((_m, i) => {
        const pos = nozzlePos(i);
        if (!pos) return null;
        const isDrag = drag && drag.idx === i;
        const isPump = session && session.idx === i;
        return (
          <div
            key={i}
            className={'nozzle' + (isDrag ? ' dragging' : '') + (isPump ? ' pumping' : '')}
            style={{ left: pos.x, top: pos.y }}
            onPointerDown={(e) => beginDrag(i, e)}
          >
            <NozzleSVG color={palette.dark} active={isPump} />
          </div>
        );
      })}

      {/* toast */}
      {!session && !drag && (
        <div className="toast">
          DRAG ANY NOZZLE → ROBOT FUEL PORT TO START PUMPING · CLICK A STATION TO SWITCH
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
