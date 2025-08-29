import type { ChangeRecord } from "../lib/deck-edits";
import type { Deck, Id } from "../schemas/deck.schema";

type UndoEntry = {
  changes: ChangeRecord;
  date_update: string;
  version: string;
};

type DataState = {
  decks: Record<string, Deck>;
  history: {
    [id: Id]: Id[];
  };
  undoHistory?: Record<Id, UndoEntry[]>;
};

export type DataSlice = {
  data: DataState;
  duplicateDeck(id: Id, options?: { applyEdits: boolean }): Promise<Id>;
  importDeck(code: string): Promise<void>;
  importFromFiles(files: FileList): Promise<void>;
};
