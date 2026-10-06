import { motion, useReducedMotion } from "framer-motion";

const GOVERNANCE_STAGES = [
  {
    number: "01",
    icon: "key",
    label: "Source permissions",
    title: "Access follows the user",
    body: "Document-level permissions carry into retrieval. End users do not set up access one connector at a time.",
  },
  {
    number: "02",
    icon: "shield_lock",
    label: "Sensitive data",
    title: "Protect what matters",
    body: "Mark confidential and PII data, then apply usage, restricted-topic, and DLP controls.",
  },
  {
    number: "03",
    icon: "tune",
    label: "Agent governance",
    title: "Make agents easy to share",
    body: "Teams create agents in natural language. Admins or moderators govern who can publish them.",
  },
  {
    number: "04",
    icon: "fact_check",
    label: "Action governance",
    title: "People approve sensitive writes",
    body: "Set granular action permissions. Require confirmation before a write; keep an audit trail.",
  },
];

const APPROVAL_STEPS = [
  { icon: "call", label: "Gong call + opportunity" },
  { icon: "edit_note", label: "Agent drafts CRM fields" },
  { icon: "how_to_reg", label: "Person confirms" },
  { icon: "history", label: "Audited write-back" },
];

export default function SceneGovernance() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="scene s-governance">
      <div className="scene-title s-governance-kicker">Security + rollout</div>

      <motion.h1 className="hero-title s-governance-title" {...reveal()}>
        Govern access. <span className="accent">Keep work moving.</span>
      </motion.h1>

      <p className="s-governance-intro">
        One admin-managed foundation protects source data and governs agent
        actions without adding an IT gate to every workflow.
      </p>

      <ol className="s-governance-flow" aria-label="Glean governance controls">
        {GOVERNANCE_STAGES.map((stage, index) => (
          <motion.li
            className="s-governance-stage"
            key={stage.number}
            {...reveal(0.08 + index * 0.07)}
          >
            <div className="s-governance-stage-top">
              <span className="s-governance-number">{stage.number}</span>
              <span className="material-symbols-rounded" aria-hidden="true">
                {stage.icon}
              </span>
            </div>
            <span className="s-governance-label">{stage.label}</span>
            <h2>{stage.title}</h2>
            <p>{stage.body}</p>
          </motion.li>
        ))}
      </ol>

      <motion.section
        className="s-governance-example"
        aria-label="Human-approved Salesforce update example"
        {...reveal(0.34)}
      >
        <div className="s-governance-example-heading">
          <span className="material-symbols-rounded" aria-hidden="true">
            workflow
          </span>
          <div>
            <small>One governed workflow</small>
            <strong>From conversation to CRM update</strong>
          </div>
        </div>
        <ol className="s-governance-example-flow">
          {APPROVAL_STEPS.map((step, index) => (
            <li key={step.label}>
              {index > 0 && (
                <span className="material-symbols-rounded s-governance-arrow" aria-hidden="true">
                  arrow_forward
                </span>
              )}
              <span className="s-governance-example-item">
                <span className="material-symbols-rounded" aria-hidden="true">
                  {step.icon}
                </span>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </motion.section>

      <aside className="s-governance-rollout" aria-label="Typical implementation effort">
        <div className="s-governance-rollout-lead">
          <span className="material-symbols-rounded" aria-hidden="true">
            settings_suggest
          </span>
          <div>
            <strong>Low ongoing IT lift</strong>
            <p>Configure centrally; keep granular controls when you need them.</p>
          </div>
        </div>
        <div className="s-governance-stat">
          <strong>&lt;15 min</strong>
          <span>Most connectors to set up</span>
        </div>
        <div className="s-governance-stat">
          <strong>~1–2 h / mo</strong>
          <span>Typical IT involvement</span>
        </div>
      </aside>

      <p className="s-governance-note">
        Typical estimates; connector complexity and rollout scope change actual
        effort.
      </p>
    </div>
  );
}
