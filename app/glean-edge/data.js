export const LOGOS = {
  salesforce: "https://app.glean.com/images/logos/salesforce.svg",
  jira: "https://app.glean.com/images/logos/jira3.svg",
  confluence: "https://app.glean.com/images/logos/confluence3.svg",
  gdrive: "https://app.glean.com/images/logos/gdrive3.svg",
  gmail: "https://app.glean.com/images/logos/gmail3.svg",
  teams: "https://app.glean.com/images/logos/teams.svg",
  servicenow: "https://app.glean.com/images/logos/servicenow.svg",
  gong: "https://app.glean.com/images/logos/gong.svg",
};

export const TOOLS = [
  { name: "Drive", logo: LOGOS.gdrive },
  { name: "Jira", logo: LOGOS.jira },
  { name: "Salesforce", logo: LOGOS.salesforce },
  { name: "Teams", logo: LOGOS.teams },
  { name: "Confluence", logo: LOGOS.confluence },
  { name: "ServiceNow", logo: LOGOS.servicenow },
  { name: "Gong", logo: LOGOS.gong },
  { name: "Gmail", logo: LOGOS.gmail },
];

export const NOISE_LABELS = [
  "Acme Bread Refund",
  "Acme Office Supplies",
  "Acme vending restock (pantry)",
  "Acme parking permit batch",
  "Acme corporate gym renewal",
  "Acme IT monitor RMA",
  "Acme onboarding (2022)",
  "Unrelated P3 ticket",
  "Old meeting notes",
  "#general lunch plans",
  "Archived runbook v2",
  "Q2 pipeline (stale)",
  "Setup checklist (draft)",
  "Org chart (outdated)",
  "Holiday schedule",
  "Training video link",
  "Offboarding template",
  "All-hands recap",
  "Random Slack thread",
  "Old pricing sheet",
  "Duplicate CRM entry",
  "Test account data",
  "Deprecated API doc",
  "Board deck v1",
  "Expired contract",
  "Cancelled meeting",
  "Draft proposal (empty)",
  "Unresolved comment",
  "Spam notification",
  "Auto-generated log",
];

export const RELEVANT_LABELS = [
  "Acme renewal - Q4 pricing",
  "Renewal risk flag (active)",
  "Latest Acme exec call",
];

export function buildFloodTokens(total = 42) {
  const tokens = [];
  let id = 0;
  let relevantCount = 0;
  for (let i = 0; i < total; i++) {
    const relevant = i === 9 || i === 23 || i === 33;
    if (relevant) relevantCount++;
    const toolIdx = i % TOOLS.length;
    tokens.push({
      id: id++,
      relevant,
      logo: TOOLS[toolIdx].logo,
      label: relevant
        ? RELEVANT_LABELS[(relevantCount - 1) % RELEVANT_LABELS.length]
        : NOISE_LABELS[i % NOISE_LABELS.length],
    });
  }
  return tokens;
}

export const TYPE_COLORS = {
  customer: "#FF8B5C",
  opportunity: "#D8FD49",
  person: "#86B6FF",
  company: "#C49BFF",
  project: "#5FE3C9",
  channel: "#FFB347",
  meeting: "#FF8FB1",
  doc: "#9AA3D6",
};

export const TYPE_LABELS = {
  customer: "Customer",
  opportunity: "Opp",
  person: "Person",
  meeting: "Meeting",
  channel: "Channel",
  project: "Project",
  doc: "Doc",
};

