export const BENCHMARK_SOURCES = {
  epochLive: "https://epoch.ai/models/search",
  epochMethodology: "https://epoch.ai/data/eci-documentation/methodology",
  epochData: "https://epoch.ai/benchmarks/use-this-data",
  arena:
    "https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset/viewer/text_style_control/latest",
  openaiPricing: "https://developers.openai.com/api/docs/pricing",
  openaiChangelog: "https://developers.openai.com/api/docs/changelog",
  anthropicPricing:
    "https://platform.claude.com/docs/en/about-claude/pricing",
  googlePricing: "https://ai.google.dev/gemini-api/docs/pricing",
  zaiPricing: "https://docs.z.ai/guides/overview/pricing",
};

export const BENCHMARK_SNAPSHOT = {
  accessed: "July 30, 2026",
  arenaPublished: "July 27, 2026",
  epochModelCount: 196,
  inputTokens: 100_000,
  outputTokens: 20_000,
};

export const MODEL_PROVIDERS = [
  { id: "google", label: "Google", color: "#37b86b" },
  { id: "anthropic", label: "Anthropic", color: "#d5795c" },
  { id: "openai", label: "OpenAI", color: "#f4f5fb" },
  { id: "zai", label: "Z AI", color: "#3189f5" },
];

function standardizedTaskCost(inputPricePerMillion, outputPricePerMillion) {
  return (
    (BENCHMARK_SNAPSHOT.inputTokens / 1_000_000) * inputPricePerMillion +
    (BENCHMARK_SNAPSHOT.outputTokens / 1_000_000) * outputPricePerMillion
  );
}

/**
 * Capability is Epoch AI's published ECI score. ECI is itself a composite of
 * 50+ benchmarks. Arena fields are a separate, style-controlled preference
 * cross-check; they are not blended into ECI because exact Luna and Terra
 * variants are not present in the Arena snapshot.
 *
 * Cost is independently calculated from first-party standard list prices for
 * the fixed uncached workload above. It excludes batch/flex/fast tiers,
 * caching, tools, regional routing, negotiated discounts, and long-context
 * premiums.
 */
export const MODEL_BENCHMARK_POINTS = [
  {
    name: "GPT-5.6 Luna",
    provider: "openai",
    cost: standardizedTaskCost(0.2, 1.2),
    eci: 155,
    arenaRating: null,
    arenaRank: null,
    arenaVariant: null,
    labelSide: "east",
    labelOffsetY: -16,
  },
  {
    name: "Gemini 3.1 Flash-Lite",
    provider: "google",
    cost: standardizedTaskCost(0.25, 1.5),
    eci: 144,
    arenaRating: 1432.281,
    arenaRank: 84,
    arenaVariant: "gemini-3.1-flash-lite-preview",
    labelSide: "east",
    labelOffsetY: 0,
  },
  {
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    cost: standardizedTaskCost(1, 5),
    eci: 143,
    arenaRating: 1412.408,
    arenaRank: 118,
    arenaVariant: "claude-haiku-4-5-20251001",
    labelSide: "east",
    labelOffsetY: 0,
  },
  {
    name: "GLM-5.2",
    provider: "zai",
    cost: standardizedTaskCost(1.4, 4.4),
    eci: 151,
    arenaRating: 1469.394,
    arenaRank: 31,
    arenaVariant: "glm-5.2-max",
    labelSide: "east",
    labelOffsetY: 0,
  },
  {
    name: "Gemini 3.5 Flash",
    provider: "google",
    cost: standardizedTaskCost(1.5, 9),
    eci: 155,
    arenaRating: 1476.37,
    arenaRank: 18,
    arenaVariant: "gemini-3.5-flash-high",
    labelSide: "east",
    labelOffsetY: 18,
  },
  {
    name: "Claude Sonnet 5",
    provider: "anthropic",
    cost: standardizedTaskCost(2, 10),
    eci: 153,
    arenaRating: 1459.647,
    arenaRank: 43,
    arenaVariant: "claude-sonnet-5-high",
    labelSide: "east",
    labelOffsetY: 16,
  },
  {
    name: "GPT-5.6 Terra",
    provider: "openai",
    cost: standardizedTaskCost(2, 12),
    eci: 158,
    arenaRating: null,
    arenaRank: null,
    arenaVariant: null,
    labelSide: "east",
    labelOffsetY: -12,
  },
  {
    name: "Claude Opus 4.8",
    provider: "anthropic",
    cost: standardizedTaskCost(5, 25),
    eci: 158,
    arenaRating: 1484.125,
    arenaRank: 14,
    arenaVariant: "claude-opus-4-8-thinking",
    labelSide: "east",
    labelOffsetY: 14,
  },
  {
    name: "Claude Opus 5",
    provider: "anthropic",
    cost: standardizedTaskCost(5, 25),
    eci: 159,
    arenaRating: 1494.611,
    arenaRank: 5,
    arenaVariant: "claude-opus-5-max",
    labelSide: "west",
    labelOffsetY: -16,
  },
  {
    name: "GPT-5.6 Sol",
    provider: "openai",
    cost: standardizedTaskCost(5, 30),
    eci: 162,
    arenaRating: 1484.904,
    arenaRank: 13,
    arenaVariant: "gpt-5.6-sol-xhigh",
    labelSide: "east",
    labelOffsetY: -12,
  },
  {
    name: "Claude Fable 5",
    provider: "anthropic",
    cost: standardizedTaskCost(10, 50),
    eci: 161,
    arenaRating: 1507.62,
    arenaRank: 1,
    arenaVariant: "claude-fable-5",
    labelSide: "west",
    labelOffsetY: 14,
  },
];
