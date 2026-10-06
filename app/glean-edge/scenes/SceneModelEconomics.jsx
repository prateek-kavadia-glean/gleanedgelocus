import { motion } from "framer-motion";
import {
  BENCHMARK_SNAPSHOT,
  BENCHMARK_SOURCES,
  MODEL_BENCHMARK_POINTS,
  MODEL_PROVIDERS,
} from "../modelBenchmark";

const LOG_X_MIN = 0.04;
const LINEAR_X_MIN = 0;
const X_MAX = 3.2;
const LINEAR_EXPANSION_BREAKPOINT = 0.5;
const LINEAR_LOW_RANGE_WEIGHT = 2;
const ATTRACTIVE_COST_CEILING = 1;
const ATTRACTIVE_ECI_FLOOR = 150;
const Y_MIN = 140;
const Y_MAX = 165;
const PLOT_INSET = 3;
const PLOT_RANGE = 94;

const LOG_X_TICKS = [
  0.04, 0.06, 0.08, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 2, 3,
];
const LINEAR_X_TICKS = [0, 0.5, 1, 1.5, 2, 2.5, 3];
const Y_TICKS = [140, 145, 150, 155, 160, 165];

const TAKEAWAYS = [
  {
    icon: "price_change",
    title: "80% in 21 days",
    body: "Luna list price change after launch",
  },
  {
    icon: "compare_arrows",
    title: "≈1.8× task cost",
    body: "Fable vs. Sol at adjacent ECI scores",
  },
  {
    icon: "ssid_chart",
    title: "Leaders disagree",
    body: "Epoch and Arena order the frontier differently",
  },
];

const FEATURED_MODELS = new Set([
  "GPT-5.6 Sol",
  "Claude Fable 5",
]);

const LINEAR_LABEL_OVERRIDES = {
  "GPT-5.6 Luna": { labelOffsetY: -18, labelSide: "east" },
  "Gemini 3.1 Flash-Lite": { labelOffsetY: -14, labelSide: "east" },
  "Claude Haiku 4.5": { labelOffsetY: 14, labelSide: "east" },
  "GLM-5.2": { labelOffsetY: 0, labelSide: "east" },
  "Gemini 3.5 Flash": { labelOffsetY: -20, labelSide: "east" },
  "Claude Sonnet 5": { labelOffsetY: 16, labelSide: "east" },
  "GPT-5.6 Terra": { labelOffsetY: -18, labelSide: "east" },
  "Claude Opus 4.8": { labelOffsetY: 16, labelSide: "east" },
  "Claude Opus 5": { labelOffsetY: -16, labelSide: "west" },
  "GPT-5.6 Sol": { labelOffsetY: -14, labelSide: "east" },
};

function xPercent(cost, scale) {
  const expandedLinearValue = (value) =>
    value <= LINEAR_EXPANSION_BREAKPOINT
      ? value * LINEAR_LOW_RANGE_WEIGHT
      : LINEAR_EXPANSION_BREAKPOINT * LINEAR_LOW_RANGE_WEIGHT +
        (value - LINEAR_EXPANSION_BREAKPOINT);
  const normalized =
    scale === "linear"
      ? (expandedLinearValue(cost) - LINEAR_X_MIN) /
        (expandedLinearValue(X_MAX) - LINEAR_X_MIN)
      : (Math.log10(cost) - Math.log10(LOG_X_MIN)) /
        (Math.log10(X_MAX) - Math.log10(LOG_X_MIN));
  return PLOT_INSET + normalized * PLOT_RANGE;
}

function yPercent(eci) {
  const normalized = (Y_MAX - eci) / (Y_MAX - Y_MIN);
  return PLOT_INSET + normalized * PLOT_RANGE;
}

function formatCost(value) {
  if (value === 0) return "$0";
  if (value < 1) return `$${value.toFixed(value < 0.1 ? 2 : 1)}`;
  return `$${value}`;
}

