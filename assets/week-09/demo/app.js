const $ = (q, root = document) => root.querySelector(q);

const state = {
  models: FALLBACK_MODELS.slice(0, 50).sort((a, b) => a.input - b.input),
  taskId: TASKS[2].id,
  selectedId: '',
  dragging: null,
  fueling: false,
  startedAt: 0,
  duration: 5200,
  receipts: [],
  phase: 0,
};

const ui = {
  canvas: $('#stationCanvas'),
  taskRail: $('#taskRail'),
  tankRack: $('#tankRack'),
  robotSocket: $('#robotSocket'),
  taskTokens: $('#taskTokens'),
  activeTank: $('#activeTank'),
  printerState: $('#printerState'),
  receiptSlot: $('#receiptSlot'),
  receiptWall: $('#receiptWall'),
  wallCount: $('#wallCount'),
  wallNote: $('#wallNote'),
  dataStatus: $('#dataStatus'),
};

const ctx = ui.canvas.getContext('2d');

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function money(v) {
  if (v >= 1) return `$${v.toFixed(2)}`;
  if (v >= 0.01) return `$${v.toFixed(4)}`;
  return `$${v.toFixed(5)}`;
}

function task() {
  return TASKS.find((t) => t.id === state.taskId) || TASKS[0];
}

function model() {
  return state.models.find((m) => m.id === state.selectedId) || state.models[0];
}

function cost(m = model(), t = task()) {
  return m.input * t.tokens / 1_000_000;
}

function renderTasks() {
  ui.taskRail.innerHTML = '';
  TASKS.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = `task-card${t.id === state.taskId ? ' is-active' : ''}`;
    b.type = 'button';
    b.dataset.taskId = t.id;
    b.innerHTML = `<span>LOAD ${String(i + 1).padStart(2, '0')}</span><strong>${t.label}</strong><em>${t.tokens.toLocaleString()} tokens</em>`;
    ui.taskRail.appendChild(b);
  });
  ui.taskTokens.textContent = `${task().tokens.toLocaleString()} tokens`;
}

function renderTanks() {
  ui.tankRack.innerHTML = '';
  state.models.forEach((m, i) => {
    const fill = `${clamp(m.input / 6, 0.08, 1) * 100}%`;
    const tank = document.createElement('button');
    tank.className = `fuel-tank${m.id === state.selectedId ? ' is-active' : ''}`;
    tank.type = 'button';
    tank.dataset.modelId = m.id;
    tank.style.setProperty('--fill', fill);
    tank.innerHTML = `
      <span class="fuel-tank__gauge"><i></i></span>
      <span class="fuel-tank__hose"></span>
      <span class="fuel-tank__nozzle"></span>
      <b>$${m.input.toFixed(m.input < 1 ? 3 : 2)}</b>
      <strong>${m.name}</strong>
      <em>${m.company} / ${m.provider || 'provider'}</em>
      <small>${String(i + 1).padStart(2, '0')}</small>
    `;
    ui.tankRack.appendChild(tank);
  });
}

function renderReceipts() {
  ui.receiptWall.innerHTML = '';
  ui.wallCount.textContent = `${state.receipts.length} pinned`;
  if (!state.receipts.length) {
    ui.wallNote.textContent = 'Drag tanks onto the robot, then compare printed receipts.';
    return;
  }
  const sorted = state.receipts.slice().sort((a, b) => a.inputCost - b.inputCost);
  const cheap = sorted[0];
  const premium = sorted[sorted.length - 1];
  ui.wallNote.textContent = sorted.length === 1
    ? `${cheap.company} / ${cheap.model} printed at ${money(cheap.inputCost)}.`
    : `${cheap.company} cheapest ${money(cheap.inputCost)}; ${premium.company} premium ${money(premium.inputCost)}.`;
  state.receipts.forEach((r) => ui.receiptWall.appendChild(createReceipt(r)));
}

