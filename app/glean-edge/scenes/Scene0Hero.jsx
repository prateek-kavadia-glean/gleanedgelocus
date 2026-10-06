import { motion } from "framer-motion";

const STATS = [
  { value: "~30%", label: "Fewer tokens end-to-end" },
  { value: "~2.9×", label: "More accurate" },
  { value: "~2.5×", label: "More preferred" },
];

export default function Scene0Hero() {
  return (
    <div className="scene s0">
      <motion.div
        className="s0-badge"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="dot" />
        An interactive briefing
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <span className="s0-hero-primary">
          The risk isn&apos;t choosing Claude or ChatGPT.
        </span>
        <span className="s0-hero-emphasis">
          <span className="s0-hero-risk-line">
            The real risk is feeding the model{" "}
            <span className="s0-hero-risk">poor context</span>
          </span>
          <wbr /> - and being unable to{" "}
          <em className="s0-hero-switch">switch</em>.
        </span>
      </motion.h1>

      <section
        className="s0-content-frame"
        aria-label="Glean context, model flexibility, and benchmark results"
      >
      <motion.div
        className="hero-sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <span className="hero-sub-lead">
          Your context architecture should outlast today&apos;s model winner.
        </span>

        <span className="s0-resolution">
          <strong>Glean solves both.</strong> Glean indexes full enterprise
          context, builds a knowledge graph to understand what&apos;s actually
          relevant, and then routes each workload to the best-fit approved model
          for the task. With real security and governance.
        </span>
      </motion.div>

      <motion.div
        className="s0-flex-visual"
        role="img"
        aria-label="Stable indexed enterprise context and governance connect directly to replaceable OpenAI, Anthropic, Google, or open-source models."
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.42 }}
      >
        <div className="s0-flex-head">
          <span className="s0-flex-eyebrow">
            <span className="material-symbols-rounded" aria-hidden="true">
              swap_calls
            </span>
            Model flexibility
          </span>
          <strong>Context persists and builds. Models compete.</strong>
          <span className="s0-flex-payoff">
            Swap models, not your entire platform.
          </span>
        </div>

        <div className="s0-flex-rail">
          <div className="s0-flex-foundation">
            <span className="material-symbols-rounded" aria-hidden="true">
              database
            </span>
            <p>
              <small>Stable foundation</small>
              <strong>Indexed context + governance</strong>
              <span>Permissions · Governance · Limits · Auditability</span>
            </p>
          </div>

          <div className="s0-flex-connector" aria-hidden="true">
            <span className="material-symbols-rounded">arrow_forward</span>
          </div>

          <div className="s0-flex-commodity">
            <small>Commodity model layer</small>
            <div className="s0-flex-providers">
              <span
                className="s0-flex-provider"
                style={{ "--provider-color": "#f4f5fb", "--provider-delay": "0s" }}
              >
                OpenAI
              </span>
              <span
                className="s0-flex-provider"
                style={{ "--provider-color": "#d5795c", "--provider-delay": "2s" }}
              >
                Anthropic
              </span>
              <span
                className="s0-flex-provider"
                style={{ "--provider-color": "#37b86b", "--provider-delay": "4s" }}
              >
                Google
              </span>
              <span
                className="s0-flex-provider"
                style={{
                  "--provider-color": "#d8fd49",
                  "--provider-delay": "6s",
                }}
              >
                Open source
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="s0-stats"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.62 } },
        }}
      >
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            className="s0-stat"
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="s0-stat-value">{s.value}</span>
            <span className="s0-stat-label">{s.label}</span>
            <span className="s0-stat-qualifier">Same model</span>
          </motion.div>
        ))}
      </motion.div>
      </section>

      <motion.div
        className="s0-source"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.6 }}
      >
        Benchmark:{" "}
        <a
          href="https://www.glean.com/blog/cowork-mcp-eval"
          target="_blank"
          rel="noreferrer"
        >
          Glean vs. off-the-shelf MCP →
        </a>
      </motion.div>

      <motion.div
        className="s0-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        Use <kbd>→</kbd> / <kbd>←</kbd> to navigate · <kbd>space</kbd> to advance
      </motion.div>
    </div>
  );
}
