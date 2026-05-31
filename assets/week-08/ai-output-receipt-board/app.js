const OUTPUT_TOKENS = 10_000;
const PRICE_SCALE = 1_000_000;
const TASK_NAME = "Research Report";
const rawModels = (window.LLM_STATS_DATA && window.LLM_STATS_DATA.models) || [];

const sortSelect = document.querySelector("#sort-select");
const groupSelect = document.querySelector("#group-select");
const companyFilter = document.querySelector("#company-filter");
const limitSelect = document.querySelector("#limit-select");
const visibleCount = document.querySelector("#visible-count");
const priceRange = document.querySelector("#price-range");
const receiptGrid = document.querySelector("#receipt-grid");
const pinnedList = document.querySelector("#pinned-list");
const clearPinsButton = document.querySelector("#clear-pins");
const modal = document.querySelector("#detail-modal");
const modalContent = document.querySelector("#modal-content");

const pinnedIds = new Set();

const pricedModels = rawModels
  .map((model, index) => {
    const providers = (model.providers || []).filter(
      (provider) => provider.status === "active" && Number.isFinite(provider.output_price_per_m),
    );
    const outputPrices = providers
      .map((provider) => provider.output_price_per_m / PRICE_SCALE)
      .filter((price) => price > 0);

    if (!outputPrices.length) return null;

    const outputPrice = Math.min(...outputPrices);
    const provider = providers.find(
      (item) => item.output_price_per_m / PRICE_SCALE === outputPrice,
    );

    return {
      id: model.id,
      sequence: index,
      company: model.organization?.name || "Unknown",
      model: model.name,
      outputPrice,
      estimatedCost: (outputPrice * OUTPUT_TOKENS) / PRICE_SCALE,
      provider: provider?.provider_name || "Listed provider",
      releaseDate: model.release_date || "Unlisted",
      openWeight: Boolean(model.open_weight),
    };
  })
  .filter(Boolean);

const maxPrice = Math.max(...pricedModels.map((model) => model.outputPrice), 1);

