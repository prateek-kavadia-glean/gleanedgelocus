import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  GRAPH_NODES,
  GRAPH_EDGES,
  TYPE_COLORS,
  TYPE_LABELS,
  RANKING_SIGNALS,
  GLEAN_RESULTS,
  DECK_QUESTION,
} from "../data";

const VBW = 120;
const VBH = 86;
const CENTER_X = 60;
const CENTER_Y = 42;

export default function Scene3Glean() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1700);
    const t3 = setTimeout(() => setStep(3), 3000);
    const t4 = setTimeout(() => setStep(4), 4200);
    const t5 = setTimeout(() => setStep(5), 4900);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const q = DECK_QUESTION.slice(0, 60);

  const hitMap = useMemo(
    () => Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n.hit])),
    []
  );

  const ambientEdges = useMemo(() => {
    const out = [];
    for (let i = 0; i < GRAPH_NODES.length; i++) {
      for (let j = i + 1; j < GRAPH_NODES.length; j++) {
        const a = GRAPH_NODES[i];
        const b = GRAPH_NODES[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 52) out.push({ a, b, d });
      }
    }
    return out;
  }, []);

  const satellites = useMemo(() => {
    const pts = [];
    const GA = Math.PI * (3 - Math.sqrt(5));
    for (let i = 1; i <= 96; i++) {
      const t = i / 96;
      const r = 8 + t * 48 + (i % 6) * 1.1;
      const ang = i * GA;
      const x = CENTER_X + Math.cos(ang) * r;
      const y = CENTER_Y + Math.sin(ang) * r * 0.68;
      if (x < 2 || x > VBW - 2 || y < 2 || y > VBH - 2) continue;
      pts.push({ id: `s${i}`, x, y });
    }
    return pts;
  }, []);

  const satelliteEdges = useMemo(() => {
    const mainLinks = satellites.flatMap((s) => {
      const sorted = GRAPH_NODES
        .map((n) => ({ n, d: Math.hypot(n.x - s.x, n.y - s.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 4);
      return sorted.map(({ n }, k) => ({
        key: `${s.id}-${n.id}-${k}`,
        x1: s.x,
        y1: s.y,
        x2: n.x,
        y2: n.y,
      }));
    });

    const satLinks = [];
    for (let i = 0; i < satellites.length; i++) {
      const s = satellites[i];
      const others = satellites
        .filter((o) => o.id !== s.id)
        .map((o) => ({ o, d: Math.hypot(o.x - s.x, o.y - s.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      others.forEach(({ o }, k) => {
        if (s.id < o.id) {
          satLinks.push({
            key: `${s.id}-${o.id}-s${k}`,
            x1: s.x,
            y1: s.y,
            x2: o.x,
            y2: o.y,
          });
        }
      });
    }

    return [...mainLinks, ...satLinks];
  }, [satellites]);

  return (
    <div className="scene s3">
      <div className="scene-title kicker comparison-title comparison-title--index">
        <span
          className="material-symbols-rounded comparison-title-icon"
          aria-hidden="true"
        >
          database
        </span>
        <span className="comparison-title-copy">
          <small>Context approach 2</small>
          <strong>Glean Index</strong>
        </span>
      </div>

      <div className="s3-layout">
        <div className="s3-graph">
          <div className="s3-graph-header">
            <div className="s3-graph-label">Enterprise Knowledge Graph</div>
            <div className="s3-graph-legend">
              {Object.entries(TYPE_LABELS).map(([k, label]) => (
                <span key={k} className="s3-legend-chip">
                  <span
                    className="s3-legend-dot"
                    style={{ background: TYPE_COLORS[k] }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <svg
            className="s3-graph-svg"
            viewBox={`0 0 ${VBW} ${VBH}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="bgGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="rgba(216, 253, 73, 0.10)" />
                <stop offset="55%" stopColor="rgba(216, 253, 73, 0.03)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
              <radialGradient id="anchorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(216, 253, 73, 0.55)" />
                <stop offset="100%" stopColor="rgba(216, 253, 73, 0)" />
              </radialGradient>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(53,120,69,0)" />
                <stop offset="50%" stopColor="rgba(53,120,69,0.5)" />
                <stop offset="100%" stopColor="rgba(53,120,69,0)" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width={VBW} height={VBH} fill="url(#bgGlow)" />

            {[18, 32, 46].map((r, i) => (
              <circle
                key={r}
                cx={CENTER_X}
                cy={CENTER_Y}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.15"
                strokeDasharray={i === 1 ? "0.8 1.2" : undefined}
              />
            ))}

            <g className="s3-ambient-layer">
              {ambientEdges.map(({ a, b }, i) => (
                <motion.line
                  key={`amb-${a.id}-${b.id}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(220, 226, 250, 0.55)"
                  strokeWidth="0.18"
                  strokeDasharray="0.55 0.9"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={step >= 1 ? { opacity: step >= 2 ? 0.85 : 1 } : {}}
                  transition={{ delay: 0.15 + (i % 20) * 0.012, duration: 0.4 }}
                />
              ))}

              {satelliteEdges.map((e, i) => (
                <motion.line
                  key={e.key}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke="rgba(220, 226, 250, 0.42)"
                  strokeWidth="0.15"
                  strokeDasharray="0.4 0.75"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={step >= 1 ? { opacity: step >= 2 ? 0.7 : 0.95 } : {}}
                  transition={{ delay: 0.2 + (i % 24) * 0.01, duration: 0.4 }}
                />
              ))}

              {satellites.map((s, i) => (
                <motion.circle
                  key={s.id}
                  cx={s.x}
                  cy={s.y}
                  r={0.65}
                  fill="rgba(225, 230, 252, 0.85)"
                  initial={{ opacity: 0 }}
                  animate={
                    step >= 1 ? { opacity: step >= 2 ? 0.6 : 0.95 } : {}
                  }
                  transition={{ delay: 0.25 + (i % 18) * 0.012, duration: 0.35 }}
                />
              ))}
            </g>

            {GRAPH_EDGES.map(([a, b], i) => {
              const hit = hitMap[a] && hitMap[b];
              const opacityActive = hit && step >= 2 ? 0.95 : step >= 2 ? 0.12 : 0.55;
              return (
                <motion.line
                  key={i}
                  x1={GRAPH_NODES[a].x}
                  y1={GRAPH_NODES[a].y}
                  x2={GRAPH_NODES[b].x}
                  y2={GRAPH_NODES[b].y}
                  stroke={
                    hit && step >= 2
                      ? "rgba(216,253,73,0.65)"
                      : "rgba(255,255,255,0.16)"
                  }
                  strokeWidth={hit && step >= 2 ? 0.32 : 0.2}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={step >= 1 ? { opacity: opacityActive } : {}}
                  transition={{ delay: 0.25 + i * 0.025, duration: 0.4 }}
                />
              );
            })}

            {step >= 2 && (
              <motion.circle
                cx={GRAPH_NODES[0].x}
                cy={GRAPH_NODES[0].y}
                r={12}
                fill="url(#anchorGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.35, 0.7, 0.35] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {GRAPH_NODES.map((n, i) => {
              const color = TYPE_COLORS[n.type] || "#ffffff";
              const lit = step >= 2 && n.hit;
              const dim = step >= 2 && !n.hit;
              const size = n.size || 2.4;
              return (
                <g key={n.id}>
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={size * 1.9}
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: lit
                        ? [0.18, 0.34, 0.18]
                        : dim
                        ? 0.04
                        : 0.10,
                    }}
                    transition={{
                      delay: lit ? 0.1 + i * 0.04 : 0.5 + i * 0.04,
                      duration: lit ? 1.8 : 0.4,
                      repeat: lit ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={size + 0.5}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.35"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: dim ? 0.2 : 0.9 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.35 }}
                  />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={size}
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: dim ? 0.35 : 1 }}
                    transition={{
                      delay: 0.5 + i * 0.04,
                      duration: 0.4,
                    }}
                  />
                  {lit && (
                    <motion.text
                      x={n.x}
                      y={n.y - size - 1.6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="2.4"
                      fontWeight="600"
                      paintOrder="stroke"
                      stroke="rgba(8, 10, 30, 0.85)"
                      strokeWidth="0.7"
                      style={{ letterSpacing: "0.02em" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 + i * 0.05, duration: 0.35 }}
                    >
                      {n.label}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {step >= 1 && step < 3 && (
              <motion.rect
                x="0"
                y="0"
                width="10"
                height={VBH}
                fill="url(#sweepGrad)"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: [0, VBW - 10], opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 1.5, ease: "linear", delay: 0.3 }}
              />
            )}
          </svg>

          <div className="s3-signals" aria-hidden={step < 2}>
            <motion.span
              className="s3-signals-label"
              initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Ranking signals
            </motion.span>
            {RANKING_SIGNALS.map((s, i) => (
              <motion.div
                key={s.label}
                className="s3-signal"
                initial={false}
                animate={{
                  opacity: step >= 2 ? 1 : 0,
                  y: step >= 2 ? 0 : 6,
                  scale: step >= 2 ? 1 : 0.9,
                }}
                transition={{
                  delay: step >= 2 ? 0.15 + i * 0.07 : 0,
                  duration: 0.3,
                }}
              >
                <span className="material-symbols-rounded">{s.icon}</span>
                {s.label}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="s3-right">
          <motion.div
            className="s3-prompt-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chat_bubble</span>
            {`"${q}"`}
          </motion.div>

          <div className="s3-context-header">
            <span>Context Window</span>
            <motion.span
              className="s3-context-counter"
              initial={false}
              animate={{ opacity: step >= 4 ? 1 : 0 }}
              aria-hidden={step < 4}
            >
              Minimal, high-signal
            </motion.span>
          </div>

          <div className="s3-results" aria-hidden={step < 3}>
            {GLEAN_RESULTS.map((r, i) => (
              <motion.div
                key={i}
                className="s3-card"
                initial={false}
                animate={{
                  opacity: step >= 3 ? 1 : 0,
                  scale: step >= 3 ? 1 : 0.85,
                  filter: step >= 3 ? "blur(0px)" : "blur(4px)",
                }}
                transition={{
                  delay: step >= 3 ? 0.15 + i * 0.18 : 0,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <span className="s3-card-dot" />
                {r.label}
                <span className="s3-card-meta">{r.source} · {r.meta}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="s3-context-note"
            initial={false}
            animate={{ opacity: step >= 4 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden={step < 4}
          >
            Minimal noise
          </motion.div>

          <motion.div
            className="s3-hero"
            initial={false}
            animate={{
              opacity: step >= 5 ? 1 : 0,
              scale: step >= 5 ? 1 : 0.94,
              y: step >= 5 ? 0 : 8,
            }}
            transition={{ type: "spring", stiffness: 130, damping: 14 }}
            aria-hidden={step < 5}
          >
            Fewer wasted tokens.
            <br className="s3-hero-desktop-break" /> More room to reason.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
