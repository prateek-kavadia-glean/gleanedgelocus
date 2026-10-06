export const GLEAN_COWORK_BENCHMARK = {
  sourceUrl: "https://www.glean.com/blog/go-glean-cowork",
  published: "Aug. 26, 2026",
  asOf: "August 2026",
  taskCount: "180+",
  gleanTokens: "1.3m",
  coworkTokens: "4.4m",
  tokenReduction: "70%",
  blendedTokenCostReduction: "31%",
  gleanBlendedCostPerMillion: "$0.46",
  coworkBlendedCostPerMillion: "$0.68",
  gleanTaskCost: "$0.58",
  coworkTaskCost: "$2.98",
  taskCostReduction: "81%",
  gleanPreference: "78%",
};

export function BenchmarkSource({ className = "" }) {
  return (
    <p className={`s-efficiency-source ${className}`.trim()}>
      <span>
        Glean auto routing vs. Claude Cowork on Sonnet 5 (Claude’s “recommended
        model for everyday work”), high reasoning · Reported figures rounded
      </span>
      <span className="s-efficiency-source-links">
        <a
          href={GLEAN_COWORK_BENCHMARK.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Benchmark, {GLEAN_COWORK_BENCHMARK.published}
          <span className="material-symbols-rounded" aria-hidden="true">
            north_east
          </span>
        </a>
      </span>
    </p>
  );
}
