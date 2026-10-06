import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DECK_QUESTION } from "../data";

function TypedQuestion({ typed }) {
  return (
    <div className="s1-question-composer" data-step3-question>
      <span
        className="material-symbols-rounded s1-prompt-icon"
        aria-hidden="true"
      >
        chat_bubble
      </span>
      <span className="s1-question-copy">{typed}</span>
    </div>
  );
}

function ArchitectureDestination({
  kind,
  icon,
  label,
  ready,
  reducedMotion,
}) {
  const hiddenState = { opacity: 0, y: 8, scale: 0.985 };

  return (
    <motion.section
      className={`s1-architecture-destination s1-architecture-destination--${kind} s1-enhanced-fork-destination`}
      data-context-approach={kind}
      data-fork-destination={kind}
      aria-label={`${label} context approach`}
      initial={reducedMotion ? false : hiddenState}
      animate={
        ready || reducedMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : hiddenState
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <span className="material-symbols-rounded" aria-hidden="true">
        {icon}
      </span>
      <strong>{label}</strong>
    </motion.section>
  );
}

function PrismForkConcept({
  typed,
  ready,
  reducedMotion,
}) {
  const hiddenGeometry = {
    opacity: 0,
    clipPath: "inset(0 50% 100% 50%)",
  };

  return (
    <div
      className={`s1-enhanced-fork s1-enhanced-fork--prism${ready ? " is-ready" : ""}`}
      aria-label="One question splitting through a prism into two context approaches"
    >
      <TypedQuestion typed={typed} />

      <div className="s1-enhanced-fork-map">
        <motion.div
          className="s1-enhanced-fork-geometry"
          aria-hidden="true"
          initial={reducedMotion ? false : hiddenGeometry}
          animate={
            ready || reducedMotion
              ? { opacity: 1, clipPath: "inset(0 0% 0% 0%)" }
              : hiddenGeometry
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <span className="s1-enhanced-fork-stem" />
          <span className="s1-enhanced-fork-junction" data-fork-origin />
          <i
            className="s1-enhanced-fork-branch s1-enhanced-fork-branch--fed"
            data-fork-path="fed"
          />
          <i
            className="s1-enhanced-fork-branch s1-enhanced-fork-branch--glean"
            data-fork-path="glean"
          />
        </motion.div>

        <div className="s1-enhanced-fork-destinations">
          <ArchitectureDestination
            kind="fed"
            icon="hub"
            label="Federated MCP"
            ready={ready}
            reducedMotion={reducedMotion}
          />
          <ArchitectureDestination
            kind="glean"
            icon="database"
            label="Glean Index"
            ready={ready}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </div>
  );
}

export default function Scene1Question({ onSkipToDemo }) {
  const prefersReducedMotion = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [forkReady, setForkReady] = useState(false);
  const [taglineReady, setTaglineReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const revealTimeout = window.setTimeout(() => {
        setTyped(DECK_QUESTION);
        setForkReady(true);
        setTaglineReady(true);
      }, 0);
      return () => window.clearTimeout(revealTimeout);
    }

    let index = 0;
    let forkTimeout;
    let taglineTimeout;
    const typingInterval = window.setInterval(() => {
      index += 1;
      setTyped(DECK_QUESTION.slice(0, index));
      if (index >= DECK_QUESTION.length) {
        window.clearInterval(typingInterval);
        forkTimeout = window.setTimeout(() => setForkReady(true), 350);
        taglineTimeout = window.setTimeout(() => setTaglineReady(true), 1100);
      }
    }, 32);

    return () => {
      window.clearInterval(typingInterval);
      window.clearTimeout(forkTimeout);
      window.clearTimeout(taglineTimeout);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="scene s1">
      <motion.h1
        className="hero-title s1-headline"
        style={{ fontSize: "clamp(27px, 3.1vw, 40px)" }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      >
        <span>Flexible model selection is the start.</span>
        <span>
          Context architecture shapes the{" "}
          <strong className="s1-headline-answer">answer.</strong>
        </span>
      </motion.h1>

      <motion.p
        className="s1-bridge s1-bridge--question-cue"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          delay: prefersReducedMotion ? 0 : 0.12,
        }}
      >
        <strong className="s1-bridge-cta">Start with a real question.</strong>
      </motion.p>

      <div className="s1-concept-stage">
        <PrismForkConcept
          typed={typed}
          ready={forkReady}
          reducedMotion={prefersReducedMotion}
        />
      </div>

      {/* A transform here would re-anchor the desktop skip link mid-reveal. */}
      <motion.div
        className="s1-tagline"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={taglineReady ? { opacity: 1 } : {}}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      >
        Same question.{" "}
        <strong className="s1-tagline-emphasis">Two architectures.</strong>
        <span className="s1-tagline-followup">
          Watch what each one asks the LLM to do with its context window.
        </span>
        <button
          type="button"
          className="s1-tagline-video-skip"
          onClick={onSkipToDemo}
        >
          Short on time? Skip to the 1-minute video on slide 6 →
        </button>
      </motion.div>
    </div>
  );
}
