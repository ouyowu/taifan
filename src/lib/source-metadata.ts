import { detectOfficialSource } from "@/lib/source-catalog";

export type SourceMetadata = {
  sourceCompany: string | null;
  sourceHandle: string | null;
  sourceLabel: string | null;
};

export function deriveSourceMetadata(sourceUrl: string, rawContent?: string): SourceMetadata {
  const match = detectOfficialSource(`${sourceUrl}\n${rawContent ?? ""}`);

  if (!match) {
    return {
      sourceCompany: null,
      sourceHandle: null,
      sourceLabel: null,
    };
  }

  return {
    sourceCompany: match.company,
    sourceHandle: match.handle,
    sourceLabel: `${match.label} ${match.handle}`,
  };
}
