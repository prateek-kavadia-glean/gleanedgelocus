import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TOOLS, buildFloodTokens, DECK_QUESTION } from "../data";

export default function Scene2Federated() {
  const [step, setStep] = useState(0);
  const fanRef = useRef(null);
  const toolRefs = useRef([]);
  const [paths, setPaths] = useState([]);
  const tokens = useMemo(() => buildFloodTokens(60), []);

  const measure = useCallback(() => {
    const root = fanRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const startX = rect.width / 2;
    const next = toolRefs.current.map((el) => {
      if (!el) return { startX, endX: startX, w: rect.width, h: rect.height };
      const tr = el.getBoundingClientRect();
      const endX = tr.left + tr.width / 2 - rect.left;
      return { startX, endX, w: rect.width, h: rect.height };
    });
    setPaths(next);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 4100);
    const t4 = setTimeout(() => setStep(4), 5000);
    const t5 = setTimeout(() => setStep(5), 6000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const width = paths[0]?.w || 600;
  const height = 50;
  const q = DECK_QUESTION.slice(0, 60);

  return (
    <div className="scene s2">
      <div className="scene-title kicker fed comparison-title comparison-title--federated">
        <span
          className="material-symbols-rounded comparison-title-icon"
          aria-hidden="true"
        >
          account_tree
        </span>
        <span className="comparison-title-copy">
          <small>Context approach 1</small>
          <strong>Federated MCP</strong>
        </span>
      </div>

      <div className="s2-layout">
        <div className="s2-left" ref={fanRef}>
          <motion.div
            className="s2-prompt-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chat_bubble</span>
            {`"${q}"`}
          </motion.div>

          <svg
            className="s2-fan-svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            {paths.map((p, i) => (
              <motion.path
                key={i}
                d={`M ${p.startX} 0 C ${p.startX} ${height * 0.55}, ${p.endX} ${height * 0.55}, ${p.endX} ${height}`}
                fill="none"
                stroke="rgba(255, 126, 76, 0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={step >= 1 ? { pathLength: 1 } : {}}
                transition={{ delay: i * 0.04, duration: 0.5 }}
              />
            ))}
          </svg>

          <div className="s2-tools">
            {TOOLS.map((t, i) => (
              <motion.div
                key={t.name}
                className="s2-tool"
                ref={(el) => (toolRefs.current[i] = el)}
                initial={{ opacity: 0.25 }}
                animate={step >= 1 ? { opacity: 1 } : {}}
                transition={{ delay: 0.25 + i * 0.04 }}
              >
                <img src={t.logo} alt={t.name} />
                <span className="s2-tool-name">{t.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="s2-points-list">
            <motion.div
              className="s2-caption s2-caption-point"
              initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : -8 }}
              transition={{ duration: 0.4 }}
              aria-hidden={step < 2}
            >
              <span className="material-symbols-rounded" aria-hidden>
                warning
              </span>
              <span>Different tools return isolated search results.</span>
            </motion.div>
            <motion.div
              className="s2-caption s2-caption-point"
              initial={false}
              animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : -8 }}
              transition={{ duration: 0.4 }}
              aria-hidden={step < 3}
            >
              <span className="material-symbols-rounded" aria-hidden>
                block
              </span>
              <span>Missing cross-source relevance ranking.</span>
            </motion.div>
            <motion.div
              className="s2-caption s2-caption-point"
              initial={false}
              animate={{ opacity: step >= 4 ? 1 : 0, x: step >= 4 ? 0 : -8 }}
              transition={{ duration: 0.4 }}
              aria-hidden={step < 4}
            >
              <span className="material-symbols-rounded" aria-hidden>
                travel_explore
              </span>
              <span>
                Imagine a web search provider trying to return results without
                crawling and indexing the web first.
              </span>
            </motion.div>
          </div>
        </div>

        <div className="s2-right">
          <div className="s2-context-header">
            <span>Context Window</span>
            <motion.span
              className="s2-token-counter"
              initial={false}
              animate={{ opacity: step >= 3 ? 1 : 0 }}
              aria-hidden={step < 3}
            >
              Lots of noise
            </motion.span>
          </div>

          <div className="s2-grid" aria-hidden={step < 2}>
            {tokens.map((t, i) => (
              <motion.div
                key={t.id}
                className={`s2-token ${t.relevant ? "relevant" : ""}`}
                initial={false}
                animate={{
                  opacity: step >= 2 ? (t.relevant ? 1 : 0.85) : 0,
                  scale: step >= 2 ? 1 : 0.6,
                  y: step >= 2 ? 0 : -6,
                }}
                transition={{
                  delay: step >= 2 ? i * 0.04 : 0,
                  duration: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                title={step >= 2 ? t.label : undefined}
              >
                <img src={t.logo} alt="" />
                <span>{t.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="s2-fill-track">
            <motion.div
              className="s2-fill-bar"
              initial={{ width: "0%" }}
              animate={step >= 2 ? { width: "100%" } : {}}
              transition={{ delay: 0.3, duration: 2.2, ease: "linear" }}
            />
          </div>

          <motion.div
            className="s2-caption"
            initial={false}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ delay: step >= 3 ? 0.3 : 0, duration: 0.4 }}
            aria-hidden={step < 3}
          >
            <span className="material-symbols-rounded">psychology_alt</span>
            Employees become context window managers - instead of focusing on their actual work.
          </motion.div>
          <motion.div
            className="s2-caption"
            initial={false}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ delay: step >= 3 ? 0.45 : 0, duration: 0.4 }}
            aria-hidden={step < 3}
          >
            <span className="material-symbols-rounded">circle</span>
            Only a fraction is actually useful. Many keyword matches aren&apos;t relevant. Your context window fills quickly.
          </motion.div>

          <motion.div
            className="s2-hero"
            initial={false}
            animate={{
              opacity: step >= 5 ? 1 : 0,
              scale: step >= 5 ? 1 : 0.94,
              y: step >= 5 ? 0 : 8,
            }}
            transition={{ type: "spring", stiffness: 130, damping: 14 }}
            aria-hidden={step < 5}
          >
            The LLM sifts through all of it - burning tokens before it can reason.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
