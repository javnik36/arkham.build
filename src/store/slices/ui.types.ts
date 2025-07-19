import type { DeckFanMadeContent } from "../lib/types";
import type { Deck } from "./data.types";

export type UIState = {
  ui: {
    initialized: boolean;
    showUnusableCards: boolean;
    showLimitedAccess: boolean;
    fanMadeContentCache: Partial<DeckFanMadeContent>;
    navigationHistory: string[];
  };
};

export type UISlice = UIState & {
  setShowUnusableCards(value: boolean): void;
  setShowLimitedAccess(value: boolean): void;
  cacheFanMadeContent(decks: Deck[]): undefined;

  pushHistory(path: string): void;
  pruneHistory(index: number): void;
};
