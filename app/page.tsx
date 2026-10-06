import type { Metadata } from "next";
import GleanEdge from "./glean-edge/App";

export const metadata: Metadata = {
  description:
    "Why indexed enterprise context and open model routing beat federated search and model-family lock-in.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const initialFrom = typeof query.from === "string" ? query.from : null;
  const initialRep = typeof query.rep === "string" ? query.rep : null;

  return (
    <GleanEdge
      initialPath="/"
      initialFrom={initialFrom}
      initialRep={initialRep}
    />
  );
}
