import { motion } from "framer-motion";

const OPENAI_CHANGELOG_URL = "https://developers.openai.com/api/docs/changelog";
const ANTHROPIC_MIGRATION_URL =
  "https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5";
const GEMINI_CHANGELOG_URL = "https://ai.google.dev/gemini-api/docs/changelog";

const LOCKED_LAYERS = [
  { icon: "smart_toy", label: "Agents & experience" },
  { icon: "prompt_suggestion", label: "Prompts & tool calls" },
  { icon: "database", label: "Context & retrieval" },
  { icon: "policy", label: "Policy & governance" },
  { icon: "fact_check", label: "Evals & release gates" },
];

const STABLE_LAYERS = [
  { icon: "database", label: "Enterprise context" },
  { icon: "lock", label: "Permissions" },
  { icon: "policy", label: "Governance" },
  { icon: "fact_check", label: "Workload evals" },
];

const PROVIDERS = [
  { name: "OpenAI", className: "openai" },
  { name: "Anthropic", className: "anthropic" },
  { name: "Google", className: "google" },
  { name: "More", className: "more" },
];

const SHOCKS = [
  {
    icon: "price_change",
    title: "Economics move",
    body: "GPT-5.6 Luna list pricing fell 80% only 21 days after launch.",
    href: OPENAI_CHANGELOG_URL,
    source: "OpenAI changelog",
  },
  {
    icon: "code_blocks",
    title: "Interfaces drift",
    body: "A “drop-in” model upgrade can still change parameters and token counts.",
    href: ANTHROPIC_MIGRATION_URL,
    source: "Anthropic migration guide",
  },
  {
    icon: "event_busy",
    title: "Models retire",
    body: "Schemas change and model generations reach end of service.",
    href: GEMINI_CHANGELOG_URL,
    source: "Gemini changelog",
  },
  {
    icon: "verified_user",
    title: "Controls vary",
    body: "Retention, residency, capacity, and approved-use rules differ by model.",
  },
];

export default function SceneLockIn() {
  return (
    <div className="scene s-lockin">
      <div className="scene-title s-lockin-kicker">
        <span className="material-symbols-rounded" aria-hidden="true">
          lock_open_right
        </span>
        The hidden model lock-in tax
      </div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        The best model will change.{" "}
        <span className="accent">Your platform shouldn&apos;t have to.</span>
      </motion.h1>

      <motion.p
        className="s-lockin-lead"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        Lock-in turns market movement into migration work. Build real
        enterprise-grade context with real governance, then make models the
        commodity layer.
      </motion.p>

      <motion.a
        className="s-lockin-proof"
        href={OPENAI_CHANGELOG_URL}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.14, duration: 0.4 }}
      >
        <span className="s-lockin-proof-value">80%</span>
        <span>
          price change in <strong>21 days</strong>
          <small>GPT-5.6 Luna list pricing · July 2026</small>
        </span>
        <span className="material-symbols-rounded" aria-hidden="true">
          arrow_outward
        </span>
      </motion.a>

      <div className="s-lockin-stacks">
        <motion.section
          className="s-lockin-stack s-lockin-stack-locked"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <header>
            <span className="material-symbols-rounded" aria-hidden="true">
              lock
            </span>
            <span>
              <small>Single-family stack</small>
              <strong>Everything moves together</strong>
            </span>
          </header>

          <div className="s-lockin-layer-list">
            {LOCKED_LAYERS.map((layer, index) => (
              <div key={layer.label}>
                <span className="material-symbols-rounded" aria-hidden="true">
                  {layer.icon}
                </span>
                <span>{layer.label}</span>
                <em>{index === 0 ? "vendor surface" : "coupled"}</em>
              </div>
            ))}
          </div>

          <footer>
            <span className="material-symbols-rounded" aria-hidden="true">
              engineering
            </span>
            A model switch becomes a stack migration.
          </footer>
        </motion.section>

        <motion.section
          className="s-lockin-stack s-lockin-stack-open"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <header>
            <span className="material-symbols-rounded" aria-hidden="true">
              hub
            </span>
            <span>
              <small>Glean architecture</small>
              <strong>Keep the control plane stable</strong>
            </span>
          </header>

          <div className="s-lockin-stable-plane">
            {STABLE_LAYERS.map((layer) => (
              <div key={layer.label}>
                <span className="material-symbols-rounded" aria-hidden="true">
                  {layer.icon}
                </span>
                <span>{layer.label}</span>
              </div>
            ))}
          </div>

          <div className="s-lockin-router">
            <span className="material-symbols-rounded" aria-hidden="true">
              alt_route
            </span>
            <strong>Policy-driven routing</strong>
            <span>quality · cost · latency · availability</span>
          </div>

          <div className="s-lockin-provider-row" aria-label="Replaceable model providers">
            {PROVIDERS.map((provider) => (
              <span className={provider.className} key={provider.name}>
                {provider.name}
              </span>
            ))}
          </div>

          <footer>
            <span className="material-symbols-rounded" aria-hidden="true">
              published_with_changes
            </span>
            Change the model, not the context architecture.
          </footer>
        </motion.section>
      </div>

      <motion.div
        className="s-lockin-shocks"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.46 }}
      >
        {SHOCKS.map((shock) => {
          const content = (
            <>
              <span className="material-symbols-rounded" aria-hidden="true">
                {shock.icon}
              </span>
              <span>
                <strong>{shock.title}</strong>
                <small>{shock.body}</small>
              </span>
              {shock.href && (
                <span className="material-symbols-rounded s-lockin-shock-link" aria-hidden="true">
                  arrow_outward
                </span>
              )}
            </>
          );

          return shock.href ? (
            <a
              href={shock.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${shock.title}: ${shock.body}. Source: ${shock.source}`}
              key={shock.title}
            >
              {content}
            </a>
          ) : (
            <div key={shock.title}>{content}</div>
          );
        })}
      </motion.div>
    </div>
  );
}
