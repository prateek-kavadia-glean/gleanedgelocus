import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, test } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

const vite = await createServer({
  configFile: false,
  root: new URL("..", import.meta.url).pathname,
  plugins: [react()],
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
const {
  default: App,
  getFromQuery,
  getGleanAeContact,
  getGleanContact,
  getRepQuery,
  getAppPath,
  getHostedPath,
  getRouteUrl,
  getSceneTransitionMode,
  shouldIgnorePresentationKey,
  shouldUseStaticSceneTransition,
} = await vite.ssrLoadModule("/app/glean-edge/App.jsx");
const indexTemplate = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const globalStyles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const routerSceneSource = await readFile(
  new URL("../app/glean-edge/scenes/SceneRouter.jsx", import.meta.url),
  "utf8",
);
const questionSceneSource = await readFile(
  new URL("../app/glean-edge/scenes/Scene1Question.jsx", import.meta.url),
  "utf8",
);
const demoSceneSource = await readFile(
  new URL("../app/glean-edge/scenes/SceneDemo.jsx", import.meta.url),
  "utf8",
);

after(async () => {
  await vite.close();
});

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render(path = "/", appProps = {}) {
  const markup = renderToString(
    createElement(App, { initialPath: path, ...appProps }),
  );
  const html = indexTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

test("adds a Glean AE contact action when a valid from parameter is supplied", async () => {
  const response = await render("/", { initialFrom: "johndoe@glean.com" });
  const html = await response.text();

  assert.match(html, /class="ae-contact-link"/i);
  assert.match(
    html,
    /href="mailto:johndoe@glean\.com\?subject=Question%20about%20The%20Glean%20Edge"/i,
  );
  assert.match(html, /Your Glean AE/i);
  assert.doesNotMatch(html, /Email your Glean AE/i);
  assert.match(html, /class="ae-contact-address">johndoe@glean\.com/i);
  assert.match(html, /johndoe@glean\.com/i);
});

test("adds a Glean Rep contact action when a valid rep parameter is supplied", async () => {
  const response = await render("/", { initialRep: " John.Doe@GLEAN.com " });
  const html = await response.text();

  assert.match(html, /class="ae-contact-link"/i);
  assert.match(
    html,
    /href="mailto:john\.doe@glean\.com\?subject=Question%20about%20The%20Glean%20Edge"/i,
  );
  assert.match(html, /Your Glean Rep/i);
  assert.doesNotMatch(html, /Your Glean AE/i);
  assert.match(html, /class="ae-contact-address">john\.doe@glean\.com/i);
});

test("accepts only well-formed glean.com contact addresses", async () => {
  const normalizedContact = getGleanAeContact("  John.Doe@GLEAN.com  ");
  assert.equal(normalizedContact?.email, "john.doe@glean.com");
  assert.equal(getGleanAeContact("johndoe@example.com"), null);
  assert.equal(getGleanAeContact("john..doe@glean.com"), null);
  assert.equal(getGleanAeContact(`${"a".repeat(65)}@glean.com`), null);
  assert.equal(
    getGleanAeContact(getFromQuery("?from=john%0d%0abcc@glean.com")),
    null,
  );
  assert.equal(
    getFromQuery("?from=john@glean.com&from=jane@glean.com"),
    null,
  );
  assert.equal(getRepQuery("?rep=john.doe@glean.com"), "john.doe@glean.com");
  assert.equal(
    getRepQuery("?rep=john@glean.com&rep=jane@glean.com"),
    null,
  );
  assert.equal(
    getGleanContact({
      from: "account.executive@glean.com",
      rep: "sales.rep@glean.com",
    })?.email,
    "sales.rep@glean.com",
  );
  assert.equal(getGleanContact({ rep: "sales.rep@example.com" }), null);

  const response = await render("/", { initialFrom: "johndoe@example.com" });
  const html = await response.text();
  assert.doesNotMatch(html, /class="ae-contact-link"/i);
  assert.doesNotMatch(html, /mailto:/i);
});

test("maps GitHub Pages project URLs to canonical app routes", () => {
  const baseUrl = "/gleanedgelocus/";

  assert.equal(getAppPath("/gleanedgelocus/", baseUrl), "/");
  assert.equal(
    getAppPath("/gleanedgelocus/claude-vs-copilot/", baseUrl),
    "/claude-vs-copilot",
  );
  assert.equal(getAppPath("/elsewhere/route", baseUrl), "/elsewhere/route");
  assert.equal(getHostedPath("/", baseUrl), "/gleanedgelocus/");
  assert.equal(
    getHostedPath("/claude-vs-copilot", baseUrl),
    "/gleanedgelocus/claude-vs-copilot",
  );
  assert.equal(getHostedPath("/demo", "/"), "/demo");
});

test("keeps the personalization query while moving between routes", () => {
  assert.equal(
    getRouteUrl("/demo", {
      search: "?from=johndoe%40glean.com&utm_source=ae",
      hash: "#comparison",
    }),
    "/demo?from=johndoe%40glean.com&utm_source=ae#comparison",
  );
  assert.equal(
    getRouteUrl("/demo", {
      search: "?rep=john.doe%40glean.com&utm_source=rep",
      hash: "#comparison",
    }),
    "/demo?rep=john.doe%40glean.com&utm_source=rep#comparison",
  );
});

test("keeps exiting scenes out of layout while preserving motion preferences", () => {
  assert.equal(getSceneTransitionMode(true), "popLayout");
  assert.equal(getSceneTransitionMode(false), "popLayout");
  assert.equal(
    shouldUseStaticSceneTransition({ isPhoneViewport: true }),
    true,
  );
  assert.equal(
    shouldUseStaticSceneTransition({
      isPhoneViewport: false,
      prefersReducedMotion: false,
    }),
    false,
  );
  assert.equal(
    shouldUseStaticSceneTransition({ prefersReducedMotion: true }),
    true,
  );
});

test("leaves modified and already-handled keys to the browser", () => {
  assert.equal(shouldIgnorePresentationKey({}), false);
  assert.equal(shouldIgnorePresentationKey({ defaultPrevented: true }), true);

  for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
    assert.equal(
      shouldIgnorePresentationKey({ [modifier]: true }),
      true,
      `expected ${modifier} to bypass presentation navigation`,
    );
  }
});

function extractSceneWrapper(html) {
  const start = html.indexOf('<div class="scene-wrapper"');
  const end = html.indexOf('<div class="stepper', start);

  assert.notEqual(start, -1, "expected rendered scene wrapper");
  assert.notEqual(end, -1, "expected stepper after rendered scene wrapper");

  return html.slice(start, end);
}

test("server-renders the finished Glean Edge experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();

  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /<title>The Glean Edge<\/title>/i);
  assert.match(
    html,
    /class="app app--light-draft app--hero app--hero-draft app--hero-e"/i,
  );
  assert.match(html, /href="[^"]*\/favicon\.svg"/i);
  assert.doesNotMatch(extractSceneWrapper(html), />The Glean edge<\/p>/i);
  assert.match(html, /AI models compete\./i);
  assert.match(
    html,
    /class="s0e-final-headline"[\s\S]*class="s0e-headline-primary">AI models compete\.<\/span>[\s\S]*class="s0e-headline-emphasis">[\s\S]*Your[\s\S]*<strong>context<\/strong>[\s\S]*compounds\./i,
  );
  assert.doesNotMatch(html, /Headline explorer|Show headline alternative/i);
  assert.doesNotMatch(globalStyles, /\.headline-explorer/i);
  assert.match(
    globalStyles,
    /h1\.s0e-final-headline\s*\{[^}]*font-size:\s*clamp\(40px,\s*4\.3vw,\s*52px\)/i,
  );
  assert.doesNotMatch(html, /Switch the model\.|Show original headline:/i);
  assert.doesNotMatch(
    html,
    /The risk isn(?:&#x27;|')t choosing Claude or ChatGPT|The real risk is feeding the model/i,
  );
  assert.match(
    html,
    /Why enterprises choose Glean as their context layer/i,
  );
  assert.match(html, /Trusted answers start long before the prompt\./i);
  assert.match(html, /Glean prepares the context first/i);
  assert.match(
    html,
    /turns enterprise knowledge into relevant, governed context, then routes each workload/i,
  );
  assert.match(html, /approved model best suited to use it/i);
  assert.doesNotMatch(html, /Copy explorer|Show copy option/i);
  assert.match(html, /Open source/i);
  assert.match(
    html,
    /Permissions[\s\S]*Governance[\s\S]*Limits[\s\S]*Auditability/i,
  );
  assert.doesNotMatch(html, /Context persists and builds\. Models compete\./i);
  assert.doesNotMatch(html, /class="s0e-surface-head(?:line)?"/i);
  assert.doesNotMatch(globalStyles, /\.s0e-surface-head(?:line)?\s*\{/i);
  assert.doesNotMatch(html, /Glean enterprise context/i);
  assert.match(
    html,
    /class="s0e-route-note"[\s\S]*Swap models, not your entire platform\./i,
  );
  assert.equal(
    html.match(/Swap models, not your entire platform\./gi)?.length,
    1,
  );
  assert.doesNotMatch(html, /Stable foundation/i);
  assert.match(html, /data-model-swap="active"/i);
  assert.match(html, /Approved models; visual focus rotates between providers/i);
  assert.match(html, /OpenAI[^>]*style="--model-highlight:#10a37f"|style="--model-highlight:#10a37f"[^>]*>OpenAI/i);
  assert.match(html, /Anthropic[^>]*style="--model-highlight:#d5795c"|style="--model-highlight:#d5795c"[^>]*>Anthropic/i);
  assert.match(html, /Google[^>]*style="--model-highlight:#4285f4"|style="--model-highlight:#4285f4"[^>]*>Google/i);
  assert.match(html, /Open source[^>]*style="--model-highlight:#8aa11b"|style="--model-highlight:#8aa11b"[^>]*>Open source/i);
  assert.match(
    globalStyles,
    /\.s0e-model-grid\s*>\s*span\.selected\s*\{[^}]*border-color:\s*var\(--model-highlight\)/i,
  );
  assert.doesNotMatch(html, /Active route follows the highlighted model/i);
  assert.match(
    html,
    /aria-label="Editorial Glean versus Claude Cowork benchmark verdict"/i,
  );
  assert.match(html, /vs\. Claude Cowork/i);
  assert.match(html, /As of[\s\S]*August 2026/i);
  assert.match(html, /81%[\s\S]*lower[\s\S]*token cost per task\./i);
  assert.match(html, /Glean preferred overall:[\s\S]*78%/i);
  assert.match(html, /Benchmark details/i);
  assert.match(
    globalStyles,
    /\.s0e-verdict-statement\s*>\s*span\s*\{[^}]*justify-content:\s*center[^}]*text-align:\s*center/i,
  );
  assert.doesNotMatch(extractSceneWrapper(html), /31%|70%/i);
  assert.match(
    html,
    /aria-label="Selected Glean customers"[\s\S]*Databricks[\s\S]*Grammarly[\s\S]*Zillow[\s\S]*Confluent[\s\S]*Reddit[\s\S]*Duolingo[\s\S]*Booking\.com[\s\S]*Cursor[\s\S]*MongoDB[\s\S]*HubSpot[\s\S]*Zapier/i,
  );
  assert.doesNotMatch(
    html,
    /Canva|Snap Inc\.|Rivian|Plaid|Zscaler|Instacart/i,
  );
  assert.match(html, /class="s0e-customer-track"/i);
  assert.match(
    globalStyles,
    /\.s0e-customer-rail\s*\{[^}]*opacity:\s*0\.46[^}]*filter:\s*grayscale\(1\)/i,
  );
  assert.match(
    globalStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.s0e-customer-track\s*\{[^}]*animation:\s*none/i,
  );
  assert.doesNotMatch(html, /preferred as often|Same harness|Built once/i);
  assert.doesNotMatch(
    html,
    /~175[\s\S]*Cowork-style queries|Context layer changed/i,
  );
  assert.doesNotMatch(html, /<strong>Model flexibility<\/strong>/i);
  assert.doesNotMatch(html, /Interactive briefing/i);
  assert.doesNotMatch(html, /Page 1 design drafts/i);
  assert.doesNotMatch(html, /1A: Original design|1B: Editorial design/i);
  assert.doesNotMatch(html, /proof-row-switcher|Step 1 proof row options/i);
  assert.doesNotMatch(globalStyles, /\.proof-row-switcher/i);
  assert.match(html, /Step 1[\s\S]*Overview/i);
  assert.match(
    html,
    /href="https:\/\/www\.glean\.com\/blog\/go-glean-cowork"/i,
  );
  assert.doesNotMatch(
    html,
    /href="https:\/\/www\.glean\.com\/blog\/cowork-mcp-eval"/i,
  );
  assert.equal((html.match(/Go to step \d+,/g) ?? []).length, 11);
  assert.doesNotMatch(html, /—|&mdash;|&#8212;/i);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/i);
});

for (const removedDraftPath of [
  "/page-1b",
  "/page-1c",
  "/page-1d",
  "/page-1e",
]) {
  test(`falls back to the finalized overview for removed draft ${removedDraftPath}`, async () => {
    const response = await render(removedDraftPath);
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(
      html,
      /class="app app--light-draft app--hero app--hero-draft app--hero-e"/i,
    );
    assert.match(
      html,
      /Models compete\.[\s\S]*Your[\s\S]*context[\s\S]*compounds\./i,
    );
    assert.doesNotMatch(html, /Headline explorer|Show headline alternative/i);
    assert.doesNotMatch(
      html,
      /Editorial system|Product story|Evidence first|Build the understanding/i,
    );
    assert.match(html, /As of[\s\S]*August 2026/i);
    assert.match(html, /81%[\s\S]*lower[\s\S]*token cost per task\./i);
    assert.match(html, /Glean preferred overall:[\s\S]*78%/i);
    assert.doesNotMatch(html, /proof-row-switcher/i);
    assert.equal((html.match(/Go to step \d+,/g) ?? []).length, 11);
  });
}

for (const legacyOverviewPath of [
  "/overview/outcomes",
  "/overview/balanced",
  "/overview/verdict",
  "/overview/equation",
  "/overview/ledger",
]) {
  test(`server-renders the finalized overview for former review route ${legacyOverviewPath}`, async () => {
    const response = await render(legacyOverviewPath);
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(
      html,
      /class="app app--light-draft app--hero app--hero-draft app--hero-e"/i,
    );
    assert.match(
      html,
      /aria-label="Editorial Glean versus Claude Cowork benchmark verdict"/i,
    );
    assert.match(html, /As of[\s\S]*August 2026/i);
    assert.match(html, /81%[\s\S]*lower[\s\S]*token cost per task\./i);
    assert.match(html, /Glean preferred overall:[\s\S]*78%/i);
    assert.match(html, /Benchmark details/i);
    assert.doesNotMatch(extractSceneWrapper(html), /31%|70%/i);
    assert.match(
      html,
      /href="https:\/\/www\.glean\.com\/blog\/go-glean-cowork"/i,
    );
    assert.doesNotMatch(html, /proof-row-switcher/i);
    assert.match(html, /Step 1[\s\S]*Overview/i);
    assert.equal((html.match(/Go to step \d+,/g) ?? []).length, 11);
  });
}

const selectedLightSteps = [
  {
    path: "/model-flexibility",
    legacyPaths: ["/page-2b", "/model-flexibility/architecture"],
    step: "2",
    label: "Model Flexibility",
    sceneClass: "s-model-flex",
  },
  {
    path: "/question",
    legacyPaths: ["/page-3b"],
    step: "3",
    label: "The Question",
    sceneClass: "s1",
  },
  {
    path: "/federated-search",
    legacyPaths: ["/page-4b"],
    step: "4",
    label: "Federated MCP",
    sceneClass: "s2",
  },
  {
    path: "/glean-index",
    legacyPaths: ["/page-5b"],
    step: "5",
    label: "Glean Index",
    sceneClass: "s3",
  },
  {
    path: "/demo",
    legacyPaths: ["/page-6b"],
    step: "6",
    label: "Live Demo",
    sceneClass: "s-demo",
  },
  {
    path: "/benchmark",
    legacyPaths: ["/model-flexibility/approved-benchmark"],
    step: "7",
    label: "Efficiency Benchmark",
    sceneClass: "s-efficiency s-efficiency-approved",
    variant: "f",
  },
  {
    path: "/governance",
    legacyPaths: [],
    step: "8",
    label: "Governance",
    sceneClass: "s-governance",
  },
  {
    path: "/claude-vs-copilot",
    legacyPaths: [],
    step: "9",
    label: "Claude vs Copilot",
    sceneClass: "s-assistant-comparison",
  },
  {
    path: "/beyond-search",
    legacyPaths: ["/page-7b"],
    step: "10",
    label: "Beyond Search",
    sceneClass: "s6",
  },
  {
    path: "/takeaway",
    legacyPaths: ["/page-8b", "/page-9b"],
    step: "11",
    label: "Takeaway",
    sceneClass: "s7",
  },
];

for (const selected of selectedLightSteps) {
  const variant = selected.variant ?? "b";

  test(`server-renders ${selected.path} as the selected light design for step ${selected.step}`, async () => {
    const response = await render(selected.path);
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(
      html,
      new RegExp(
        `class="app app--light-draft app--step-${selected.step} app--variant-${variant}"`,
        "i",
      ),
    );
    assert.match(
      html,
      new RegExp(`class="scene ${selected.sceneClass}(?: [^"]+)?"`, "i"),
    );
    assert.doesNotMatch(html, /class="scene light-scene/i);
    assert.doesNotMatch(html, /class="hero-draft-switcher"/i);
    assert.doesNotMatch(html, /class="proof-row-switcher"/i);
    assert.doesNotMatch(
      html,
      /<span class="hero-draft-switcher-label">Compare<\/span>/i,
    );
    assert.doesNotMatch(
      html,
      new RegExp(
        `Page ${selected.step} design drafts|aria-label="${selected.step}[AB]:`,
        "i",
      ),
    );
    assert.match(
      html,
      new RegExp(`Step ${selected.step}[\\s\\S]*${selected.label}`, "i"),
    );
    assert.equal((html.match(/Go to step \d+,/g) ?? []).length, 11);
    assert.doesNotMatch(html, /—|&mdash;|&#8212;/i);
    assert.doesNotMatch(
      html,
      new RegExp(`Go to step ${selected.step}[AB],`, "i"),
    );

    for (const legacyPath of selected.legacyPaths) {
      const legacyResponse = await render(legacyPath);
      assert.equal(legacyResponse.status, 200);
      const legacyHtml = await legacyResponse.text();
      assert.match(
        legacyHtml,
        new RegExp(
          `class="app app--light-draft app--step-${selected.step} app--variant-${variant}"`,
          "i",
        ),
      );
      assert.doesNotMatch(legacyHtml, /class="hero-draft-switcher"/i);
      assert.equal(
        extractSceneWrapper(html),
        extractSceneWrapper(legacyHtml),
        `${legacyPath} should render the selected ${selected.path} scene exactly`,
      );
    }
  });
}

test("shows source, data, agent, and action governance on the governance slide", async () => {
  const response = await render("/governance");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sceneHtml = extractSceneWrapper(html);
  assert.match(sceneHtml, /source permissions/i);
  assert.match(sceneHtml, /document-level permissions/i);
  assert.match(sceneHtml, /confidential and PII/i);
  assert.match(sceneHtml, /DLP controls/i);
  assert.match(sceneHtml, /moderators govern/i);
  assert.match(sceneHtml, /person confirms/i);
  assert.match(sceneHtml, /audit trail/i);
  assert.match(sceneHtml, /One governed workflow/i);
  assert.match(sceneHtml, /Most connectors to set up/i);
  assert.match(sceneHtml, /Typical IT involvement/i);
});

test("compares Claude and Copilot without claiming identical governance", async () => {
  const response = await render("/claude-vs-copilot");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sceneHtml = extractSceneWrapper(html);
  assert.match(sceneHtml, /Claude/);
  assert.match(sceneHtml, /Copilot/);
  assert.match(sceneHtml, /permission-aware, user-relevant context/i);
  assert.match(sceneHtml, /Glean MCP/i);
  assert.match(sceneHtml, /sharing hygiene/i);
  assert.match(sceneHtml, /Confirm the exact plan, tenant/i);
  assert.match(sceneHtml, /Make Glean the default for broad business work/i);
  assert.match(sceneHtml, /Do not assume an assistant fixes overshared content/i);
  assert.doesNotMatch(sceneHtml, /Copilot (?:has nothing|has no controls)/i);
});

test("renders a trailing-slash route before the client normalizes its URL", async () => {
  const response = await render("/glean-index/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(
    html,
    /class="app app--light-draft app--step-5 app--variant-b"/i,
  );
});

test("keeps the updated savings-to-moat transition at step 10", async () => {
  const response = await render("/beyond-search");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Saving tokens is one headline\.[\s\S]*Here(?:&#x27;|')s the moat:/i,
  );
  assert.doesNotMatch(html, /Tokens are the headline/i);
});

for (const removedRouterPath of ["/model-router"]) {
  test(`falls back to the overview for removed router route ${removedRouterPath}`, async () => {
    const response = await render(removedRouterPath);
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(html, /Step 1[\s\S]*Overview/i);
    assert.doesNotMatch(html, /class="scene s-router"/i);
    assert.equal((html.match(/Go to step \d+,/g) ?? []).length, 11);
  });
}

test("keeps the dormant model router implementation available for revival", () => {
  assert.match(routerSceneSource, /export default function SceneRouter\(\)/i);
  assert.match(routerSceneSource, /className="scene s-router"/i);
  assert.match(
    globalStyles,
    /\.s-router-route\s*\{[^}]*container-name:\s*router-route;[^}]*container-type:\s*inline-size;/i,
  );
  assert.match(
    globalStyles,
    /@container router-route \(min-width:\s*340px\)\s*\{[\s\S]*?\.s-router-route-copy\s*\{[^}]*display:\s*flex;[\s\S]*?\.s-router-route-copy\s*>\s*\.s-router-provider-pills\s*\{[^}]*flex-wrap:\s*nowrap;[^}]*margin-top:\s*0;/i,
  );
});

test("keeps the streamlined prism question scene at step 3", async () => {
  const questionResponse = await render("/question");
  assert.equal(questionResponse.status, 200);
  const questionHtml = await questionResponse.text();
  assert.match(questionHtml, /Flexible model selection is the start\./i);
  assert.match(
    questionHtml,
    /Context architecture shapes the[\s\S]*class="s1-headline-answer">answer\.<\/strong>/i,
  );
  assert.match(
    globalStyles,
    /\.s1-headline\s*>\s*span\s*\{[^}]*display:\s*block/i,
  );
  assert.doesNotMatch(
    questionHtml,
    /Glean grounds (?:it|all of your LLMs) (?:with|in) indexed, governed enterprise knowledge for higher-quality answers and additional savings/i,
  );
  assert.match(questionHtml, /Start with a real question/i);
  assert.doesNotMatch(questionHtml, /Step 3 visual design options/i);
  assert.doesNotMatch(questionHtml, /Show (?:Current|Prism|Ribbon|Signal) Step 3 design/i);
  assert.match(questionHtml, /splitting through a prism into two context approaches/i);
  assert.equal((questionHtml.match(/data-step3-question/gi) ?? []).length, 1);
  assert.equal((questionHtml.match(/data-context-approach=/gi) ?? []).length, 2);
  assert.equal((questionHtml.match(/data-fork-origin=/gi) ?? []).length, 1);
  assert.equal((questionHtml.match(/data-fork-path=/gi) ?? []).length, 2);
  assert.equal((questionHtml.match(/data-fork-destination=/gi) ?? []).length, 2);
  assert.doesNotMatch(questionHtml, /class="s1-cursor"/i);
  assert.match(
    questionHtml,
    /class="s1-tagline-followup"[^>]*>\s*Watch what each one asks the LLM to do with its context window\.\s*<\/span>/i,
  );
  assert.doesNotMatch(
    questionHtml,
    /Watch what each one asks the LLM to do with its context window\.\s*→/i,
  );
  assert.match(
    questionHtml,
    /class="s1-tagline-video-skip"[^>]*>\s*Short on time\? Skip to the 1-minute video on slide 6 →\s*<\/button>/i,
  );
  assert.match(
    globalStyles,
    /\.s1-tagline-video-skip\s*\{[^}]*margin-top:\s*18px[^}]*font-size:\s*15px[^}]*font-style:\s*italic[^}]*font-weight:\s*500[^}]*opacity:\s*0\.6[^}]*text-decoration:\s*none/i,
  );
  assert.match(
    globalStyles,
    /@media\s*\(min-width:\s*901px\)[\s\S]*\.app--step-3 \.s1-tagline-video-skip\s*\{[^}]*position:\s*absolute[^}]*bottom:\s*clamp\(36px,\s*6vh,\s*48px\)[^}]*left:\s*50%[^}]*margin-top:\s*0[^}]*transform:\s*translateX\(-50%\)/i,
  );
  assert.match(questionHtml, /Step 3/i);
});

