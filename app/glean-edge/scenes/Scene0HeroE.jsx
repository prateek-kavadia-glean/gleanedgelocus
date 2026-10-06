/* eslint-disable @next/next/no-img-element -- customer logos are local SVGs in a lightweight marquee */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GLEAN_COWORK_BENCHMARK as BENCHMARK } from "../benchmarkStory.jsx";
import { CUSTOMER_LOGOS } from "../data";
import HeroHeadline from "./HeroHeadline";

const MODELS = [
  { label: "OpenAI", highlightColor: "#10a37f" },
  { label: "Anthropic", highlightColor: "#d5795c" },
  { label: "Google", highlightColor: "#4285f4" },
  { label: "Open source", highlightColor: "#8aa11b" },
];

const OPENING_CUSTOMER_NAMES = [
  "Databricks",
  "Grammarly",
  "Zillow",
  "Confluent",
  "Reddit",
  "Duolingo",
  "Booking.com",
  "Cursor",
  "MongoDB",
  "HubSpot",
  "Zapier",
];

const OPENING_CUSTOMERS = OPENING_CUSTOMER_NAMES.map((name) =>
  CUSTOMER_LOGOS.flat().find((logo) => logo.name === name),
).filter(Boolean);

function BenchmarkLink({ children }) {
  return (
    <a
      className="s0e-benchmark-link"
      href={BENCHMARK.sourceUrl}
      target="_blank"
      rel="noreferrer"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function OpeningBenchmarkRow() {
  return (
    <div
      className="s0e-benchmark-row s0e-benchmark-row--verdict"
      aria-label="Editorial Glean versus Claude Cowork benchmark verdict"
    >
      <div className="s0e-verdict-context">
        <small>vs. Claude Cowork</small>
        <time dateTime="2026-08">As of {BENCHMARK.asOf}</time>
      </div>
      <p
        className="s0e-verdict-statement"
        aria-label={`${BENCHMARK.taskCostReduction} lower token cost per task. Glean preferred overall: ${BENCHMARK.gleanPreference}.`}
      >
        <span>
          <strong>{BENCHMARK.taskCostReduction} lower</strong>
          <em>token cost per task.</em>
        </span>
        <span>
          <em>Glean preferred overall:</em>
          <strong>{BENCHMARK.gleanPreference}</strong>
        </span>
      </p>
      <BenchmarkLink>Benchmark details</BenchmarkLink>
    </div>
  );
}

export default function Scene0HeroE() {
  const prefersReducedMotion = useReducedMotion();
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveModelIndex((current) => (current + 1) % MODELS.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const reveal = (delay, y = 9) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="scene s0-draft s0e">
      <motion.header className="s0e-header" {...reveal(0.04, 10)}>
        <div>
          <p className="s0e-kicker">
            Why enterprises choose Glean as their context layer
          </p>
          <HeroHeadline />
        </div>
        <div className="s0e-intro">
          <strong>Trusted answers start long before the prompt.</strong>
          <p>
            <b>Glean prepares the context first.</b> It turns enterprise
            knowledge into relevant, governed context, then routes each
            workload to the approved model best suited to use it.
          </p>
        </div>
      </motion.header>

      <motion.section
        className="s0c-product s0e-surface"
        aria-label="Glean context and governance connect to a replaceable approved model layer"
        {...reveal(0.1, 12)}
      >
        <div className="s0e-architecture">
          <article className="s0e-foundation">
            <div className="s0e-layer-main">
              <span className="material-symbols-rounded" aria-hidden="true">
                hub
              </span>
              <p>
                <strong>Indexed context + governance</strong>
                <span>Fresh, relevant knowledge across connected sources.</span>
              </p>
            </div>
            <div className="s0e-controls" aria-label="Enterprise controls">
              <span>Permissions</span>
              <span>Governance</span>
              <span>Limits</span>
              <span>Auditability</span>
            </div>
          </article>

          <div className="s0e-connector" aria-hidden="true">
            <span className="material-symbols-rounded">arrow_forward</span>
          </div>

          <article className="s0e-models">
            <div className="s0e-layer-label">
              <span>Approved model layer</span>
              <small>Best fit, per task</small>
            </div>
            <div
              className="s0e-model-grid"
              aria-label="Approved models; visual focus rotates between providers"
              data-model-swap="active"
            >
              {MODELS.map((model, index) => (
                <span
                  className={index === activeModelIndex ? "selected" : ""}
                  key={model.label}
                  style={{ "--model-highlight": model.highlightColor }}
                >
                  {model.label}
                </span>
              ))}
            </div>
            <div className="s0e-route-note" aria-hidden="true">
              <span className="material-symbols-rounded">
                alt_route
              </span>
              <span>Swap models, not your entire platform.</span>
            </div>
          </article>
        </div>
      </motion.section>

      <motion.footer
        className="s0e-evidence"
        aria-label="Glean context-layer proof"
        {...reveal(0.16, 6)}
      >
        <OpeningBenchmarkRow />

        <div
          className="s0e-customer-rail"
          aria-label="Selected Glean customers"
        >
          <div className="s0e-customer-track">
            {[0, 1].map((duplicate) => (
              <div
                className="s0e-customer-group"
                key={duplicate}
                aria-hidden={duplicate === 1}
              >
                {OPENING_CUSTOMERS.map((logo) => (
                  <span className="s0e-customer-mark" key={logo.name}>
                    <img
                      src={`/customer-logos/${logo.slug}.svg`}
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                    />
                    <span>{logo.name}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
