const $ = (selector, root = document) => root.querySelector(selector);

const ui = {
  companySelect: $('#companySelect'),
  modelSelect: $('#modelSelect'),
  taskSelect: $('#taskSelect'),
  fuelButton: $('#fuelButton'),
  canvas: $('#stationCanvas'),
  dataStatus: $('#dataStatus'),
  taskTokens: $('#taskTokens'),
  readoutModel: $('#readoutModel'),
  readoutRate: $('#readoutRate'),
  readoutCost: $('#readoutCost'),
  printerState: $('#printerState'),
  receiptSlot: $('#receiptSlot'),
  receiptWall: $('#receiptWall'),
  wallCount: $('#wallCount'),
  wallSpread: $('#wallSpread'),
  filterSelect: $('#filterSelect'),
  sortWall: $('#sortWall'),
  compareExtremes: $('#compareExtremes'),
  clearWall: $('#clearWall'),
};

const state = {
  models: FALLBACK_MODELS.slice(),
  company: '',
  selectedId: '',
  taskId: TASKS[2].id,
  fueling: false,
  fuelStart: 0,
  fuelDuration: 5200,
  completedCostVisible: false,
  pinned: [],
  wallSorted: false,
  extremesOnly: false,
  filter: 'all',
  phase: 0,
};

const ctx = ui.canvas.getContext('2d');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function money(value) {
  if (!Number.isFinite(value)) return '$0.0000';
  if (value >= 100) return `$${value.toFixed(1)}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(5)}`;
}

function seededNumber(seed) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  return ((hash >>> 0) % 1000) / 1000;
}

function getCompanyStyle(company) {
  const index = Math.floor(seededNumber(company) * COMPANY_STYLES.length);
  const base = COMPANY_STYLES[index];
  const letters = company.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || base.mark;
  return { ...base, mark: letters };
}

function bootInterface() {
  ui.dataStatus.textContent = `LOCAL CACHE / LIVE LINK BLOCKED`;

  TASKS.forEach((task) => {
    const option = document.createElement('option');
    option.value = task.id;
    option.textContent = task.label;
    ui.taskSelect.appendChild(option);
  });
  ui.taskSelect.value = state.taskId;

  populateCompanies();
  updateModelsForCompany();
  bindEvents();
  updateReadout();
  renderWall();
  requestAnimationFrame(draw);
}

function populateCompanies() {
  const companies = [...new Set(state.models.map((model) => model.company))].sort();
  ui.companySelect.innerHTML = '';
  ui.filterSelect.innerHTML = '<option value="all">all companies</option>';
  companies.forEach((company) => {
    const option = document.createElement('option');
    option.value = company;
    option.textContent = company;
    ui.companySelect.appendChild(option);

    const filterOption = document.createElement('option');
    filterOption.value = company;
    filterOption.textContent = company;
    ui.filterSelect.appendChild(filterOption);
  });
  state.company = companies[0] || '';
  ui.companySelect.value = state.company;
}

function updateModelsForCompany() {
  const models = state.models.filter((model) => model.company === state.company);
  ui.modelSelect.innerHTML = '';
  models.forEach((model) => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = `${model.name} / ${model.provider}`;
    ui.modelSelect.appendChild(option);
  });
  state.selectedId = models[0]?.id || state.models[0]?.id || '';
  ui.modelSelect.value = state.selectedId;
}

