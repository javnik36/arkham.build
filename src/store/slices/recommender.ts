import type { StateCreator } from "zustand";
import { assert } from "@/utils/assert";
import type { StoreState } from ".";
import type { Id } from "./data.types";
import type { RecommenderSlice, RecommenderState } from "./recommender.types";

function toStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth());
}

function deckDateRange(): [Date, Date] {
  const minDate = new Date(2016, 8);
  const maxDate = toStartOfMonth(new Date());
  return [minDate, maxDate];
}

export function deckTickToString(tick: number): string {
  const [min, _] = deckDateRange();
  const date = new Date(min.getFullYear(), min.getMonth() + tick);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

export function deckDateTickRange(): [number, number] {
  const [minDate, maxDate] = deckDateRange();
  const monthsBetween =
    (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
    maxDate.getMonth() -
    minDate.getMonth();
  return [0, monthsBetween];
}

function getInitialRecommenderState(): RecommenderState {
  return {
    recommender: {
      includeSideDeck: true,
      isRelative: false,
      deckFilter: deckDateTickRange(),
      coreCards: {},
    },
  };
}

export const createRecommenderSlice: StateCreator<
  StoreState,
  [],
  [],
  RecommenderSlice
> = (set) => ({
  ...getInitialRecommenderState(),
  setIncludeSideDeck(value: boolean) {
    set((state) => ({
      recommender: {
        ...state.recommender,
        includeSideDeck: value,
      },
    }));
  },
  setIsRelative(value: boolean) {
    set((state) => ({
      recommender: {
        ...state.recommender,
        isRelative: value,
      },
    }));
  },
  setRecommenderDeckFilter(value: [number, number]) {
    set((state) => ({
      recommender: {
        ...state.recommender,
        deckFilter: value,
      },
    }));
  },
  addCoreCard(deckId: Id, value: string) {
    set((state) => {
      const current = state.recommender.coreCards[deckId] ?? [];
      assert(!current.includes(value), `${value} already is a core card.`);

      return {
        recommender: {
          ...state.recommender,
          coreCards: {
            ...state.recommender.coreCards,
            [deckId]: [...current, value],
          },
        },
      };
    });
  },
  removeCoreCard(deckId: Id, value: string) {
    set((state) => {
      const current = state.recommender.coreCards[deckId] ?? [];
      assert(current.includes(value), `${value} is not a core card.`);

      return {
        recommender: {
          ...state.recommender,
          coreCards: {
            ...state.recommender.coreCards,
            [deckId]: current.filter((v) => v !== value),
          },
        },
      };
    });
  },
});
