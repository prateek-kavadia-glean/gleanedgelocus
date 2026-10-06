"use client";

/* eslint-disable @next/next/no-img-element -- the brand uses a local SVG in the Vite app */

import { useEffect } from "react";
import "./VideoPage.css";

const ASSET_BASE = import.meta.env.BASE_URL;

export default function VideoPage() {
  const homeHref =
    typeof window === "undefined"
      ? ASSET_BASE
      : `${ASSET_BASE}${window.location.search}`;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Glean Context | The Glean Edge";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="video-page">
      <header className="video-page-header">
        <div className="video-page-brand">
          <img src={`${ASSET_BASE}favicon.svg`} alt="" width="32" height="32" />
          <span>The Glean Edge</span>
        </div>
        <a className="video-page-home" href={homeHref}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m10 6-6 6 6 6M4 12h16"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to main page
        </a>
      </header>

      <main className="video-page-main">
        <div className="video-page-intro">
          <p className="video-page-eyebrow">A Glean explainer</p>
          <h1>
            Better AI starts with <span>context.</span>
          </h1>
        </div>

        <figure className="video-page-film">
          <video
            className="video-page-player"
            controls
            playsInline
            preload="metadata"
            poster={`${ASSET_BASE}videos/glean-context-poster.jpg`}
            width="1280"
            height="720"
            aria-label="Glean context explainer video"
          >
            <source src={`${ASSET_BASE}videos/glean-context.mp4`} type="video/mp4" />
            Your browser does not support embedded video. {" "}
            <a href={`${ASSET_BASE}videos/glean-context.mp4`}>Watch the video directly.</a>
          </video>
        </figure>
      </main>
    </div>
  );
}
