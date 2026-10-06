"use client";

/* eslint-disable @next/next/no-img-element -- the shell switches between bundled and vendor-provided Glean marks */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Scene0HeroE from "./scenes/Scene0HeroE";
import Scene1Question from "./scenes/Scene1Question";
import Scene2Federated from "./scenes/Scene2Federated";
import Scene3Glean from "./scenes/Scene3Glean";
import Scene6Beyond from "./scenes/Scene6Beyond";
import SceneDemo from "./scenes/SceneDemo";
import SceneModelEfficiencyApproved from "./scenes/SceneModelEfficiencyApproved";
import SceneModelFlexibility from "./scenes/SceneModelFlexibility";
import Scene7Takeaway from "./scenes/Scene7Takeaway";
import VideoPage from "./VideoPage";

const STEPS = [
  {
    step: "1",
    label: "Overview",
    variants: [
      {
        id: "e",
        path: "/",
        theme: "light",
        track: "light",
        element: <Scene0HeroE />,
      },
    ],
  },
  {
    step: "2",
    label: "Model Flexibility",
    variants: [
      {
        id: "b",
        path: "/model-flexibility",
        theme: "light",
        track: "light",
        element: <SceneModelFlexibility />,
      },
    ],
  },
  {
    step: "3",
    label: "The Question",
    variants: [
      {
        id: "b",
        path: "/question",
        theme: "light",
        track: "light",
        element: <Scene1Question />,
      },
    ],
  },
  {
    step: "4",
    label: "Federated MCP",
    variants: [
      {
        id: "b",
        path: "/federated-search",
        theme: "light",
        track: "light",
        element: <Scene2Federated />,
      },
    ],
  },
  {
    step: "5",
    label: "Glean Index",
    variants: [
      {
        id: "b",
        path: "/glean-index",
        theme: "light",
        track: "light",
        element: <Scene3Glean />,
      },
    ],
  },
  {
    step: "6",
    label: "Live Demo",
    variants: [
      {
        id: "b",
        path: "/demo",
        theme: "light",
        track: "light",
        element: <SceneDemo />,
      },
    ],
  },
  {
    step: "7",
    label: "Efficiency Benchmark",
    variants: [
      {
        id: "f",
        path: "/benchmark",
        theme: "light",
        track: "light",
        element: <SceneModelEfficiencyApproved />,
      },
    ],
  },
  {
    step: "8",
    label: "Beyond Search",
    variants: [
      {
        id: "b",
        path: "/beyond-search",
        theme: "light",
        track: "light",
        element: <Scene6Beyond />,
      },
    ],
  },
  {
    step: "9",
    label: "Takeaway",
    variants: [
      {
        id: "b",
        path: "/takeaway",
        theme: "light",
        track: "light",
        element: <Scene7Takeaway />,
      },
    ],
  },
];

const TOTAL = STEPS.length;
const DEFAULT_ROUTE = {
  stepIndex: 0,
  variantId: STEPS[0].variants[0].id,
};
const LEGACY_PATH_ALIASES = [
  ["/overview/outcomes", "/"],
  ["/overview/balanced", "/"],
  ["/overview/verdict", "/"],
  ["/overview/equation", "/"],
  ["/overview/ledger", "/"],
  ["/model-flexibility/architecture", "/model-flexibility"],
  ["/model-flexibility/approved-benchmark", "/benchmark"],
  ["/page-2b", "/model-flexibility"],
  ["/page-3b", "/question"],
  ["/page-4b", "/federated-search"],
  ["/page-5b", "/glean-index"],
  ["/page-6b", "/demo"],
  ["/page-7b", "/beyond-search"],
  ["/page-8b", "/takeaway"],
  ["/page-9b", "/takeaway"],
];

function getCanonicalRoute(path) {
  for (let stepIndex = 0; stepIndex < STEPS.length; stepIndex += 1) {
    const variant = STEPS[stepIndex].variants.find(
      (candidate) => candidate.path === path,
    );
    if (variant) return { stepIndex, variantId: variant.id };
  }

  throw new Error(`Unknown canonical route: ${path}`);
}