function bindEvents() {
  ui.companySelect.addEventListener('change', () => {
    state.company = ui.companySelect.value;
    updateModelsForCompany();
    updateReadout();
  });
  ui.modelSelect.addEventListener('change', () => {
    state.selectedId = ui.modelSelect.value;
    updateReadout();
  });
  ui.taskSelect.addEventListener('change', () => {
    state.taskId = ui.taskSelect.value;
    updateReadout();
  });
  ui.fuelButton.addEventListener('click', beginFueling);
  ui.sortWall.addEventListener('click', () => {
    state.wallSorted = !state.wallSorted;
    renderWall();
  });
  ui.compareExtremes.addEventListener('click', () => {
    state.extremesOnly = !state.extremesOnly;
    renderWall();
  });
  ui.clearWall.addEventListener('click', () => {
    state.pinned = [];
    renderWall();
  });
  ui.filterSelect.addEventListener('change', () => {
    state.filter = ui.filterSelect.value;
    renderWall();
  });
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

function selectedModel() {
  return state.models.find((model) => model.id === state.selectedId) || state.models[0];
}

function selectedTask() {
  return TASKS.find((task) => task.id === state.taskId) || TASKS[0];
}

function estimateInputCost(model = selectedModel(), task = selectedTask()) {
  return model.input * task.tokens / 1_000_000;
}

function estimateOutputCost(model = selectedModel(), task = selectedTask()) {
  return model.output * (task.tokens * task.outputRatio) / 1_000_000;
}

function updateReadout(progress = state.fueling ? currentProgress() : 1) {
  const model = selectedModel();
  const task = selectedTask();
  if (!model || !task) return;
  ui.taskTokens.textContent = `${task.tokens.toLocaleString()} tokens`;
  ui.readoutModel.textContent = `${model.company} / ${model.name}`;
  ui.readoutRate.textContent = `$${model.input.toFixed(model.input < 1 ? 3 : 2)} / 1M`;
  ui.readoutCost.textContent = money(estimateInputCost(model, task) * progress);
}

function currentProgress() {
  if (!state.fueling) return 0;
  return clamp((performance.now() - state.fuelStart) / state.fuelDuration, 0, 1);
}

function beginFueling() {
  if (state.fueling) return;
  state.fueling = true;
  state.fuelStart = performance.now();
  state.completedCostVisible = false;
  ui.fuelButton.disabled = true;
  ui.printerState.textContent = 'metering';
  ui.receiptSlot.innerHTML = '';
}

function finishFueling() {
  const receipt = makeReceipt(selectedModel(), selectedTask());
  state.completedCostVisible = true;
  state.pinned.unshift(receipt);
  state.pinned = state.pinned.slice(0, 24);
  ui.receiptSlot.innerHTML = '';
  ui.receiptSlot.appendChild(createReceiptElement(receipt, true));
  ui.printerState.textContent = 'printed';
  ui.fuelButton.disabled = false;
  state.fueling = false;
  renderWall();
}

function makeReceipt(model, task) {
  const now = new Date();
  const inputCost = estimateInputCost(model, task);
  const outputCost = estimateOutputCost(model, task);
  const style = getCompanyStyle(model.company);
  return {
    receiptId: `${model.id}:${task.id}:${now.getTime()}`,
    company: model.company,
    provider: model.provider,
    model: model.name,
    task: task.label,
    tokens: task.tokens,
    input: model.input,
    output: model.output,
    inputCost,
    outputCost,
    timestamp: now.toLocaleString(),
    gateway: model.gateway,
    style,
  };
}

function createReceiptElement(receipt, fresh = false) {
  const article = document.createElement('article');
  article.className = `receipt ${receipt.style.className}${fresh ? ' receipt--fresh' : ''}`;
  article.style.setProperty('--paper', receipt.style.paper);
  article.style.setProperty('--receipt-ink', receipt.style.ink);
  article.style.setProperty('--tilt', `${(seededNumber(receipt.receiptId) - .5) * 4}deg`);
  article.innerHTML = `
    <div class="receipt__perfs"></div>
    <header><span>${receipt.style.mark}</span><strong>${receipt.company}</strong><em>${receipt.provider}</em></header>
    <div class="receipt__title">COMPUTE FUEL RECEIPT</div>
    <dl>
      <div><dt>model</dt><dd>${receipt.model}</dd></div>
      <div><dt>task</dt><dd>${receipt.task}</dd></div>
      <div><dt>same input</dt><dd>${receipt.tokens.toLocaleString()} tok</dd></div>
      <div><dt>input rate</dt><dd>$${receipt.input.toFixed(receipt.input < 1 ? 3 : 2)} / 1M</dd></div>
      <div><dt>output rate</dt><dd>$${receipt.output.toFixed(receipt.output < 1 ? 3 : 2)} / 1M</dd></div>
      <div><dt>est. input cost</dt><dd>${money(receipt.inputCost)}</dd></div>
      <div><dt>est. output cost</dt><dd>${money(receipt.outputCost)}</dd></div>
    </dl>
    <div class="receipt__total"><span>metered input</span><strong>${money(receipt.inputCost)}</strong></div>
    <div class="receipt__barcode">${barcode(receipt.receiptId)}</div>
    <footer><span>${receipt.timestamp}</span><span>${receipt.gateway ? 'gateway routable' : 'catalog record'}</span></footer>
  `;
  return article;
}

function barcode(seed) {
  let bars = '';
  for (let i = 0; i < 42; i += 1) {
    const width = 1 + Math.floor(seededNumber(`${seed}-${i}`) * 4);
    bars += `<i style="width:${width}px"></i>`;
  }
  return bars;
}

function renderWall() {
  let receipts = state.pinned.slice();
  if (state.filter !== 'all') receipts = receipts.filter((receipt) => receipt.company === state.filter);
  if (state.wallSorted) receipts.sort((a, b) => a.inputCost - b.inputCost);
  if (state.extremesOnly && receipts.length > 2) {
    const sorted = receipts.slice().sort((a, b) => a.inputCost - b.inputCost);
    receipts = [sorted[0], sorted[sorted.length - 1]];
  }
  ui.receiptWall.innerHTML = '';
  receipts.forEach((receipt) => ui.receiptWall.appendChild(createReceiptElement(receipt)));
  ui.wallCount.textContent = `${state.pinned.length} pinned`;
  ui.sortWall.classList.toggle('is-on', state.wallSorted);
  ui.compareExtremes.classList.toggle('is-on', state.extremesOnly);
  if (!receipts.length) {
    ui.wallSpread.textContent = 'Pin completed receipts to compare fuel costs physically.';
    return;
  }
  const min = receipts.reduce((a, b) => (a.inputCost < b.inputCost ? a : b));
  const max = receipts.reduce((a, b) => (a.inputCost > b.inputCost ? a : b));
  const ratio = min.inputCost > 0 ? max.inputCost / min.inputCost : 0;
  ui.wallSpread.textContent = receipts.length === 1
    ? `${min.company} ${min.model} metered at ${money(min.inputCost)} for the same input.`
    : `${min.company} is cheapest at ${money(min.inputCost)}; ${max.company} is premium at ${money(max.inputCost)} (${ratio.toFixed(1)}x).`;
}

function resizeCanvas() {
  const rect = ui.canvas.parentElement.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  ui.canvas.width = Math.floor(rect.width * ratio);
  ui.canvas.height = Math.floor(Math.max(420, rect.width * .56) * ratio);
  ui.canvas.style.height = `${Math.max(420, rect.width * .56)}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function draw(now) {
  state.phase = now / 1000;
  const width = ui.canvas.clientWidth;
  const height = ui.canvas.clientHeight;
  const model = selectedModel();
  const task = selectedTask();
  const progress = currentProgress();
  const displayProgress = state.fueling || state.completedCostVisible ? Math.max(progress, state.completedCostVisible ? 1 : 0) : 0;
  updateReadout(state.fueling ? progress : 1);
  drawBackground(width, height, model);
  drawStation(width, height, model, task, displayProgress);
  drawMeters(width, height, model, task, displayProgress);
  drawRobot(width, height, displayProgress);
  drawNozzle(width, height, progress);
  if (state.fueling && progress >= 1) finishFueling();
  requestAnimationFrame(draw);
}

function drawBackground(width, height, model) {
  const style = getCompanyStyle(model?.company || 'Unknown');
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#101312');
  gradient.addColorStop(.55, '#17110d');
  gradient.addColorStop(1, '#080706');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255,190,88,.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, height * .54);
    ctx.lineTo(x - width * .15, height);
    ctx.stroke();
  }
  ctx.fillStyle = style.paper;
  ctx.globalAlpha = .035;
  ctx.fillRect(width * .05, height * .12, width * .9, height * .06);
  ctx.globalAlpha = 1;
}

function drawStation(width, height, model, task, progress) {
  const x = width * .09, y = height * .18, w = width * .31, h = height * .62;
  ctx.fillStyle = '#15120d';
  ctx.strokeStyle = '#4b3b29';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#070604';
  ctx.fillRect(x + w * .08, y + h * .08, w * .84, h * .23);
  ctx.strokeStyle = 'rgba(255,187,80,.35)';
  ctx.strokeRect(x + w * .08, y + h * .08, w * .84, h * .23);
  ctx.font = `${Math.max(34, w * .13)}px "Share Tech Mono", monospace`;
  ctx.fillStyle = '#ffd084';
  ctx.shadowColor = 'rgba(255,172,66,.55)';
  ctx.shadowBlur = 16;
  ctx.textAlign = 'right';
  ctx.fillText(money(estimateInputCost(model, task) * progress), x + w * .87, y + h * .22);
  ctx.shadowBlur = 0;
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#887a62';
  ctx.textAlign = 'left';
  ctx.fillText('INPUT TOKEN FUEL', x + w * .1, y + h * .12);
  ctx.fillText(`${model.company} / ${model.provider}`.toUpperCase(), x + w * .1, y + h * .38);
  ctx.fillText(model.name.toUpperCase().slice(0, 34), x + w * .1, y + h * .44);
  ctx.fillText(`${task.tokens.toLocaleString()} TOKENS / FIXED LOAD`, x + w * .1, y + h * .5);
  drawGauge(x + w * .16, y + h * .67, w * .16, progress, '#e05c46');
  drawGauge(x + w * .42, y + h * .67, w * .16, model.input / 10, '#ffb44f');
  drawGauge(x + w * .68, y + h * .67, w * .16, task.tokens / 650000, '#76c6c1');
}

function drawGauge(cx, cy, r, value, color) {
  const v = clamp(value, 0, 1);
  ctx.strokeStyle = '#403527';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * .78, Math.PI * 2.22);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * .78, Math.PI * (.78 + 1.44 * v));
  ctx.stroke();
}

function drawRobot(width, height, progress) {
  const arrive = state.fueling ? clamp(progress / .24, 0, 1) : 1;
  const x = width * (.75 - (1 - arrive) * .25);
  const y = height * .59;
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
  ctx.fillStyle = '#090807';
  ctx.fillRect(x - 92, y + 108, 184, 8);
}

function drawNozzle(width, height, progress) {
  const connected = state.fueling ? clamp((progress - .15) / .2, 0, 1) : 0;
  const sx = width * .38, sy = height * .5, tx = width * .69, ty = height * .51;
  ctx.strokeStyle = '#655743';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.bezierCurveTo(width * .48, height * .25, width * .6, height * .7, sx + (tx - sx) * connected, sy + (ty - sy) * connected);
  ctx.stroke();
  ctx.fillStyle = '#b78a45';
  ctx.fillRect(sx + (tx - sx) * connected - 15, sy + (ty - sy) * connected - 11, 45, 22);
  if (connected > .95 && state.fueling) {
    ctx.strokeStyle = 'rgba(255,183,76,.55)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(width * .48, height * .25, width * .6, height * .7, tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawMeters(width, height, model, task, progress) {
  const x = width * .46, y = height * .1, panelHeight = height * .24;
  ctx.fillStyle = 'rgba(7,6,4,.78)';
  ctx.strokeStyle = '#413629';
  ctx.fillRect(x, y, width * .44, panelHeight);
  ctx.strokeRect(x, y, width * .44, panelHeight);
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#8d8069';
  ctx.fillText('SAME INPUT DIFFERENT COST', x + 18, y + 28);
  ctx.fillText('MODEL PRICE PER 1M INPUT TOKENS', x + 18, y + 58);
  ctx.font = '34px "Share Tech Mono", monospace';
  ctx.fillStyle = '#ffd084';
  ctx.fillText(`$${model.input.toFixed(model.input < 1 ? 3 : 2)}`, x + 18, y + 105);
  ctx.font = '12px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#c6b694';
  ctx.fillText(`${task.label.toUpperCase()} / ${task.tokens.toLocaleString()} TOKENS`, x + 18, y + 130);
  if (state.fueling) {
    const printProgress = clamp((progress - .62) / .34, 0, 1);
    ui.printerState.textContent = printProgress > 0 ? 'printing' : 'metering';
    if (printProgress > 0) {
      ctx.fillStyle = '#e9dfc7';
      ctx.fillRect(width * .1, height * .8, width * .22, 150 * printProgress);
      ctx.fillStyle = '#16120d';
      ctx.font = '10px "Special Elite", monospace';
      ctx.fillText('THERMAL COPY / INPUT COST', width * .1 + 16, height * .8 + 26);
      ctx.fillText('PRINTING...', width * .1 + 16, height * .8 + 48);
    }
  }
}

bootInterface();
