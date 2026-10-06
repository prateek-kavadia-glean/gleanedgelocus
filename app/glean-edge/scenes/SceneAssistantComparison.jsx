import { motion, useReducedMotion } from "framer-motion";

const OPTIONS = [
  {
    id: "glean",
    name: "Glean",
    role: "Cross-system work platform",
    icon: "hub",
    className: "s-assistant-panel--glean",
    summary:
      "Default for broad business workflows: search, assistant, no-code agents, and admin-enabled model choice in one surface.",
    context:
      "Pre-indexed enterprise and personal graphs bring permission-aware, user-relevant context across connected systems.",
    governance:
      "Source-aware retrieval, sensitive-data policies, moderated agents, scoped actions, human approvals, and audit.",
  },
  {
    id: "claude",
    name: "Claude",
    role: "Excellent assistant + model",
    icon: "forum",
    className: "s-assistant-claude",
    summary:
      "Keep established workflows, especially for teams that strongly prefer the Claude interface.",
    context:
      "For Claude-first or engineering teams, supported Glean MCP can provide enterprise context while Claude stays the front end.",
    governance:
      "Validate the selected plan, connector identity and permissions, retention, and tool or action access.",
  },
  {
    id: "Copilot",
    name: "Copilot",
    role: "Existing productivity workflow",
    icon: "workspaces",
    className: "s-assistant-copilot",
    summary:
      "Keep it where its existing work surface fits the team’s daily workflow.",
    context:
      "Source coverage and permission behavior depend on tenant and connector setup; keep source sharing hygiene tight.",
    governance:
      "Review tenant policies, source permissions, retention, and action scope. Do not assume an assistant fixes overshared content.",
  },
];

const CHECKS = [
  ["Experience", "summary"],
  ["Context", "context"],
  ["Governance", "governance"],
];

export default function SceneAssistantComparison() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="scene s-assistant-comparison">
      <div className="scene-title s-assistant-kicker">Claude vs. Copilot | Why Glean</div>

      <motion.h1 className="hero-title s-assistant-title" {...reveal()}>
        One governed work platform. <span className="accent">Assistant choice stays open.</span>
      </motion.h1>

      <p className="s-assistant-intro">
        Glean is the cross-system context and agent platform, not a claim that
        teams must replace a model they already like.
      </p>

      <section className="s-assistant-grid" aria-label="Glean, Claude, and Copilot comparison">
        {OPTIONS.map((option, index) => (
          <motion.article
            className={`s-assistant-panel ${option.className}`}
            key={option.id}
            {...reveal(0.08 + index * 0.08)}
          >
            <header className="s-assistant-panel-head">
              <span className="material-symbols-rounded" aria-hidden="true">
                {option.icon}
              </span>
              <div>
                <h2>{option.name}</h2>
                <span className="s-assistant-role">{option.role}</span>
              </div>
            </header>
            <dl>
              {CHECKS.map(([label, field]) => (
                <div className="s-assistant-row" key={field}>
                  <dt>{label}</dt>
                  <dd>{option[field]}</dd>
                </div>
              ))}
            </dl>
          </motion.article>
        ))}
      </section>

      <aside className="s-assistant-glean" aria-label="Recommended rollout">
        <div className="s-assistant-glean-label">
          <span className="material-symbols-rounded" aria-hidden="true">
            route
          </span>
          <strong>For this greenfield</strong>
        </div>
        <p>
          Make Glean the default for broad business work. Keep Claude and Copilot
          for teams with established workflows; use Glean MCP where Claude users
          want to keep their familiar front end.
        </p>
      </aside>

      <p className="s-assistant-note">
        Confirm the exact plan, tenant, connector coverage, and permission
        behavior with IT. Glean does not repair source-system oversharing.
      </p>
    </div>
  );
}
