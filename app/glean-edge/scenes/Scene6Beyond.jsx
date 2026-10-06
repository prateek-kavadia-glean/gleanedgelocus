import { motion } from "framer-motion";
import { BEYOND_CARDS } from "../data";

export default function Scene6Beyond() {
  return (
    <div className="scene s6">
      <div className="scene-title">Beyond search</div>
      <motion.h1
        className="hero-title"
        style={{ fontSize: "clamp(26px, 3vw, 38px)" }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Saving tokens is one headline.{" "}
        <span className="accent">
          Here&apos;s the moat:
        </span>
      </motion.h1>

      <div className="s6-grid">
        {BEYOND_CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            className="s6-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="s6-card-icon">
              <span className="material-symbols-rounded">{c.icon}</span>
            </div>
            {c.pillar && (
              <span className="s6-card-pillar">{c.pillar}</span>
            )}
            <h3 className="s6-card-title">{c.title}</h3>
            <p className="s6-card-body">
              {c.body}
              {c.bodyLinks && (
                <>
                  {" "}
                  <span className="s6-card-body-links">
                    {c.bodyLinks.map((link, linkIndex) => (
                      <span className="s6-card-body-link-entry" key={link.href}>
                        {linkIndex > 0 && (
                          <span
                            className="s6-card-body-link-separator"
                            aria-hidden="true"
                          >
                            ·
                          </span>
                        )}
                        <a
                          className="s6-card-body-link"
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                          <span
                            className="material-symbols-rounded"
                            aria-hidden="true"
                          >
                            arrow_outward
                          </span>
                        </a>
                      </span>
                    ))}
                  </span>
                </>
              )}
            </p>
            <div className="s6-card-detail">
              {c.details.map(([icon, text]) => (
                <div className="row" key={text}>
                  <span className="material-symbols-rounded">{icon}</span>
                  {text}
                </div>
              ))}
              {c.link && (
                <a
                  className="s6-card-link"
                  href={c.link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.link.label}
                  <span className="material-symbols-rounded">arrow_outward</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="s6-tagline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Federated search is lightweight plumbing. <strong>Glean is the platform with an <span className="s6-tagline-emphasis">enterprise brain</span>.</strong>
      </motion.div>

      <motion.div
        className="s6-subtagline"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5 }}
      >
        Glean supports MCP as a secondary context source, but indexes whenever possible.
      </motion.div>
    </div>
  );
}