test("keeps the desktop video shortcut anchored while its tagline appears", () => {
  const taglineMotion = questionSceneSource.match(
    /<motion\.div\s+className="s1-tagline"[\s\S]*?<\/motion\.div>/,
  )?.[0];

  assert.ok(taglineMotion);
  assert.doesNotMatch(taglineMotion, /\by\s*:/);
});

test("reserves delayed step 4 and step 5 content before animation", async () => {
  const step4Html = await (await render("/federated-search")).text();
  const step5Html = await (await render("/glean-index")).text();

  assert.match(step4Html, /Context approach 1[\s\S]*Federated MCP/i);
  assert.match(step4Html, /Missing cross-source relevance ranking\./i);
  assert.match(step5Html, /Context approach 2[\s\S]*Glean Index/i);
  assert.match(step4Html, /class="s2-fan-svg"/i);
  assert.equal(
    (step4Html.match(/class="s2-token(?:\s|")/g) ?? []).length,
    60,
  );
  assert.match(step4Html, /class="s2-grid" aria-hidden="true"/i);
  assert.match(step5Html, /class="s3-signals" aria-hidden="true"/i);
  assert.match(step5Html, /Ranking signals/i);
});

test("keeps the step 5 scan motion while using a darker green sweep", async () => {
  const response = await render("/glean-index");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /id="sweepGrad"[\s\S]*rgba\(53,120,69,0\)[\s\S]*rgba\(53,120,69,0\.5\)[\s\S]*rgba\(53,120,69,0\)/i,
  );
});

