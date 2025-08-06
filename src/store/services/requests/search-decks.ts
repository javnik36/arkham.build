import type { Deck } from "@/store/slices/data.types";
import { apiV2Request } from "./shared";

type DeckSearchRequestParams = {
  canonicalInvestigatorCode?: string;
  limit?: number;
  requiredCards?: string[];
};

type DeckSearchResponse = {
  meta: {
    offset: number;
    limit: number;
    total: number;
  };
  data: (Deck & {
    description_word_count: number;
    user_name: string;
    user_reputation: string;
    like_count: number;
  })[];
};

export async function searchDecks(params: DeckSearchRequestParams) {
  const search = new URLSearchParams();

  if (params.limit) {
    search.append("limit", String(params.limit));
  } else {
    search.append("limit", "10");
  }

  if (params.canonicalInvestigatorCode) {
    search.append("investigator", params.canonicalInvestigatorCode);
  }

  if (params.requiredCards) {
    for (const code of params.requiredCards) {
      search.append("with", code);
    }
  }

  const res = await apiV2Request(
    `/v2/public/arkhamdb-decklists/search?${search}`,
  );
  return res.json() as Promise<DeckSearchResponse>;
}