function money(value, minimumDigits = 2) {
  if (value < 0.001) {
    return `$${value.toFixed(6)}`;
  }
  if (value < 0.01) {
    return `$${value.toFixed(5)}`;
  }
  const maximumDigits = Math.max(2, minimumDigits);
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: minimumDigits,
    maximumFractionDigits: maximumDigits,
  })}`;
}

function receiptNumber(model) {
  return String(model.sequence + 1).padStart(4, "0");
}

function randomTilt(model) {
  const tilt = ((model.sequence * 37) % 9) - 4;
  const offset = ((model.sequence * 19) % 5) - 2;
  return `--tilt:${tilt}deg; --offset:${offset}px; --intensity:${model.outputPrice / maxPrice};`;
}

function populateCompanyFilter() {
  const companies = [...new Set(pricedModels.map((model) => model.company))].sort((a, b) =>
    a.localeCompare(b),
  );

  companyFilter.insertAdjacentHTML(
    "beforeend",
    companies.map((company) => `<option value="${company}">${company}</option>`).join(""),
  );
}

function sortModels(models) {
  const mode = sortSelect.value;
  return [...models].sort((a, b) => {
    if (mode === "price-asc") return a.outputPrice - b.outputPrice;
    if (mode === "cost-desc") return b.estimatedCost - a.estimatedCost;
    if (mode === "cost-asc") return a.estimatedCost - b.estimatedCost;
    if (mode === "company") return a.company.localeCompare(b.company) || b.outputPrice - a.outputPrice;
    return b.outputPrice - a.outputPrice;
  });
}

function selectedModels() {
  const company = companyFilter.value;
  const filtered =
    company === "all"
      ? pricedModels
      : pricedModels.filter((model) => model.company === company);
  const sorted = sortModels(filtered);
  const limit = limitSelect.value === "all" ? sorted.length : Number(limitSelect.value);
  return sorted.slice(0, limit);
}

function companySummary(models) {
  const prices = models.map((model) => model.outputPrice);
  const costs = models.map((model) => model.estimatedCost);
  return {
    count: models.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minCost: Math.min(...costs),
    maxCost: Math.max(...costs),
  };
}

function receiptMarkup(model, compact = false) {
  const isPinned = pinnedIds.has(model.id);
  const barWidth = Math.max(4, Math.round((model.outputPrice / maxPrice) * 100));
  const classes = compact ? "receipt is-compact" : "receipt";

  return `
    <article class="${classes}" style="${randomTilt(model)}" data-model-id="${model.id}">
      <div class="tape tape-left"></div>
      <div class="pin-dot" aria-hidden="true"></div>
      <header class="receipt-head">
        <span>OUTPUT PRICE</span>
        <strong>#${receiptNumber(model)}</strong>
      </header>
      <div class="receipt-company">${model.company}</div>
      <h2>${model.model}</h2>
      <div class="perforation"></div>
      <dl>
        <div>
          <dt>Task</dt>
          <dd>${TASK_NAME}</dd>
        </div>
        <div>
          <dt>Output price</dt>
          <dd>${money(model.outputPrice)} USD</dd>
        </div>
        <div>
          <dt>Unit</dt>
          <dd>per 1M output tokens</dd>
        </div>
        <div>
          <dt>Estimated output</dt>
          <dd>${OUTPUT_TOKENS.toLocaleString("en-US")} tokens</dd>
        </div>
        <div class="total-row">
          <dt>Estimated cost</dt>
          <dd>${money(model.estimatedCost, 4)}</dd>
        </div>
      </dl>
      <div class="price-mark" aria-label="Relative output price">
        <span style="width:${barWidth}%"></span>
      </div>
      <footer>
        <span>${model.provider}</span>
        <span>${model.openWeight ? "Open weight" : "Closed weight"}</span>
      </footer>
      ${
        compact
          ? ""
          : `<button class="pin-button ${isPinned ? "is-pinned" : ""}" type="button" data-pin="${model.id}" aria-label="${isPinned ? "Unpin" : "Pin"} ${model.model}">
              ${isPinned ? "Pinned" : "Pin"}
            </button>`
      }
    </article>
  `;
}

function detailMarkup(model) {
  return `
    <div class="receipt detail-copy">
      <header class="receipt-head">
        <span>ENLARGED RECEIPT</span>
        <strong>#${receiptNumber(model)}</strong>
      </header>
      <div class="receipt-company">${model.company}</div>
      <h2 id="modal-title">${model.model}</h2>
      <div class="perforation"></div>
      <dl>
        <div>
          <dt>Task</dt>
          <dd>Generate a long-form research report with detailed analysis, structured sections, examples, and conclusions.</dd>
        </div>
        <div>
          <dt>Output price</dt>
          <dd>${money(model.outputPrice)} USD per 1M output tokens</dd>
        </div>
        <div>
          <dt>Estimated output</dt>
          <dd>${OUTPUT_TOKENS.toLocaleString("en-US")} output tokens</dd>
        </div>
        <div class="total-row">
          <dt>Estimated output cost</dt>
          <dd>${money(model.estimatedCost, 4)}</dd>
        </div>
        <div>
          <dt>Lowest active provider</dt>
          <dd>${model.provider}</dd>
        </div>
        <div>
          <dt>Release date</dt>
          <dd>${model.releaseDate}</dd>
        </div>
      </dl>
    </div>
  `;
}

function renderPinned() {
  const pinnedModels = pricedModels.filter((model) => pinnedIds.has(model.id));

  pinnedList.innerHTML = pinnedModels.length
    ? pinnedModels.map((model) => receiptMarkup(model, true)).join("")
    : '<p class="pin-empty">Click a pin on any receipt to hold it here.</p>';
}

function renderStats(models) {
  const prices = models.map((model) => model.outputPrice);
  visibleCount.textContent = `${models.length} receipts`;
  priceRange.textContent = prices.length
    ? `${money(Math.min(...prices))} to ${money(Math.max(...prices))} per 1M`
    : "$0 to $0 per 1M";
}

function renderCompanyGroups(models) {
  const groups = new Map();
  models.forEach((model) => {
    if (!groups.has(model.company)) groups.set(model.company, []);
    groups.get(model.company).push(model);
  });

  const orderedGroups = [...groups.entries()].sort(([companyA, modelsA], [companyB, modelsB]) => {
    if (sortSelect.value === "company") return companyA.localeCompare(companyB);
    return Math.max(...modelsB.map((model) => model.outputPrice)) -
      Math.max(...modelsA.map((model) => model.outputPrice));
  });

  return orderedGroups
    .map(([company, companyModels]) => {
      const summary = companySummary(companyModels);
      return `
        <section class="company-group" aria-label="${company} receipts">
          <header class="company-label">
            <div>
              <span>Company</span>
              <h2>${company}</h2>
            </div>
            <dl>
              <div>
                <dt>Receipts</dt>
                <dd>${summary.count}</dd>
              </div>
              <div>
                <dt>Output range</dt>
                <dd>${money(summary.minPrice)} - ${money(summary.maxPrice)}</dd>
              </div>
              <div>
                <dt>Cost range</dt>
                <dd>${money(summary.minCost, 4)} - ${money(summary.maxCost, 4)}</dd>
              </div>
            </dl>
          </header>
          <div class="company-receipts">
            ${companyModels.map((model) => receiptMarkup(model)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function render() {
  const models = selectedModels();

  receiptGrid.innerHTML = models.length
    ? groupSelect.value === "company"
      ? renderCompanyGroups(models)
      : models.map((model) => receiptMarkup(model)).join("")
    : '<p class="empty-state">No receipts match this company filter.</p>';

  renderStats(models);
  renderPinned();
}

function openModal(modelId) {
  const model = pricedModels.find((item) => item.id === modelId);
  if (!model) return;
  modalContent.innerHTML = detailMarkup(model);
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

receiptGrid.addEventListener("click", (event) => {
  const pinButton = event.target.closest("[data-pin]");
  if (pinButton) {
    const id = pinButton.dataset.pin;
    pinnedIds.has(id) ? pinnedIds.delete(id) : pinnedIds.add(id);
    render();
    return;
  }

  const receipt = event.target.closest(".receipt");
  if (receipt) openModal(receipt.dataset.modelId);
});

pinnedList.addEventListener("click", (event) => {
  const receipt = event.target.closest(".receipt");
  if (receipt) openModal(receipt.dataset.modelId);
});

clearPinsButton.addEventListener("click", () => {
  pinnedIds.clear();
  render();
});

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

[groupSelect, sortSelect, companyFilter, limitSelect].forEach((control) => {
  control.addEventListener("change", render);
});

populateCompanyFilter();
render();