export const GRAPH_NODES = [
  { id: 0,  type: "customer",    label: "Acme Corp",        x: 60, y: 42, hit: true,  size: 3.4 },
  { id: 1,  type: "opportunity", label: "Q4 Renewal",       x: 80, y: 22, hit: true,  size: 3.0 },
  { id: 2,  type: "opportunity", label: "Expansion · EMEA", x: 36, y: 22, hit: false, size: 2.4 },
  { id: 3,  type: "person",      label: "S. Patel · AE",    x: 22, y: 40, hit: true,  size: 2.7 },
  { id: 4,  type: "person",      label: "M. Chen · CS",     x: 28, y: 70, hit: false, size: 2.4 },
  { id: 5,  type: "person",      label: "VP Sales",         x: 10, y: 24, hit: false, size: 2.4 },
  { id: 6,  type: "person",      label: "Acme · CTO",       x: 94, y: 48, hit: true,  size: 2.7 },
  { id: 7,  type: "person",      label: "Acme · Champion",  x: 100, y: 66, hit: false, size: 2.3 },
  { id: 8,  type: "channel",     label: "#acme-deal-room",  x: 46, y: 64, hit: true,  size: 2.7 },
  { id: 9,  type: "channel",     label: "#cs-acme",         x: 68, y: 70, hit: false, size: 2.3 },
  { id: 10, type: "meeting",     label: "Exec QBR · May 2", x: 60, y: 12, hit: true,  size: 2.7 },
  { id: 11, type: "meeting",     label: "Renewal sync",     x: 40, y: 50, hit: false, size: 2.2 },
  { id: 12, type: "project",     label: "Pricing v3",       x: 84, y: 56, hit: true,  size: 2.6 },
  { id: 13, type: "project",     label: "Onboarding",       x: 78, y: 76, hit: false, size: 2.3 },
  { id: 14, type: "doc",         label: "Contract · final", x: 108, y: 30, hit: true, size: 2.5 },
  { id: 15, type: "doc",         label: "Account plan",     x: 8,  y: 58, hit: false, size: 2.2 },
  { id: 16, type: "company",     label: "Acme Inc.",        x: 90, y: 10, hit: false, size: 2.4 },
  { id: 17, type: "person",      label: "RevOps",           x: 6,  y: 72, hit: false, size: 2.0 },
  { id: 18, type: "channel",     label: "#deals",           x: 110, y: 70, hit: false, size: 2.0 },
];

export const GRAPH_EDGES = [
  [0, 1, "opportunity"],
  [0, 3, "accountOwner"],
  [0, 6, "pointOfContact"],
  [0, 8, "relatedChannels"],
  [0, 16, "company"],
  [0, 4, "relatedPerson"],
  [1, 14, "linkedDoc"],
  [1, 10, "discussedIn"],
  [1, 12, "linkedProject"],
  [1, 3, "pointOfContact"],
  [3, 8, "channelMember"],
  [3, 11, "participatesIn"],
  [3, 5, "managerialChain"],
  [6, 10, "participant"],
  [6, 12, "createdBy"],
  [7, 6, "manager"],
  [2, 0, "customer"],
  [2, 5, "createdBy"],
  [13, 0, "linkedCustomer"],
  [13, 4, "activeContributor"],
  [4, 9, "channelMember"],
  [11, 5, "participant"],
  [17, 8, "channelMember"],
  [15, 0, "about"],
  [9, 13, "linkedTo"],
  [7, 10, "participant"],
  [18, 1, "discussedIn"],
];

export const RANKING_SIGNALS = [
  { label: "Semantic match", icon: "neurology" },
  { label: "Recency", icon: "schedule" },
  { label: "Personalization", icon: "person" },
  { label: "ACL-verified", icon: "lock" },
  { label: "Authority", icon: "verified" },
  { label: "Engagement", icon: "trending_up" },
  { label: "Entity resolution", icon: "hub" },
  { label: "Cross-source dedup", icon: "merge_type" },
];

export const GLEAN_RESULTS = [
  { label: "Acme renewal - Q4 pricing approved", source: "Salesforce", meta: "May 8" },
  { label: "Renewal risk: champion left Acme", source: "Gong", meta: "May 5" },
  { label: "Latest exec call summary", source: "Confluence", meta: "May 2" },
  { label: "Q4 contract terms (final)", source: "Drive", meta: "Apr 28" },
];

export const COMPARISON_ROWS = [
  {
    label: "Tokens for context",
    icon: "token",
    fedLabel: "Massive - flooded",
    gleanLabel: "Minimal - curated",
    fedPct: 88,
    gleanPct: 11,
  },
  {
    label: "Signal quality",
    icon: "target",
    fedLabel: "Noisy, lacks central brain.",
    gleanLabel: "Highly targeted cross-application context.",
    fedPct: 8,
    gleanPct: 92,
  },
  {
    label: "API/MCP Calls",
    icon: "cable",
    fedLabel: "One per tool",
    gleanLabel: "Single call",
    fedPct: 90,
    gleanPct: 12,
    hideRatio: true,
  },
  {
    label: "Latency",
    icon: "speed",
    fedLabel: "Slowest tool wins",
    gleanLabel: "Pulls from existing index",
    fedPct: 85,
    gleanPct: 10,
  },
  {
    label: "Permissions",
    icon: "lock",
    fedLabel: "Per-tool, fragile",
    gleanLabel: "Unified index w/ compliance-grade audit trail",
    fedPct: 78,
    gleanPct: 14,
  },
  {
    label: "Freshness",
    icon: "schedule",
    fedLabel: "Whatever each tool returns",
    gleanLabel: "Index w/ real-time hooks",
    fedPct: 62,
    gleanPct: 20,
  },
];

/** Single scenario used across the deck for a consistent story. */
export const DECK_QUESTION =
  "What's the latest status on the Acme renewal?";

