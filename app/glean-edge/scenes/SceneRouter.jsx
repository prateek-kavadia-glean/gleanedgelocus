import { motion } from "framer-motion";

const DRIFT_EXAMPLES = [
  { icon: "summarize", label: "Summarize project thread" },
  { icon: "query_stats", label: "Analyze renewal risk" },
];

const ROUTES = [
  {
    className: "efficient",
    from: "Routine",
    to: "Efficient",
    icon: "bolt",
    providers: ["Google", "Open Source", "OpenAI"],
  },
  {
    className: "balanced",
    from: "Complex",
    to: "Balanced",
    icon: "tune",
    providers: ["Open Source", "OpenAI", "Google"],
  },
  {
    className: "frontier",
    from: "Challenging",
    to: "Frontier",
    icon: "diamond",
    providers: ["Anthropic", "OpenAI"],
  },
];

const POLICY_INPUTS = [
  { icon: "fact_check", label: "Quality floor" },
  { icon: "payments", label: "Cost ceiling" },
  { icon: "speed", label: "Latency target" },
  { icon: "health_and_safety", label: "Enabled by admin" },
];

export default function SceneRouter() {
  return (
    <div className="scene s-router">
      <div className="scene-title s-router-bonus">
        <span className="s-router-bonus-count">Open</span>
        <span className="material-symbols-rounded" aria-hidden="true">
          alt_route
        </span>
        <span>Multi-model routing</span>
      </div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Route to the right model.{" "}
        <span className="accent">Keep your options open.</span>
      </motion.h1>

      <motion.p
        className="s-router-lead"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        With context and governance separated from the model layer, Auto can
        match each workload to the most efficient approved model that clears the
        bar without turning today&apos;s model choice into tomorrow&apos;s platform
        constraint.
      </motion.p>

      <motion.div
        className="s-router-result"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.4 }}
      >
        <span className="material-symbols-rounded">account_balance</span>
        <strong>Executive result</strong>
        <span className="s-router-result-copy">
          Use frontier capability where it earns its cost.
          <span className="s-router-result-impact">
            Keep the freedom to adopt the next best-fit model without rebuilding
            the context layer.
          </span>
        </span>
      </motion.div>

      <div className="s-router-board">
        <motion.section
          className="s-router-panel s-router-before"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="s-router-panel-head">
            <span className="material-symbols-rounded">person_alert</span>
            Single-family by default
          </div>
          <div className="s-router-before-callout">
            <div className="s-router-before-title">Default lock-in</div>
            <p>
              One model family quietly becomes the answer to every workload.
            </p>
          </div>
          <div className="s-router-example-list">
            {DRIFT_EXAMPLES.map((example, i) => (
              <motion.div
                className="s-router-example"
                key={example.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.06, duration: 0.32 }}
              >
                <span className="material-symbols-rounded">{example.icon}</span>
                <strong>{example.label}</strong>
                <span className="s-router-drift-arrow" aria-hidden="true">→</span>
                <em>One family</em>
              </motion.div>
            ))}
          </div>
          <div className="s-router-waste-note">
            <span className="material-symbols-rounded">warning</span>
            Every task inherits one vendor&apos;s economics, roadmap, and
            tradeoffs.
          </div>
        </motion.section>

        <motion.section
          className="s-router-hub"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="s-router-flow-arrow left" aria-hidden="true">
            <span className="material-symbols-rounded">arrow_forward</span>
          </span>
          <span className="s-router-flow-arrow right" aria-hidden="true">
            <span className="material-symbols-rounded">arrow_forward</span>
          </span>
          <div className="s-router-hub-rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="s-router-hub-kicker">Policy layer</div>
          <div className="s-router-hub-core">
            <span className="material-symbols-rounded">route</span>
            <strong>
              Glean Auto
              <br />
              Router
            </strong>
            <em>best-fit approved model, per task</em>
          </div>
        </motion.section>

        <motion.section
          className="s-router-panel s-router-after"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="s-router-panel-head">
            <span className="material-symbols-rounded">admin_panel_settings</span>
            Open auto router
          </div>
          <div className="s-router-policy-note">
            <strong>Best-fit model. No family lock-in.</strong>
            <span>
              Premium and manual choices stay available when needed.
            </span>
          </div>
          <div className="s-router-policy-inputs" aria-label="Routing policy inputs">
            {POLICY_INPUTS.map((input) => (
              <span key={input.label}>
                <span className="material-symbols-rounded" aria-hidden="true">
                  {input.icon}
                </span>
                {input.label}
              </span>
            ))}
          </div>
          <div className="s-router-routes">
            {ROUTES.map((route, i) => (
              <motion.div
                className={`s-router-route ${route.className}`}
                key={route.from}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.09, duration: 0.36 }}
              >
                <div className="s-router-route-top">
                  <span className="material-symbols-rounded">{route.icon}</span>
                  <div className="s-router-route-copy">
                    <div className="s-router-route-titleline">
                      <strong>{route.from}</strong>
                      <span aria-hidden="true">→</span>
                      <em>{route.to}</em>
                    </div>
                    <div className="s-router-provider-pills">
                      {route.providers.map((provider) => (
                        <span key={provider}>{provider}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