const LEGACY_PATH_ROUTES = new Map(
  LEGACY_PATH_ALIASES.map(([legacyPath, canonicalPath]) => [
    legacyPath,
    getCanonicalRoute(canonicalPath),
  ]),
);
const GLEAN_EMAIL_DOMAIN = "glean.com";
const GLEAN_EMAIL_LOCAL_PART = /^[a-z0-9]+(?:[._+-][a-z0-9]+)*$/i;
const AE_EMAIL_SUBJECT = "Question about The Glean Edge";

export function getGleanAeContact(value) {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return null;

  const parts = email.split("@");
  if (parts.length !== 2) return null;

  const [localPart, domain] = parts;
  if (
    domain !== GLEAN_EMAIL_DOMAIN ||
    localPart.length > 64 ||
    !GLEAN_EMAIL_LOCAL_PART.test(localPart) ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return null;
  }

  return {
    email,
    mailto: `mailto:${email}?subject=${encodeURIComponent(AE_EMAIL_SUBJECT)}`,
  };
}

export function getFromQuery(search = "") {
  const values = new URLSearchParams(search).getAll("from");
  return values.length === 1 ? values[0] : null;
}

export function getRepQuery(search = "") {
  const values = new URLSearchParams(search).getAll("rep");
  return values.length === 1 ? values[0] : null;
}

export function getGleanContact({ from = null, rep = null } = {}) {
  const repContact = getGleanAeContact(rep);
  if (repContact) return { ...repContact, role: "Rep" };

  const aeContact = getGleanAeContact(from);
  return aeContact ? { ...aeContact, role: "AE" } : null;
}

export function getRouteUrl(path, location = {}) {
  const search = typeof location.search === "string" ? location.search : "";
  const hash = typeof location.hash === "string" ? location.hash : "";
  return `${path}${search}${hash}`;
}

export function getSceneTransitionMode() {
  return "popLayout";
}

export function shouldUseStaticSceneTransition({
  prefersReducedMotion = false,
  isPhoneViewport = false,
} = {}) {
  return Boolean(prefersReducedMotion || isPhoneViewport);
}

export function shouldIgnorePresentationKey(event = {}) {
  return Boolean(
    event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey,
  );
}

function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "");
}

function getRouteMatch(pathname) {
  const normalizedPath = normalizePath(pathname);
  const legacyRoute = LEGACY_PATH_ROUTES.get(normalizedPath);
  if (legacyRoute) return legacyRoute;

  for (let stepIndex = 0; stepIndex < STEPS.length; stepIndex += 1) {
    const variant = STEPS[stepIndex].variants.find(
      (candidate) => candidate.path === normalizedPath,
    );
    if (variant) return { stepIndex, variantId: variant.id };
  }

  return null;
}

function getInitialRoute(initialPath) {
  return getRouteMatch(initialPath) || DEFAULT_ROUTE;
}

function getVariant(route) {
  return (
    STEPS[route.stepIndex]?.variants.find(
      (variant) => variant.id === route.variantId,
    ) || STEPS[route.stepIndex]?.variants[0]
  );
}

function getTrackVariant(stepIndex, track) {
  const variants = STEPS[stepIndex]?.variants || [];
  return (
    variants.find((variant) => variant.track === track) ||
    variants[0]
  );
}

function writeRoute(route, { replace = false } = {}) {
  const nextVariant = getVariant(route);
  if (!nextVariant || typeof window === "undefined") return;
  if (normalizePath(window.location.pathname) === nextVariant.path) return;

  const method = replace ? "replaceState" : "pushState";
  window.history[method](
    { step: route.stepIndex, variant: nextVariant.id },
    "",
    getRouteUrl(nextVariant.path, window.location),
  );
}