export const BEYOND_CARDS = [
  {
    pillar: "Context",
    icon: "schedule",
    title: "Fresh unified context",
    body: "Webhooks and ongoing crawls keep the index fresh. Glean uses activity signals to rank what matters to each person. The knowledge graph goes beyond just knowing what docs exist - it knows how work actually gets done.",
    details: [
      ["check", "One context layer across tools"],
      ["check", "Relevance ranked across sources"],
      ["check", "Activity signals for what matters"],
    ],
  },
  {
    pillar: "Openness",
    icon: "extension",
    title: "Open by design",
    body: "Pick from leading models - no lock-in to a single family. Glean is the open, horizontal AI platform for work, bringing enterprise context into your existing IDE, apps, and agents.",
    bodyLinks: [
      {
        href: "https://developers.glean.com",
        label: "Developer Docs",
      },
      {
        href: "https://www.glean.com/platform/ai-gateway",
        label: "AI Gateway",
      },
    ],
    details: [
      ["check", "Anthropic, OpenAI, Google, Open Source"],
      ["check", "Bring Glean into Codex, Cursor, Claude, etc."],
      ["check", "APIs + SDKs for custom apps"],
    ],
  },
  {
    pillar: "Security",
    icon: "verified_user",
    title: "Permissions you can trust",
    body: "Source permissions are mirrored and checked during retrieval, down to the individual document or record. The model only receives context the user is already allowed to access.",
    bodyLinks: [
      { href: "https://trust.glean.com", label: "Trust Center" },
      {
        href: "https://www.glean.com/blog/agentic-security-aware",
        label: "AWARE Framework",
      },
    ],
    details: [
      ["check", "Mirrored permissions w/ 100+ connectors"],
      ["check", "Least-privilege access by default"],
      ["check", "SOC 2, ISO 27001, ISO 42001, HIPAA, GDPR"],
    ],
  },
  {
    pillar: "Governance",
    icon: "policy",
    title: "Admin controls that scale",
    body: "One policy layer across every surface: permissions, audit trails, and agent and action sharing rules in Glean Protect, plus acceptable use policies, restricted topics, continuous DLP, and runtime AI security in Protect+.",
    details: [
      ["check", "Restricted topics & usage policies"],
      ["check", "Sensitive findings / DLP"],
      ["check", "Agent & action governance"],
    ],
  },
];

export const TAKEAWAY_STATEMENTS = [
  { text: "Index first.", accent: "Retrieve precisely." },
  { text: "Every token to the LLM is", accent: "earned." },
  { text: "Better retrieval", accent: "> bigger context windows." },
];

export const TAKEAWAY_PIPELINE = [
  { label: "100+ indexed sources", icon: "cloud" },
  { label: "Glean Index", icon: "database" },
  {
    label: "Curated context",
    icon: "filter_alt",
    supplement: "MCP sources as needed",
  },
  { label: "Auto Router", icon: "route", kind: "router" },
  { label: "Best-fit LLM / Agent", icon: "psychology", kind: "final" },
];

// Customer logos. SVGs are bundled locally under public/customer-logos/<slug>.svg
// so we don't hit a third-party CDN on every render.
export const CUSTOMER_LOGOS = [
  [
    { name: "Databricks",  slug: "databricks",       color: "FF3621" },
    { name: "Grammarly",   slug: "grammarly",        color: "15C39A" },
    { name: "Zillow",      slug: "zillow",           color: "006AFF" },
    { name: "Redis",       slug: "redis",            color: "DC382D" },
    { name: "T-Mobile",    slug: "tmobile",          color: "E20074" },
    { name: "HubSpot",     slug: "hubspot",          color: "FF7A59" },
    { name: "DBS Bank",    slug: "dbsbank",          color: "FF0000" },
    { name: "Zapier",      slug: "zapier",           color: "FF4F00" },
    { name: "Confluent",   slug: "confluent",        color: "1264A3" },
  ],
  [
    { name: "MongoDB",     slug: "mongodb",          color: "47A248" },
    { name: "SoFi",        slug: "sofi",             color: "00A2C7" },
    { name: "Pure Storage", slug: "purestorage",     color: "FF6A13" },
    { name: "Cursor",      slug: "cursor",           color: "000000" },
    { name: "Reddit",      slug: "reddit",           color: "FF4500" },
    { name: "Duolingo",    slug: "duolingo",         color: "58CC02" },
    { name: "Pinterest",   slug: "pinterest",        color: "E60023" },
    { name: "Roku",        slug: "roku",             color: "6D2C8F" },
    { name: "Booking.com", slug: "bookingdotcom",    color: "003580" },
  ],
];
