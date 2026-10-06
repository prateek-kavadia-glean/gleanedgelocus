import { motion, useReducedMotion } from "framer-motion";

const PROOFS = [
  {
    id: "sol",
    eyebrow: "Frontier comparison",
    model: "GPT‑5.6 Sol",
    reference: "Claude Opus 4.8",
    intelligence: "Generally Smarter",
    intelligenceDetail: "Widely considered",
    intelligenceSymbol: "↑",
    cost: "Lower",
    summary:
      "GPT‑5.6 Sol is widely considered smarter than Claude Opus 4.8, at lower cost per completed task.",
  },
  {
    id: "terra",
    eyebrow: "Everyday task comparison",
    model: "GPT‑5.6 Terra",
    reference: "Claude Sonnet 5",
    intelligence: "Generally Smarter",
    intelligenceDetail: "Widely considered",
    intelligenceSymbol: "↑",
    cost: "Much lower",
    summary:
      "GPT‑5.6 Terra is widely considered smarter than Claude Sonnet 5, at much lower cost per completed task.",
  },
  {
    id: "glm",
    eyebrow: "Open-model default contender",
    model: "GLM‑5.2",
    reference: "GPT‑5.4",
    intelligence: "Similar",
    intelligenceDetail: "Intelligence",
    intelligenceSymbol: "≈",
    cost: "Much lower",
    summary:
      "GLM‑5.2 offers intelligence similar to GPT‑5.4, at much lower cost per completed task.",
  },
];

export default function SceneModelFlexibility() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay, y = 8) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="scene s-model-flex">
      <motion.div className="scene-title s-model-shift-kicker" {...reveal(0, -6)}>
        The model market moved
      </motion.div>

      <motion.h1
        id="model-flex-title"
        className="hero-title s-model-shift-title"
        {...reveal(0.04, 10)}
      >
        Smarter models can now cost{" "}
        <span className="s-model-shift-underline">less</span>.
        <span className="accent">Model flexibility is becoming the expectation.</span>
      </motion.h1>

      <motion.p
        id="model-flex-summary"
        className="s-model-shift-intro"
        {...reveal(0.1)}
      >
        Three recent comparisons from August 2026 make the shift concrete.
      </motion.p>

      <motion.section
        className="s-model-shift-market"
        aria-labelledby="model-flex-title"
        aria-describedby="model-flex-summary"
        {...reveal(0.15, 14)}
      >
        {PROOFS.map((proof, index) => (
          <motion.article
            className={`s-model-shift-proof s-model-shift-proof--${proof.id}`}
            aria-label={proof.summary}
            key={proof.id}
            {...reveal(0.2 + index * 0.08, 10)}
          >
            <header>
              <small>{proof.eyebrow}</small>
            </header>

            <div className="s-model-shift-model-line">
              <h2>{proof.model}</h2>
            </div>

            <div className="s-model-shift-versus">
              <span>vs.</span>
              <strong>{proof.reference}</strong>
            </div>

            <div className="s-model-shift-outcomes">
              <div>
                <i aria-hidden="true">{proof.intelligenceSymbol}</i>
                <strong>{proof.intelligence}</strong>
                <span>{proof.intelligenceDetail}</span>
              </div>
              <div>
                <i aria-hidden="true">↓</i>
                <strong>{proof.cost}</strong>
                <span>Cost per completed task</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>

      <motion.div
        className="s-model-shift-leadership"
        role="note"
        {...reveal(0.46)}
      >
        <span aria-hidden="true" />
        <div>
          <span className="material-symbols-rounded" aria-hidden="true">
            published_with_changes
          </span>
          <strong>Leadership can change with every model release</strong>
        </div>
        <span aria-hidden="true" />
      </motion.div>

      <motion.aside
        className="s-model-shift-glean"
        aria-label="Why Glean"
        {...reveal(0.52, 10)}
      >
        <div className="s-model-shift-glean-content">
          <div className="s-model-shift-glean-message">
            <div className="s-model-shift-glean-head">
              <small>Why Glean</small>
            </div>
            <h2>Change the model. Keep the brain.</h2>
          </div>

          <div className="s-model-shift-glean-routing">
            <span
              className="material-symbols-rounded s-model-shift-router-mark"
              aria-hidden="true"
            >
              alt_route
            </span>
            <p>
              By default, Glean selects the best-fit approved model, balancing
              quality and cost.{" "}
              <span className="s-model-shift-routing-choice">
                Users can manually choose from admin-enabled models, and admins
                can set spend limits.
              </span>
            </p>
          </div>
        </div>
      </motion.aside>

      <p className="s-model-shift-note">
        Directional market view as of August 3 2026. Performance and cost vary by
        workload, configuration, and provider terms. Validate against your own
        use cases.
      </p>
    </div>
  );
}
