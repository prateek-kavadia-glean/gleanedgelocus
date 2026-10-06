import { useState } from "react";
import { motion } from "framer-motion";
import { GLEAN_COWORK_BENCHMARK as BENCHMARK } from "../benchmarkStory.jsx";
import { TAKEAWAY_STATEMENTS, TAKEAWAY_PIPELINE, CUSTOMER_LOGOS } from "../data";

function Dot({ delay, duration }) {
  return (
    <motion.div
      className="s7-dot"
      initial={{ left: "0%", opacity: 0 }}
      animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.1, 0.9, 1],
      }}
    />
  );
}

export default function Scene7Takeaway() {
  return (
    <div className="scene s7">
      <div className="s7-statements">
        {TAKEAWAY_STATEMENTS.map((s, i) => (
          <motion.div
            key={i}
            className="s7-statement"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3 + i * 0.55,
              duration: 0.55,
              type: "spring",
              stiffness: 110,
              damping: 16,
            }}
          >
            {s.text} <span className="accent">{s.accent}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="s7-pipeline"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6 }}
      >
        {TAKEAWAY_PIPELINE.map((stage, i) => (
          <div
            key={stage.label}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <motion.div
              className={[
                "s7-stage",
                stage.kind ? `s7-stage-${stage.kind}` : null,
              ]
                .filter(Boolean)
                .join(" ")}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.3 + i * 0.18, duration: 0.4 }}
            >
              <span className="material-symbols-rounded s7-stage-icon">
                {stage.icon}
              </span>
              <span className="s7-stage-label">{stage.label}</span>
              {stage.supplement && (
                <span className="s7-stage-supplement">
                  <span aria-hidden="true">+</span> {stage.supplement}
                </span>
              )}
            </motion.div>
            {i < TAKEAWAY_PIPELINE.length - 1 && (
              <div className="s7-connector">
                <Dot delay={3 + i * 0.6} duration={2.0} />
                <Dot delay={3.5 + i * 0.6} duration={2.2} />
                <Dot delay={4.1 + i * 0.6} duration={1.9} />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <motion.div
        className="s7-logos"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.95, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="s7-logos-caption">
          Trusted by <span className="accent">hundreds</span> of the world&apos;s leading organizations
        </div>

        <LogoMarquee rows={CUSTOMER_LOGOS} />

        <div className="s7-stories">
          Read how{" "}
          <a
            href="https://www.glean.com/resources/customer-stories/confluent"
            target="_blank"
            rel="noreferrer"
          >
            Confluent
          </a>
          ,{" "}
          <a
            href="https://www.glean.com/resources/customer-stories/wealthsimple"
            target="_blank"
            rel="noreferrer"
          >
            Wealthsimple
          </a>
          ,{" "}
          <a
            href="https://www.glean.com/resources/customer-stories/zillow"
            target="_blank"
            rel="noreferrer"
          >
            Zillow
          </a>
          , and{" "}
          <a
            href="https://www.glean.com/resources/customer-stories/databricks"
            target="_blank"
            rel="noreferrer"
          >
            Databricks
          </a>{" "}
          chose Glean;{" "}
          <a
            href="https://www.glean.com/resources/customer-stories"
            target="_blank"
            rel="noreferrer"
            className="s7-stories-all"
          >
            see all customer stories →
          </a>
        </div>

        <div className="s7-stories s7-benchmark">
          Benchmark:{" "}
          <a
            href={BENCHMARK.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="s7-stories-all"
          >
            Glean saves 81% on token costs vs Cowork - Aug 2026 →
          </a>
        </div>
      </motion.div>

      <motion.div
        className="s7-closer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.45, duration: 0.55 }}
      >
        Are you standardizing on a single model family,{" "}
        <strong>or on a governed Work AI architecture?</strong>
      </motion.div>
    </div>
  );
}

function LogoMarquee({ rows }) {
  return (
    <div className="s7-marquee">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`s7-marquee-row ${rowIdx % 2 === 1 ? "reverse" : ""}`}
        >
          <div className="s7-marquee-track">
            {[0, 1].map((dup) => (
              <div className="s7-marquee-group" key={dup} aria-hidden={dup === 1}>
                {row.map((logo) => (
                  <LogoChip key={`${dup}-${logo.name}`} logo={logo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const ASSET_BASE_URL = import.meta.env.BASE_URL;

function LogoChip({ logo }) {
  const [iconBroken, setIconBroken] = useState(false);
  const showMono = logo.mono || iconBroken;

  return (
    <div className="s7-logo-chip">
      {showMono ? (
        <span
          className="s7-logo-mono"
          style={{ background: `#${logo.color || "0a0e2e"}` }}
          aria-hidden="true"
        >
          {logo.name.charAt(0)}
        </span>
      ) : (
        <img
          src={`${ASSET_BASE_URL}customer-logos/${logo.slug}.svg`}
          alt=""
          className="s7-logo-icon"
          width={22}
          height={22}
          loading="lazy"
          onError={() => setIconBroken(true)}
        />
      )}
      <span className="s7-logo-name">{logo.name}</span>
    </div>
  );
}