test("keeps the original subheader above the step 6 video", async () => {
  const response = await render("/demo");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visibleText = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ");
  assert.match(
    visibleText,
    /When Claude \(left\) uses app-by-app MCP connectors, it searches each application live\. Glean \(right\) already knows where to look\./i,
  );
  assert.match(
    visibleText,
    /Most poor results from AI aren’t hallucinations\. The LLM simply never saw the right document\./i,
  );
  assert.match(
    html,
    /class="s-demo-card"[\s\S]*class="s-demo-takeaway"/i,
  );
  assert.match(
    html,
    /class="material-symbols-rounded s-demo-takeaway-icon" aria-hidden="true">\s*emoji_objects/i,
  );
  assert.match(visibleText, /Muted by default/i);
  assert.doesNotMatch(visibleText, /unmute anytime/i);
  assert.doesNotMatch(visibleText, /nasa-program-query\.mov/i);
  assert.doesNotMatch(visibleText, /no audio/i);
  assert.match(html, /Step 6/i);
});

test("starts the narrated video muted while making sound controls clear", () => {
  assert.match(demoSceneSource, /runtime:\s*"1:24"/);
  assert.match(demoSceneSource, /controls=\{playing\}/);
  assert.match(demoSceneSource, /muted=\{muted\}/);
  assert.match(demoSceneSource, /v\.muted\s*=\s*true/);
  assert.match(
    demoSceneSource,
    /controlsList="nodownload noplaybackrate"/,
  );
  assert.doesNotMatch(demoSceneSource, /novolume|s-demo-no-audio/);
  assert.doesNotMatch(
    demoSceneSource,
    /s-demo-chrome-meta|s-demo-chrome-lights|nasa-program-query\.mov/,
  );
  assert.match(demoSceneSource, /aria-label="Unmute voiceover"/);
  assert.match(demoSceneSource, /className="s-demo-sound-label">Turn sound on/);
  assert.match(demoSceneSource, /onVolumeChange=/);
  assert.match(demoSceneSource, /className="s-demo-fullscreen"/);
  assert.match(demoSceneSource, /requestFullscreen\(\)/);
  assert.match(demoSceneSource, /webkitEnterFullscreen\(\)/);
  assert.doesNotMatch(
    globalStyles,
    /\.s-demo-video::\-webkit-media-controls-(?:mute-button|volume-slider)/i,
  );
  assert.match(
    globalStyles,
    /\.s-demo-stage\s*\{[^}]*aspect-ratio:\s*2048\s*\/\s*928/i,
  );
  assert.match(globalStyles, /\.s-demo-video\s*\{[^}]*object-fit:\s*cover/i);
  assert.match(
    globalStyles,
    /\.s-demo-sound\s*\{[^}]*left:\s*clamp\([^}]*bottom:\s*clamp\(/i,
  );
  assert.match(
    globalStyles,
    /@media\s*\(max-width:\s*720px\)[\s\S]*\.s-demo-sound\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/i,
  );
  assert.match(
    globalStyles,
    /@media\s*\(max-width:\s*720px\)[\s\S]*\.s-demo-sound-label\s*\{[^}]*display:\s*none/i,
  );
  assert.match(
    globalStyles,
    /\.s-demo-fullscreen\s*\{[^}]*width:\s*46px[^}]*height:\s*46px/i,
  );
});

