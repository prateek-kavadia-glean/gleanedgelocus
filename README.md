# The Glean Edge 

An interactive prospect briefing on indexed enterprise context, retrieval
efficiency, open model routing, and the cost of model-family lock-in.

This project ports the current SmartContext experience into a Vite single-page
application and extends it with:

- a model lock-in risk chapter;
- policy-driven, multi-provider routing;
- a sourced July 2026 model-economics snapshot;
- direct links for every scene;
- a prospect conversion path and social preview card.

## Run locally

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

The local site opens at `http://localhost:5173`.

The standalone context explainer is available at `http://localhost:5173/video`.
It stays outside the presentation navigation and includes a button back to the
landing page. Its video and poster are served locally from `public/videos/`.

## Deploy to Cloudflare Pages

Connect the repository as a Pages project with the Vite preset:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank

No Pages Functions or redirect file is required. The build emits a top-level
`index.html`, so Cloudflare Pages automatically serves the deck as a
single-page application on direct scene URLs.

Cloudflare Pages limits each asset to 25 MiB. `npm run build` checks every file
in `dist/` and fails if any asset exceeds that limit. Keep video exports below
the limit with room for audio and container overhead.

## Validate

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

The benchmark comparison is directional and timestamped. Model prices,
benchmark scores, and availability change; production decisions should be
validated against representative workloads and current linked sources.
