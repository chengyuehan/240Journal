# AI Fuel Station — live edition

Interactive "fuel station" visualization of AI API pricing. Drag a model's nozzle
onto the robot to fuel it; the meter ticks by the model's **real output price** and
**real output speed**, and the robot grows a brain sized by the model's **IQ**.

## Run

```bash
node server.js          # → http://localhost:8753
```

Node 18+ only (no dependencies). Open the URL in a browser.

## Where the data comes from (all live)

`server.js` pulls everything **server-side** (so there is no browser CORS issue and
the API key never ships to the client), caches it, and re-fetches every 30 min. The
page fetches the result from `/api/fuel-data` on load — so the pumps reflect the
current catalogue. The header shows `LIVE · N MODELS`.

| Field | Source | Real? |
|---|---|---|
| company / model name | `api.llm-stats.com/stats/v1/models` | ✅ real |
| input price `$/M` | provider `input_price_per_m` | ✅ real |
| output price `$/M` | provider `output_price_per_m` | ✅ real |
| **output speed (tok/s)** | `llm-stats.com/models/<id>` `throughput` (7-day telemetry) | ✅ real (few models with no telemetry fall back to a price estimate → shown as `~`) |
| **IQ** | composite of the model's benchmark scores (`top_scores`) | ✅ real, see below |

### Which dimension is "IQ"

IQ is the **mean of the model's normalized capability benchmark scores**
(reasoning, math, code, general, physics, chemistry, biology, language, agents,
tool-calling — whichever LLM Stats has measured), scaled to 0–100. These are the
benchmarks that measure raw intelligence, so they're the honest basis for "how smart
the robot gets."

Note: brand-new models (e.g. the very latest MiniMax / Gemini) often have only a few
benchmark results published, so their IQ reflects only what has been measured so far
and can read lower than an older, fully-benchmarked sibling. That's a data-coverage
fact of LLM Stats, not a fabricated number.

## Filtering

All real text LLMs are shown — not a hand-picked three per company. Per organization
the noisy size/quant variants (e.g. Qwen's many checkpoints) are de-duped to the
strongest model per family, so you get every distinct model without the clutter.

## Files

- `server.js` — live data server + static host (the thing you run)
- `fuel-station.html` — the app (fetches `/api/fuel-data`)
- `refresh-data.sh` / `data/live-models.json` — optional raw API snapshot