test("shows the expanded provider list and paired resource links on step 10", async () => {
  const response = await render("/beyond-search");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Anthropic, OpenAI, Google, Open Source/i,
  );
  assert.match(
    html,
    /href="https:\/\/developers\.glean\.com"[^>]*>\s*Developer Docs/i,
  );
  assert.match(
    html,
    /href="https:\/\/www\.glean\.com\/platform\/ai-gateway"[^>]*>\s*AI Gateway/i,
  );
  assert.match(
    html,
    /href="https:\/\/trust\.glean\.com"[^>]*>\s*Trust Center/i,
  );
  assert.match(
    html,
    /href="https:\/\/www\.glean\.com\/blog\/agentic-security-aware"[^>]*>\s*AWARE Framework/i,
  );
});

test("keeps the SmartContext takeaway copy on the light step 11", async () => {
  const response = await render("/takeaway");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sceneHtml = extractSceneWrapper(html);
  assert.match(html, /Step 11/i);
  assert.match(html, /Takeaway/i);
  assert.match(sceneHtml, /Index first\.[\s\S]*Retrieve precisely\./i);
  assert.match(sceneHtml, /Every token to the LLM is[\s\S]*earned\./i);
  assert.match(sceneHtml, /Better retrieval[\s\S]*&gt; bigger context windows\./i);
  assert.match(sceneHtml, /100\+ indexed sources/i);
  assert.match(
    sceneHtml,
    /class="s7-stage-label">Curated context<\/span>[\s\S]*class="s7-stage-supplement">[\s\S]*MCP sources as needed/i,
  );
  assert.match(
    globalStyles,
    /\.s7-stage-supplement\s*\{[^}]*position:\s*absolute[^}]*top:\s*calc\(100%\s*-\s*2px\)[^}]*left:\s*50%[^}]*transform:\s*translateX\(-50%\)/i,
  );
  assert.doesNotMatch(
    sceneHtml,
    /Index once|Govern once|Route continuously|Switch models|Not platforms|Map your workload mix/i,
  );
  assert.match(
    sceneHtml,
    /href="https:\/\/www\.glean\.com\/blog\/go-glean-cowork"[^>]*>[\s\S]*Glean saves 81% on token costs vs Cowork - Aug 2026/i,
  );
  assert.doesNotMatch(sceneHtml, /cowork-mcp-eval|off-the-shelf MCP/i);
  assert.doesNotMatch(html, /Market Proof/i);
});

