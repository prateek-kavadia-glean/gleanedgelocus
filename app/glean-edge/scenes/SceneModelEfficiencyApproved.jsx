import { motion, useReducedMotion } from "framer-motion";
import {
  BenchmarkSource,
  GLEAN_COWORK_BENCHMARK as BENCHMARK,
} from "../benchmarkStory.jsx";

const PANELS = [
  {
    id: "rate",
    eyebrow: "Blended cost per million tokens",
    claim: `Glean averages ${BENCHMARK.blendedTokenCostReduction} lower`,
    ticks: ["$0.80", "$0.60", "$0.40", "$0.20", "$0"],
    bars: [
      {
        label: "Glean",
        value: BENCHMARK.gleanBlendedCostPerMillion,
        height: 57.5,
        kind: "glean",
      },
      {
        label: "Claude Cowork",
        value: BENCHMARK.coworkBlendedCostPerMillion,
        height: 85,
        kind: "cowork",
      },
    ],
  },
  {
    id: "tokens",
    eyebrow: "Token efficiency",
    claim: `Glean consumes ${BENCHMARK.tokenReduction} fewer tokens`,
    ticks: ["8M", "6M", "4M", "2M", "0"],
    bars: [
      {
        label: "Glean",
        value: BENCHMARK.gleanTokens,
        height: 16.25,
        kind: "glean",
      },
      {
        label: "Claude Cowork",
        value: BENCHMARK.coworkTokens,
        height: 55,
        kind: "cowork",
      },
    ],
  },
  {
    id: "task",
    eyebrow: "Cost per task",
    claim: `Glean saves ${BENCHMARK.taskCostReduction}`,
    ticks: ["$4", "$3", "$2", "$1", "$0"],
    bars: [
      {
        label: "Glean",
        value: BENCHMARK.gleanTaskCost,
        height: 14.5,
        kind: "glean",
      },
      {
        label: "Claude Cowork",
        value: BENCHMARK.coworkTaskCost,
        height: 74.5,
        kind: "cowork",
      },
    ],
  },
];

function ApprovedPanel({ panel, index, prefersReducedMotion }) {
  return (
    <article className={`s-approved-panel s-approved-panel--${panel.id}`}>
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { delay: 0.08 + index * 0.07, duration: 0.42 }
        }
      >
        <h2>{panel.eyebrow}</h2>
        <p>{panel.claim}</p>
      </motion.header>

      <div className="s-approved-chart">
        <div className="s-approved-y-axis" aria-hidden="true">
          {panel.ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="s-approved-plot">
          <div className="s-approved-grid" aria-hidden="true">
            {panel.ticks.map((tick) => (
              <i key={tick} />
            ))}
          </div>

          <div className="s-approved-bars">
            {panel.bars.map((bar, barIndex) => (
              <div
                className={`s-approved-bar-column s-approved-bar-column--${bar.kind}`}
                key={bar.label}
                style={{ "--approved-bar-height": `${bar.height}%` }}
              >
                <motion.strong
                  className="s-approved-value"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          delay: 0.39 + index * 0.08 + barIndex * 0.05,
                          duration: 0.38,
                        }
                  }
                >
                  {bar.value}
                </motion.strong>
                <motion.i
                  className="s-approved-bar"
                  aria-hidden="true"
                  initial={prefersReducedMotion ? false : { height: 0 }}
                  animate={{ height: `${bar.height}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          delay: 0.2 + index * 0.07 + barIndex * 0.04,
                          duration: 0.62,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                />
                <span className="s-approved-x-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SceneModelEfficiencyApproved() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay, y = 8) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay, duration: 0.44, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="scene s-efficiency s-efficiency-approved">
      <motion.h1 className="hero-title s-approved-title" {...reveal(0, 10)}>
        Versus Claude Cowork, two efficiency gains{" "}
        <span>
          compound into <strong>81% lower token cost per task.</strong>
        </span>
      </motion.h1>

      <motion.p className="s-approved-lead" {...reveal(0.05)}>
        Glean combines model flexibility with an efficient, accurate context
        layer.
      </motion.p>

      <motion.section
        className="s-approved-board"
        aria-label="Glean benchmark: blended token cost times token efficiency equals cost per task"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {PANELS.map((panel, index) => (
          <ApprovedPanel
            key={panel.id}
            panel={panel}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}

        <span className="s-approved-operator s-approved-operator--multiply" aria-hidden="true">
          ×
        </span>
        <span className="s-approved-operator s-approved-operator--equals" aria-hidden="true">
          =
        </span>
      </motion.section>

      <motion.aside className="s-approved-quality" {...reveal(0.5, 7)}>
        <small>Quality check</small>
        <strong>{BENCHMARK.gleanPreference}</strong>
        <span>Glean preferred</span>
        <p>
          Overall preference: which response graders would actually use on the
          job. Also assessed: correctness, completeness, and interaction quality.
        </p>
      </motion.aside>

      <BenchmarkSource className="s-approved-source" />
    </div>
  );
}