function Stepper({ current, onPrev, onNext, onGo }) {
  const showNext = current < TOTAL - 1;
  const pulseNextCta = current === 0 && showNext;

  return (
    <div className="stepper">
      <button
        className="stepper-btn"
        onClick={onPrev}
        disabled={current === 0}
      >
        ← Back
      </button>

      <div className="stepper-dots">
        <span className="stepper-progress-rail" aria-hidden="true" />
        <motion.span
          className="stepper-progress-fill"
          aria-hidden="true"
          initial={false}
          animate={{
            width:
              STEPS.length > 1
                ? `${(current / (STEPS.length - 1)) * 100}%`
                : "0%",
          }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        />
        {STEPS.map((step, i) => (
          <button
            key={step.step}
            className={`stepper-dot ${i === current ? "active" : ""} ${i < current ? "completed" : ""}`}
            onClick={() => onGo(i)}
            aria-label={`Go to step ${step.step}, ${step.label}`}
            aria-current={i === current ? "step" : undefined}
          >
            {i === current && (
              <motion.span
                className="stepper-dot-ring"
                layoutId="dot-ring"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <span className="stepper-label">
        {`Step ${STEPS[current].step} · `}
        <strong>{STEPS[current].label}</strong>
      </span>

      <div
        className={`stepper-next-slot${showNext ? "" : " stepper-next-slot--empty"}`}
        aria-hidden={showNext ? undefined : "true"}
      >
        <button
          type="button"
          className={`stepper-btn stepper-btn-primary${pulseNextCta ? " stepper-next-cta" : ""}`}
          onClick={onNext}
          disabled={!showNext}
          tabIndex={showNext ? undefined : -1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{ initialPath?: string, initialFrom?: string | null, initialRep?: string | null }} props
 */
export default function App(props) {
  if (normalizePath(props.initialPath) === "/video") {
    return <VideoPage />;
  }

  return <Presentation {...props} />;
}

function Presentation({
  initialPath = "/",
  initialFrom = null,
  initialRep = null,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeRoute, setActiveRoute] = useState(() =>
    getInitialRoute(initialPath),
  );
  const [gleanContact, setGleanContact] = useState(() =>
    getGleanContact({
      from:
        initialFrom ??
        (typeof window === "undefined"
          ? null
          : getFromQuery(window.location.search)),
      rep:
        initialRep ??
        (typeof window === "undefined"
          ? null
          : getRepQuery(window.location.search)),
    }),
  );
  const activeRouteRef = useRef(activeRoute);
  const sceneViewportRef = useRef(null);
  const [direction, setDirection] = useState(0);
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);
  const current = activeRoute.stepIndex;
  const activeStep = STEPS[current];
  const activeVariant = getVariant(activeRoute);

  const go = useCallback(
    (nextIndex, { replace = false } = {}) => {
      if (nextIndex < 0 || nextIndex >= TOTAL) return;

      if (nextIndex === current) {
        writeRoute(activeRoute, { replace });
        return;
      }

      const nextVariant = getTrackVariant(nextIndex, activeVariant.track);
      const nextRoute = {
        stepIndex: nextIndex,
        variantId: nextVariant.id,
      };

      setDirection(nextIndex > current ? 1 : -1);
      activeRouteRef.current = nextRoute;
      setActiveRoute(nextRoute);
      writeRoute(nextRoute, { replace });
    },
    [activeRoute, activeVariant.track, current],
  );

  const next = useCallback(() => go(current + 1), [go, current]);
  const prev = useCallback(() => go(current - 1), [go, current]);
  const skipToDemo = useCallback(() => go(5), [go]);

  useLayoutEffect(() => {
    if (direction === 0) return;

    const isMobileViewport = window.matchMedia(
      "(max-width: 900px), (hover: none) and (pointer: coarse)",
    ).matches;

    if (!isMobileViewport) return;

    sceneViewportRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [current, direction]);

  useEffect(() => {
    const phoneViewport = window.matchMedia("(max-width: 640px)");
    const updatePhoneViewport = () => setIsPhoneViewport(phoneViewport.matches);

    updatePhoneViewport();
    phoneViewport.addEventListener("change", updatePhoneViewport);

    return () =>
      phoneViewport.removeEventListener("change", updatePhoneViewport);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (shouldIgnorePresentationKey(event)) return;

      const interactiveTarget =
        event.target instanceof Element &&
        event.target.closest(
          "a, button, input, textarea, select, video, [contenteditable='true'], [role='region'][tabindex]",
        );
      if (interactiveTarget) return;

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "0") {
        event.preventDefault();
        go(0);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next, prev]);

  useEffect(() => {
    const browserRoute = getRouteMatch(window.location.pathname);
    const initialRoute = browserRoute || DEFAULT_ROUTE;
    const initialVariant = getVariant(initialRoute);

    window.history.replaceState(
      { step: initialRoute.stepIndex, variant: initialVariant.id },
      "",
      getRouteUrl(initialVariant.path, window.location),
    );

    const onPopState = () => {
      const browserRoute = getRouteMatch(window.location.pathname);
      const route = browserRoute || DEFAULT_ROUTE;
      const previousRoute = activeRouteRef.current;

      setGleanContact(
        getGleanContact({
          from: getFromQuery(window.location.search),
          rep: getRepQuery(window.location.search),
        }),
      );

      setDirection(
        route.stepIndex === previousRoute.stepIndex
          ? 0
          : route.stepIndex > previousRoute.stepIndex
            ? 1
            : -1,
      );
      activeRouteRef.current = route;
      setActiveRoute(route);

      if (
        !browserRoute ||
        normalizePath(window.location.pathname) !== getVariant(route).path
      ) {
        writeRoute(route, { replace: true });
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const useStaticSceneTransition = shouldUseStaticSceneTransition({
    prefersReducedMotion,
    isPhoneViewport,
  });
  const variants = useStaticSceneTransition
    ? {
        enter: { x: 0, opacity: 1, scale: 1 },
        center: {
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 0 },
        },
        exit: {
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 0 },
        },
      }
    : {
        enter: (dir) => ({
          x: dir === 0 ? 0 : dir > 0 ? "60%" : "-60%",
          opacity: 0,
          scale: dir === 0 ? 1 : 0.96,
        }),
        center: (dir) => ({
          x: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: dir === 0 ? 0.26 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        }),
        exit: (dir) => ({
          x: dir === 0 ? 0 : dir > 0 ? "-40%" : "40%",
          opacity: 0,
          scale: dir === 0 ? 1 : 0.96,
          transition:
            dir === 0
              ? { duration: 0 }
              : { duration: 0.32, ease: [0.55, 0, 1, 0.45] },
        }),
      };

  const appClassNames = ["app"];
  if (activeVariant.theme === "light") appClassNames.push("app--light-draft");

  if (current === 0) {
    appClassNames.push("app--hero");
    if (activeVariant.id !== "a") {
      appClassNames.push("app--hero-draft", `app--hero-${activeVariant.id}`);
    }
  } else {
    appClassNames.push(
      `app--step-${activeStep.step}`,
      `app--variant-${activeVariant.id}`,
    );
  }

  return (
    <div className={appClassNames.join(" ")}>
      <svg className="noise-overlay" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <div className="topbar">
        <div className="topbar-brand">
          <img
            src={
              activeVariant.theme === "light"
                ? "/favicon.svg"
                : "https://app.glean.com/images/glean-logo2.svg"
            }
            alt="Glean"
          />
          <div className="topbar-brand-copy">
            <strong>The Glean Edge</strong>
            <small>Model freedom &amp; real context</small>
          </div>
        </div>

        {gleanContact && (
          <div className="topbar-actions">
            <a
              className="ae-contact-link"
              href={gleanContact.mailto}
              aria-label={`Contact your Glean ${gleanContact.role} at ${gleanContact.email}`}
              title={`Contact ${gleanContact.email}`}
            >
              <span
                className="material-symbols-rounded ae-contact-icon"
                aria-hidden="true"
              >
                mail
              </span>
              <span className="ae-contact-copy">
                <small>{`Your Glean ${gleanContact.role}`}</small>
                <span className="ae-contact-address">
                  {gleanContact.email}
                </span>
              </span>
            </a>
          </div>
        )}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Step ${activeStep.step}, ${activeStep.label}.`}
      </div>

      <div className="scene-viewport" ref={sceneViewportRef}>
        <AnimatePresence
          mode={getSceneTransitionMode()}
          initial={false}
          custom={direction}
        >
          <motion.div
            key={`${current}-${activeVariant.id}`}
            className="scene-wrapper"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeVariant.path === "/question" ? (
              <Scene1Question onSkipToDemo={skipToDemo} />
            ) : (
              activeVariant.element
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Stepper current={current} onPrev={prev} onNext={next} onGo={go} />
    </div>
  );
}