test("adds a directional price-performance scene as step 2", async () => {
  const response = await render("/model-flexibility");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visibleText = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
  assert.match(
    visibleText,
    /Smarter models can now cost less.*Model flexibility is becoming the expectation/is,
  );
  assert.match(
    visibleText,
    /Three recent comparisons from August 2026 make the shift concrete/i,
  );
  assert.match(visibleText, /Everyday task comparison/i);
  assert.match(visibleText, /Open-model default contender/i);
  assert.match(
    visibleText,
    /GPT‑5\.6 Sol.*Claude Opus 4\.8.*↑.*Generally Smarter.*Widely considered.*↓.*Lower.*Cost per completed task/is,
  );
  assert.match(
    visibleText,
    /GPT‑5\.6 Terra.*Claude Sonnet 5.*↑.*Generally Smarter.*Widely considered.*↓.*Much lower.*Cost per completed task/is,
  );
  assert.match(
    visibleText,
    /GLM‑5\.2.*GPT‑5\.4.*≈.*Similar.*Intelligence.*↓.*Much lower.*Cost per completed task/is,
  );
  assert.equal((visibleText.match(/↓/g) ?? []).length, 3);
  assert.equal((visibleText.match(/↑/g) ?? []).length, 2);
  assert.equal((visibleText.match(/≈/g) ?? []).length, 1);
  assert.match(
    visibleText,
    /Leadership can change with every model release/i,
  );
  assert.match(visibleText, /Change the model\. Keep the brain\./i);
  assert.match(
    visibleText,
    /By default, Glean selects the best-fit approved model.*balancing quality and cost.*users can manually choose from admin-enabled models.*admins can set spend limits/is,
  );
  assert.match(
    globalStyles,
    /\.s-model-shift-glean-content\s*\{[^}]*grid-template-columns:\s*minmax\(240px,\s*1fr\)\s*minmax\(0,\s*2fr\)/i,
  );
  assert.match(
    globalStyles,
    /@media\s*\(min-width:\s*1180px\)[\s\S]*?\.s-model-shift-routing-choice\s*\{[^}]*display:\s*block/i,
  );
  assert.doesNotMatch(
    visibleText,
    /Copy direction|local preview|Best-fit routing|Governed choice|Market leverage/i,
  );
  assert.doesNotMatch(visibleText, /Portable context|Route for value/i);
  assert.match(visibleText, /Directional market view as of August 3 2026/i);
  assert.match(visibleText, /Validate against your own use cases/i);
  assert.match(visibleText, /Step 2/i);
  assert.doesNotMatch(visibleText, /Step 2a|Step 2b/i);

  const renderedPage = html.split('<script id="_R_">')[0];
  const sceneHtml =
    renderedPage
      .split('<div class="scene s-model-flex">')[1]
      ?.split('</div></div></div><div class="stepper">')[0] ?? renderedPage;
  assert.equal(
    (sceneHtml.match(/class="s-model-shift-proof /g) ?? []).length,
    3,
  );
  assert.match(sceneHtml, /s-model-shift-proof--sol/);
  assert.match(sceneHtml, /s-model-shift-proof--terra/);
  assert.match(sceneHtml, /s-model-shift-proof--glm/);
  assert.equal(
    (sceneHtml.match(/class="s-model-shift-glean-content"/g) ?? []).length,
    1,
  );
  assert.equal(
    (sceneHtml.match(/s-model-shift-router-mark/g) ?? []).length,
    1,
  );
  assert.match(
    sceneHtml,
    /s-model-shift-router-mark" aria-hidden="true">alt_route</i,
  );
  assert.doesNotMatch(sceneHtml, /aria-pressed|s-model-shift-copy-picker/i);
  assert.doesNotMatch(globalStyles, /\.s-model-shift-copy-picker/i);
  assert.doesNotMatch(sceneHtml, />G<\/span>/);
  assert.doesNotMatch(sceneHtml, /\u2014/);
  assert.doesNotMatch(
    sceneHtml,
    /Artificial Analysis|Epoch|Arena|ECI|Index score|quadrant/i,
  );
  assert.doesNotMatch(
    sceneHtml,
    /less intelligent|higher cost per task|much higher cost/i,
  );
  assert.doesNotMatch(sceneHtml, /substantially lower/i);
  assert.doesNotMatch(sceneHtml, /\d+%|\$\d+/i);
  assert.doesNotMatch(
    sceneHtml,
    /max effort|xhigh effort|Two comparisons in detail/i,
  );

  const step1 = html.indexOf("Go to step 1, Overview");
  const step2 = html.indexOf("Go to step 2, Model Flexibility");
  const step3 = html.indexOf("Go to step 3, The Question");
  assert.ok(step1 !== -1 && step1 < step2 && step2 < step3);
});

test("adds the approved efficiency benchmark after the live demo as step 7", async () => {
  const response = await render("/benchmark");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visibleText = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

  assert.match(
    html,
    /class="app app--light-draft app--step-7 app--variant-f"/i,
  );
  assert.match(
    visibleText,
    /Versus Claude Cowork, two efficiency gains.*compound into 81% lower token cost per task/is,
  );
  assert.match(
    visibleText,
    /Glean combines model flexibility with an efficient, accurate context layer/i,
  );
  assert.match(
    visibleText,
    /Blended cost per million tokens.*Glean averages 31% lower.*Token efficiency.*Glean consumes 70% fewer tokens.*Cost per task.*Glean saves 81%/is,
  );
  assert.match(
    visibleText,
    /\$0\.46 Glean.*\$0\.68 Claude Cowork.*1\.3m Glean.*4\.4m Claude Cowork.*\$0\.58 Glean.*\$2\.98 Claude Cowork/is,
  );
  assert.match(visibleText, /78% Glean preferred/i);
  assert.match(
    visibleText,
    /Overall preference: which response graders would actually use on the job\. Also assessed: correctness, completeness, and interaction quality/i,
  );
  assert.doesNotMatch(
    visibleText,
    /Glean internal eval|180\+ synthetic enterprise tasks|using Glean production data/i,
  );
  assert.match(
    visibleText,
    /Sonnet 5 \(Claude’s “recommended model for everyday work”\), high reasoning/i,
  );
  assert.match(visibleText, /Reported figures rounded/i);
  assert.doesNotMatch(visibleText, /Token costs only/i);
  assert.match(
    html,
    /href="https:\/\/www\.glean\.com\/blog\/go-glean-cowork"/i,
  );
  assert.doesNotMatch(visibleText, /Metric breakdown/i);
  assert.doesNotMatch(
    html,
    /href="https:\/\/www\.glean\.com\/platform\/intelligence"/i,
  );
  assert.match(
    globalStyles,
    /\.s-efficiency-source-links\s*>\s*a\s*\{[^}]*font-size:\s*11px/i,
  );
  assert.doesNotMatch(
    html,
    /variant-switcher|proof-row-switcher|Slide 2 options|s-approved-kicker/i,
  );
  assert.match(
    globalStyles,
    /\.s-approved-title\s*>\s*span\s*\{[^}]*display:\s*inline/i,
  );
  assert.match(visibleText, /Step 7.*Efficiency Benchmark/is);

  const demo = html.indexOf("Go to step 6, Live Demo");
  const benchmark = html.indexOf("Go to step 7, Efficiency Benchmark");
  const governance = html.indexOf("Go to step 8, Governance");
  const comparison = html.indexOf("Go to step 9, Claude vs Copilot");
  const beyond = html.indexOf("Go to step 10, Beyond Search");
  const takeaway = html.indexOf("Go to step 11, Takeaway");
  assert.ok(
    demo !== -1 &&
      demo < benchmark &&
      benchmark < governance &&
      governance < comparison &&
      comparison < beyond &&
      beyond < takeaway,
  );
});

test("keeps new benchmark text and data marks above minimum contrast", () => {
  const hexFromRule = (selector, property) => {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const block = globalStyles.match(
      new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "i"),
    )?.[1];
    const value = block?.match(
      new RegExp(`${property}:\\s*(#[0-9a-f]{6})`, "i"),
    )?.[1];

    assert.ok(value, `Expected ${property} in ${selector}`);
    return value;
  };
  const luminance = (hex) => {
    const channels = hex
      .slice(1)
      .match(/.{2}/g)
      .map((channel) => Number.parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      );

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (foreground, background) => {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  };

  for (const [selector, background] of [
    [".s-approved-panel h2", "#eeeef0"],
    [".s-efficiency-approved .s-approved-source", "#fbfaf7"],
    [".s-approved-quality > small", "#fbfaf7"],
    [".s0e-verdict-context > small", "#fbfaf7"],
  ]) {
    assert.ok(
      contrast(hexFromRule(selector, "color"), background) >= 4.5,
      `${selector} should meet WCAG AA normal-text contrast`,
    );
  }

  const coworkValue = hexFromRule(
    ".s-approved-bar-column--cowork .s-approved-value",
    "color",
  );
  const coworkBar = hexFromRule(
    ".s-approved-bar-column--cowork .s-approved-bar",
    "background",
  );
  assert.ok(
    contrast(coworkValue, "#eeeef0") >= 3,
    "Claude Cowork values should meet WCAG AA large-text contrast",
  );
  assert.ok(
    contrast(coworkBar, "#eeeef0") >= 3,
    "Claude Cowork bars should meet minimum graphical-object contrast",
  );
});