function createReceipt(r) {
  const el = document.createElement('article');
  el.className = 'receipt';
  el.innerHTML = `
    <header><span>${r.company.slice(0, 3).toUpperCase()}</span><strong>${r.company}</strong><em>${r.provider}</em></header>
    <h3>COMPUTE FUEL RECEIPT</h3>
    <dl>
      <div><dt>model</dt><dd>${r.model}</dd></div>
      <div><dt>task</dt><dd>${r.task}</dd></div>
      <div><dt>same input</dt><dd>${r.tokens.toLocaleString()} tok</dd></div>
      <div><dt>input rate</dt><dd>$${r.input.toFixed(r.input < 1 ? 3 : 2)} / 1M</dd></div>
      <div><dt>output rate</dt><dd>$${r.output.toFixed(r.output < 1 ? 3 : 2)} / 1M</dd></div>
    </dl>
    <div class="receipt-total"><span>metered input</span><strong>${money(r.inputCost)}</strong></div>
    <footer>${r.time}</footer>
  `;
  return el;
}

function bind() {
  ui.taskRail.addEventListener('click', (e) => {
    const b = e.target.closest('.task-card');
    if (!b) return;
    state.taskId = b.dataset.taskId;
    renderTasks();
  });

  ui.tankRack.addEventListener('pointerdown', (e) => {
    const tank = e.target.closest('.fuel-tank');
    if (!tank || state.fueling) return;
    startDrag(e, tank);
  });
  ui.tankRack.addEventListener('mousedown', (e) => {
    const tank = e.target.closest('.fuel-tank');
    if (!tank || state.dragging || state.fueling) return;
    startDrag(e, tank);
  });
  window.addEventListener('pointermove', moveDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('pointercancel', cancelDrag);
  window.addEventListener('resize', resize);
}

function startDrag(e, source) {
  e.preventDefault();
  const rect = source.getBoundingClientRect();
  const ghost = source.cloneNode(true);
  ghost.classList.add('drag-ghost');
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  document.body.appendChild(ghost);
  state.selectedId = source.dataset.modelId;
  ui.activeTank.textContent = `${model().company} / ${model().name}`;
  renderTanks();
  state.dragging = {
    modelId: source.dataset.modelId,
    ghost,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
  };
  document.body.classList.add('is-dragging');
  moveGhost(e.clientX, e.clientY);
}

function moveGhost(x, y) {
  if (!state.dragging) return;
  state.dragging.ghost.style.transform = `translate(${x - state.dragging.offsetX}px, ${y - state.dragging.offsetY}px) rotate(-2deg)`;
}

function overSocket(x, y) {
  const r = ui.robotSocket.getBoundingClientRect();
  const pad = 56;
  return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
}

function moveDrag(e) {
  if (!state.dragging) return;
  moveGhost(e.clientX, e.clientY);
  const armed = overSocket(e.clientX, e.clientY);
  ui.robotSocket.classList.toggle('is-armed', armed);
  state.dragging.ghost.classList.toggle('is-armed', armed);
}

function endDrag(e) {
  if (!state.dragging) return;
  const id = state.dragging.modelId;
  const armed = overSocket(e.clientX, e.clientY);
  state.dragging.ghost.remove();
  state.dragging = null;
  document.body.classList.remove('is-dragging');
  ui.robotSocket.classList.remove('is-armed');
  if (armed) beginFueling(id);
}

function cancelDrag() {
  if (!state.dragging) return;
  state.dragging.ghost.remove();
  state.dragging = null;
  document.body.classList.remove('is-dragging');
  ui.robotSocket.classList.remove('is-armed');
}

function beginFueling(id) {
  state.selectedId = id;
  state.fueling = true;
  state.startedAt = performance.now();
  ui.printerState.textContent = 'metering';
  ui.receiptSlot.innerHTML = '';
  ui.activeTank.textContent = `${model().company} / ${model().name}`;
  renderTanks();
}

function finishFueling() {
  const m = model();
  const t = task();
  const receipt = {
    company: m.company,
    provider: m.provider,
    model: m.name,
    task: t.label,
    tokens: t.tokens,
    input: m.input,
    output: m.output,
    inputCost: cost(m, t),
    time: new Date().toLocaleString(),
  };
  state.receipts.unshift(receipt);
  state.receipts = state.receipts.slice(0, 24);
  ui.receiptSlot.innerHTML = '';
  ui.receiptSlot.appendChild(createReceipt(receipt));
  ui.printerState.textContent = 'printed';
  state.fueling = false;
  renderReceipts();
}

function resize() {
  const ratio = window.devicePixelRatio || 1;
  const rect = ui.canvas.parentElement.getBoundingClientRect();
  const h = Math.max(680, rect.width * 0.62);
  ui.canvas.width = Math.floor(rect.width * ratio);
  ui.canvas.height = Math.floor(h * ratio);
  ui.canvas.style.height = `${h}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function progress() {
  return state.fueling ? clamp((performance.now() - state.startedAt) / state.duration, 0, 1) : 0;
}

function draw(now) {
  state.phase = now / 1000;
  const w = ui.canvas.clientWidth;
  const h = ui.canvas.clientHeight;
  const p = progress();
  const m = model();
  const t = task();

  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#11130f');
  bg.addColorStop(.58, '#16100d');
  bg.addColorStop(1, '#070604');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,189,93,.08)';
  for (let x = 0; x < w; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, h * .55);
    ctx.lineTo(x - w * .16, h);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(7,6,5,.82)';
  ctx.fillRect(0, h * .07, w, h * .09);
  ctx.strokeStyle = 'rgba(255,189,93,.18)';
  ctx.strokeRect(w * .05, h * .085, w * .9, h * .052);
  ctx.font = '11px IBM Plex Mono';
  ctx.fillStyle = 'rgba(226,216,189,.44)';
  ctx.textAlign = 'center';
  ctx.fillText('MODEL FUEL CANOPY / LIVE PRICE MANIFOLD', w * .5, h * .118);

  for (let i = 0; i < 9; i += 1) {
    const tx = w * (.1 + i * .1);
    const tankH = h * (.12 + (i % 4) * .025);
    ctx.fillStyle = 'rgba(36,32,25,.72)';
    ctx.strokeStyle = 'rgba(138,112,73,.34)';
    ctx.fillRect(tx, h * .18, w * .045, tankH);
    ctx.strokeRect(tx, h * .18, w * .045, tankH);
    ctx.fillStyle = 'rgba(255,189,93,.08)';
    ctx.fillRect(tx + 4, h * .18 + tankH * .48, w * .045 - 8, tankH * .42);
  }

  drawPump(w, h, m, t, state.fueling ? p : state.receipts.length ? 1 : 0);
  drawRobot(w, h, p);
  drawHose(w, h, p);

  if (state.fueling) {
    ui.printerState.textContent = p > .65 ? 'printing' : 'metering';
    if (p >= 1) finishFueling();
  }

  requestAnimationFrame(draw);
}

function drawPump(w, h, m, t, p) {
  const x = w * .2;
  const y = h * .24;
  const pw = w * .28;
  const ph = h * .47;
  ctx.fillStyle = '#15120d';
  ctx.strokeStyle = '#5a4933';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, pw, ph);
  ctx.strokeRect(x, y, pw, ph);
  ctx.fillStyle = '#070604';
  ctx.fillRect(x + pw * .09, y + ph * .1, pw * .82, ph * .25);
  ctx.strokeStyle = 'rgba(255,189,93,.35)';
  ctx.strokeRect(x + pw * .09, y + ph * .1, pw * .82, ph * .25);
  ctx.font = `${Math.max(34, pw * .14)}px Share Tech Mono`;
  ctx.fillStyle = '#ffd084';
  ctx.textAlign = 'right';
  ctx.shadowColor = 'rgba(255,172,66,.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(money(cost(m, t) * p), x + pw * .88, y + ph * .25);
  ctx.shadowBlur = 0;
  ctx.font = '11px IBM Plex Mono';
  ctx.fillStyle = '#887a62';
  ctx.textAlign = 'left';
  ctx.fillText('INPUT TOKEN FUEL', x + pw * .11, y + ph * .15);
  ctx.fillText(`${m.company} / ${m.provider}`.toUpperCase().slice(0, 34), x + pw * .11, y + ph * .48);
  ctx.fillText(m.name.toUpperCase().slice(0, 34), x + pw * .11, y + ph * .56);
  ctx.fillText(`${t.tokens.toLocaleString()} TOKENS / FIXED LOAD`, x + pw * .11, y + ph * .64);
}

function drawRobot(w, h, p) {
  const arrive = state.fueling ? clamp(p / .22, 0, 1) : 1;
  const x = w * (.76 - (1 - arrive) * .22);
  const y = h * .58;
  ctx.fillStyle = '#24231f';
  ctx.strokeStyle = '#837662';
  ctx.lineWidth = 2;
  ctx.fillRect(x - 55, y - 95, 110, 125);
  ctx.strokeRect(x - 55, y - 95, 110, 125);
  ctx.fillStyle = '#11100e';
  ctx.fillRect(x - 36, y - 72, 72, 28);
  ctx.fillStyle = '#88e0d5';
  ctx.globalAlpha = .8 + Math.sin(state.phase * 4) * .15;
  ctx.fillRect(x - 24, y - 62, 18, 6);
  ctx.fillRect(x + 6, y - 62, 18, 6);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#171613';
  ctx.fillRect(x - 41, y + 30, 22, 80);
  ctx.fillRect(x + 19, y + 30, 22, 80);
  ctx.fillStyle = '#2d2a24';
  ctx.fillRect(x - 80, y - 60, 24, 84);
  ctx.fillRect(x + 56, y - 60, 24, 84);
}

function drawHose(w, h, p) {
  const connected = state.fueling ? clamp((p - .12) / .22, 0, 1) : 0;
  const sx = w * .48;
  const sy = h * .5;
  const tx = w * .69;
  const ty = h * .51;
  ctx.strokeStyle = '#655743';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.bezierCurveTo(w * .52, h * .28, w * .6, h * .7, sx + (tx - sx) * connected, sy + (ty - sy) * connected);
  ctx.stroke();
  ctx.fillStyle = '#b78a45';
  ctx.fillRect(sx + (tx - sx) * connected - 15, sy + (ty - sy) * connected - 11, 45, 22);
}

async function boot() {
  try {
    const response = await fetch('data/live-models.json', { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      const live = (payload.models || []).flatMap((entry) => (entry.providers || [])
        .filter((p) => Number.isFinite(p.input_price_per_m) && Number.isFinite(p.output_price_per_m))
        .map((p) => ({
          id: `${entry.id}:${p.provider_id}`,
          name: entry.name,
          company: entry.organization?.name || 'Unknown',
          provider: p.provider_name,
          input: Number(p.input_price_per_m),
          output: Number(p.output_price_per_m),
        })));
      if (live.length) {
        state.models = live.sort((a, b) => a.input - b.input).slice(0, 50);
        ui.dataStatus.textContent = `LIVE CACHE / ${state.models.length} MODEL TANKS`;
      }
    }
  } catch (error) {
    ui.dataStatus.textContent = `LOCAL CACHE / ${state.models.length} MODEL TANKS`;
  }
  state.selectedId = state.models[0]?.id || '';
  renderTasks();
  renderTanks();
  renderReceipts();
  bind();
  resize();
  requestAnimationFrame(draw);
}

boot();
