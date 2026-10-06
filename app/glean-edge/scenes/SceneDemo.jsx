import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

const CLIP = {
  runtime: "1:24",
  playbackRate: 1,
  speedBadge: "2×",
  poster: "/videos/glean-vs-claude-nasa-poster.jpg",
  mp4: "/videos/glean-vs-claude-nasa.mp4",
  webm: "/videos/glean-vs-claude-nasa.webm",
};

export default function SceneDemo() {
  const videoHref =
    typeof window === "undefined" ? "/video" : `/video${window.location.search}`;

  return (
    <div className="scene s-demo">
      <motion.h1
        className="hero-title"
        style={{ fontSize: "clamp(26px, 3vw, 38px)" }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        What does it look like?{" "}
        <span className="accent">Watch us prompt.</span>
      </motion.h1>

      <motion.p
        className="s-demo-sub"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        When <strong className="s-demo-sub-claude">Claude (left)</strong> uses
        app-by-app MCP connectors, it searches each application live.{" "}
        <strong className="s-demo-sub-glean">Glean (right)</strong> already knows
        where to look.
      </motion.p>

      <DemoVideoCard clip={CLIP} />

      <motion.p
        className="s-demo-takeaway"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32 }}
      >
        <span
          className="material-symbols-rounded s-demo-takeaway-icon"
          aria-hidden="true"
        >
          emoji_objects
        </span>
        <span>
          Most poor results from AI aren’t hallucinations. The LLM simply never
          saw the right document.
        </span>
      </motion.p>

      <p className="s-demo-explainer">
        Focused on answer quality?{" "}
        <a href={videoHref}>
          Check out this more detailed explanation <span aria-hidden="true">↗</span>
        </a>
      </p>
    </div>
  );
}

function DemoVideoCard({ clip }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const handlePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = true;
    setMuted(true);
    v.playbackRate = clip.playbackRate;
    v.defaultPlaybackRate = clip.playbackRate;
    v.play().catch(() => {});
    setPlaying(true);
  }, [clip.playbackRate]);

  const handleUnmute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
  }, []);

  const ensureRate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.playbackRate !== clip.playbackRate) v.playbackRate = clip.playbackRate;
  }, [clip.playbackRate]);

  const handleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (typeof v.requestFullscreen === "function") {
        v.requestFullscreen().catch(() => {});
      } else if (typeof v.webkitEnterFullscreen === "function") {
        v.webkitEnterFullscreen();
      }
    } catch {
      // Keep playback working if a browser rejects programmatic fullscreen.
    }
  }, []);

  return (
    <motion.div
      className="s-demo-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="s-demo-chrome">
        <div className="s-demo-chrome-tags">
          <span className="s-demo-chrome-tag claude">
            <span className="s-demo-chrome-dot" />
            Live federated search
          </span>
          <span className="s-demo-chrome-vs">vs</span>
          <span className="s-demo-chrome-tag glean">
            <span className="s-demo-chrome-dot" />
            Indexed Glean context
          </span>
        </div>
      </div>

      <div className="s-demo-stage">
        <div className="s-demo-split-labels">
          <div className="s-demo-split-label left">
            <span className="dot claude" />
            Federated
          </div>
          <div className="s-demo-split-label right">
            <span className="dot glean" />
            Indexed
          </div>
        </div>

        <div className="s-demo-divider" aria-hidden="true" />

        <video
          ref={videoRef}
          className="s-demo-video"
          poster={clip.poster}
          preload="metadata"
          playsInline
          muted={muted}
          controls={playing}
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onLoadedMetadata={ensureRate}
          onPlay={ensureRate}
          onRateChange={ensureRate}
          onSeeked={ensureRate}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onEnded={() => setPlaying(false)}
          onPause={() => {
            if (videoRef.current && videoRef.current.ended) setPlaying(false);
          }}
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>

        {playing && muted && (
          <button
            type="button"
            onClick={handleUnmute}
            aria-label="Unmute voiceover"
            title="Unmute voiceover"
            className="s-demo-sound"
          >
            <span className="material-symbols-rounded" aria-hidden="true">
              volume_up
            </span>
            <span className="s-demo-sound-label">Turn sound on</span>
          </button>
        )}

        {playing && (
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Expand video to full screen"
            title="Full screen"
            className="s-demo-fullscreen"
          >
            <span className="material-symbols-rounded" aria-hidden="true">
              fullscreen
            </span>
          </button>
        )}

        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play side-by-side demo muted at ${clip.speedBadge} speed; voiceover available`}
            className="s-demo-play"
          >
            <span className="s-demo-play-pill">
              <span className="s-demo-play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>
              Play
              <span className="s-demo-play-meta">
                <span className="s-demo-play-badge">{clip.speedBadge}</span>
                <span className="s-demo-play-runtime">{clip.runtime}</span>
              </span>
            </span>
            <span className="s-demo-play-sound-hint">
              <span className="material-symbols-rounded" aria-hidden="true">
                volume_off
              </span>
              Muted by default
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