export default function SceneModelEconomics({ xScale = "log" }) {
  const providerMap = Object.fromEntries(
    MODEL_PROVIDERS.map((provider) => [provider.id, provider]),
  );
  const isLinear = xScale === "linear";
  const xTicks = isLinear ? LINEAR_X_TICKS : LOG_X_TICKS;
  const chartTitleId = `market-chart-title-${xScale}`;
  const chartSummaryId = `market-chart-summary-${xScale}`;
  const xAxisTitle = isLinear
    ? "Standardized task cost (USD · $0–$0.50 expanded 2×)"
    : "Standardized task cost (USD, log scale)";
  const visibleModels = MODEL_BENCHMARK_POINTS;
  const visibleProviders = MODEL_PROVIDERS.filter((provider) =>
    visibleModels.some((model) => model.provider === provider.id),
  );
  const visibleModelSummary = `${visibleModels.length} models · ECI accessed ${BENCHMARK_SNAPSHOT.accessed} · Arena published ${BENCHMARK_SNAPSHOT.arenaPublished}.`;

  return (
    <div className="scene s-market">
      <div className="scene-title s-market-kicker">
        <span className="material-symbols-rounded" aria-hidden="true">
          query_stats
        </span>
        Model economics · {BENCHMARK_SNAPSHOT.accessed} snapshot
      </div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Model economics moved{" "}
        <span className="accent">80% in 21 days.</span>
      </motion.h1>

      <motion.p
        className="s-market-lead"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        OpenAI cut GPT-5.6 Luna&apos;s list price 80% three weeks after launch.
        In the open benchmark snapshot below, near-adjacent intelligence scores
        can still carry materially different standardized task costs.
      </motion.p>

      <motion.section
        className="s-market-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-labelledby={chartTitleId}
      >
        <header className="s-market-card-head">
          <div>
            <div className="s-market-index-source">
              <span>Epoch Capabilities Index · 50+ benchmarks</span>
              <a
                className="s-market-live-link"
                href={BENCHMARK_SOURCES.epochLive}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the live Epoch Capabilities Index source"
              >
                Live source
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_outward
                </span>
              </a>
              <a
                className="s-market-live-link"
                href={BENCHMARK_SOURCES.arena}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the LMArena independent preference cross-check"
              >
                Arena cross-check
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_outward
                </span>
              </a>
            </div>
            <h2 id={chartTitleId}>
              Open capability index vs. standardized task cost
            </h2>
          </div>
          <div className="s-market-legend" aria-label="Model providers">
            {visibleProviders.map((provider) => (
              <span key={provider.id}>
                <i style={{ "--provider-color": provider.color }} />
                {provider.label}
              </span>
            ))}
          </div>
        </header>

        <div className="s-market-scroll-hint" aria-hidden="true">
          Swipe to explore <span aria-hidden="true">→</span>
        </div>

        <div
          className="s-market-chart-scroll"
          role="region"
          aria-label={`Scrollable model intelligence and cost chart (${xScale} scale)`}
          tabIndex="0"
        >
          <div className="s-market-chart-shell">
            <div className="s-market-y-axis-title">
              Epoch Capabilities Index (ECI)
            </div>

            <div
              className="s-market-plot"
              role="img"
              aria-describedby={chartSummaryId}
            >
              <div
                className="s-market-quadrant"
                style={{
                  "--quadrant-right": `${xPercent(
                    ATTRACTIVE_COST_CEILING,
                    xScale,
                  )}%`,
                  "--quadrant-bottom": `${yPercent(ATTRACTIVE_ECI_FLOOR)}%`,
                }}
                aria-hidden="true"
              >
                <span>Most attractive quadrant · ≤ $1/task</span>
              </div>

              {Y_TICKS.map((tick) => (
                <div
                  className="s-market-gridline s-market-gridline-y"
                  style={{ "--tick-y": `${yPercent(tick)}%` }}
                  key={tick}
                  aria-hidden="true"
                >
                  <span>{tick}</span>
                </div>
              ))}

              {xTicks.map((tick) => (
                <div
                  className="s-market-gridline s-market-gridline-x"
                  style={{ "--tick-x": `${xPercent(tick, xScale)}%` }}
                  key={tick}
                  aria-hidden="true"
                >
                  <span>{formatCost(tick)}</span>
                </div>
              ))}

              {visibleModels.map((model, index) => {
                const provider = providerMap[model.provider];
                const labelOverride = isLinear
                  ? LINEAR_LABEL_OVERRIDES[model.name]
                  : null;

                return (
                  <motion.div
                    className={`s-market-point ${
                      FEATURED_MODELS.has(model.name) ? "featured" : ""
                    }`}
                    style={{
                      "--point-x": `${xPercent(model.cost, xScale)}%`,
                      "--point-y": `${yPercent(model.eci)}%`,
                      "--provider-color": provider.color,
                      "--label-y": `${
                        labelOverride?.labelOffsetY ?? model.labelOffsetY
                      }px`,
                    }}
                    initial={{ opacity: 0, scale: 0.35 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.28 + index * 0.035,
                      duration: 0.28,
                    }}
                    key={model.name}
                    aria-hidden="true"
                  >
                    <i />
                    <span
                      className={`s-market-point-label ${
                        labelOverride?.labelSide ?? model.labelSide
                      }`}
                    >
                      {model.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="s-market-x-axis-title">{xAxisTitle}</div>
          </div>
        </div>

        <div className="sr-only">
          <p id={chartSummaryId}>
            The chart plots selected models by Epoch Capabilities Index score
            and independently estimated cost for a fixed uncached workload of
            100,000 input tokens and 20,000 billed output or reasoning tokens.
            ECI scores range from 143 for Claude Haiku 4.5 to 162 for GPT-5.6
            Sol. GPT-5.6 Sol and Claude Fable 5 have adjacent ECI scores, while
            the standardized Fable task costs about 1.8 times as much.
          </p>
          <table>
            <caption>Model benchmark values shown in the chart</caption>
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Epoch Capabilities Index</th>
                <th>Standardized task cost</th>
                <th>LMArena style-controlled rank</th>
              </tr>
            </thead>
            <tbody>
              {visibleModels.map((model) => (
                <tr key={model.name}>
                  <th>{model.name}</th>
                  <td>{providerMap[model.provider].label}</td>
                  <td>{model.eci}</td>
                  <td>${model.cost.toFixed(3)}</td>
                  <td>{model.arenaRank ?? "No exact variant"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="s-market-takeaways">
          {TAKEAWAYS.map((takeaway) => (
            <div key={takeaway.title}>
              <span className="material-symbols-rounded" aria-hidden="true">
                {takeaway.icon}
              </span>
              <p>
                <strong>{takeaway.title}</strong>
                <span>{takeaway.body}</span>
              </p>
            </div>
          ))}
        </div>

        <footer className="s-market-source">
          <span>{visibleModelSummary}</span>
          <span className="s-market-source-links">
            <a
              href={BENCHMARK_SOURCES.epochMethodology}
              target="_blank"
              rel="noreferrer"
            >
              ECI method
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_outward
              </span>
            </a>
            <a
              href={BENCHMARK_SOURCES.epochData}
              target="_blank"
              rel="noreferrer"
            >
              Data + license
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_outward
              </span>
            </a>
            <a
              href={BENCHMARK_SOURCES.arena}
              target="_blank"
              rel="noreferrer"
            >
              Arena data
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_outward
              </span>
            </a>
            <a
              href={BENCHMARK_SOURCES.openaiChangelog}
              target="_blank"
              rel="noreferrer"
            >
              Price change
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_outward
              </span>
            </a>
          </span>
          <span>
            ECI is CC BY 4.0; Arena is an independent CC BY 4.0 cross-check.
            Cost uses 100k uncached input + 20k billed output/reasoning tokens
            at first-party standard rates from{" "}
            <a
              href={BENCHMARK_SOURCES.openaiPricing}
              target="_blank"
              rel="noreferrer"
            >
              OpenAI
            </a>
            ,{" "}
            <a
              href={BENCHMARK_SOURCES.anthropicPricing}
              target="_blank"
              rel="noreferrer"
            >
              Anthropic
            </a>
            ,{" "}
            <a
              href={BENCHMARK_SOURCES.googlePricing}
              target="_blank"
              rel="noreferrer"
            >
              Google
            </a>
            , and{" "}
            <a
              href={BENCHMARK_SOURCES.zaiPricing}
              target="_blank"
              rel="noreferrer"
            >
              Z.AI
            </a>
            . Excludes tools, discounts, regional routing, and speed tiers.
          </span>
        </footer>
      </motion.section>
    </div>
  );
}
