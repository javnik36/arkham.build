import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import type {
  DeckFiltersSlice,
  DeckFiltersState,
} from "./deck-collection-filters.types";

function getInitialUIState(): DeckFiltersState {
  return {
    filters: {
      faction: [],
      search: "",
      tags: [],
      properties: {
        parallel: false,
      },
      validity: "all",
      expCost: undefined,
    },
    open: {
      tags: false,
      properties: true,
      validity: false,
      expCost: false,
    },
    sort: {
      order: "desc",
      criteria: "date_updated",
    },
  };
}

export const createDeckFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  DeckFiltersSlice
> = (set) => ({
  deckFilters: getInitialUIState(),
  addDecksFilter(type, value) {
    set((state) => {
      const filterValues = structuredClone(state.deckFilters.filters);
      filterValues[type] = value;

      return {
        deckFilters: {
          ...state.deckFilters,
          filters: filterValues,
        },
      };
    });
  },

  setDeckFilterOpen(filter, value) {
    set((state) => ({
      deckFilters: {
        ...state.deckFilters,
        open: { ...state.deckFilters.open, [filter]: value },
      },
    }));
  },

  setDeckSort(payload) {
    set((state) => ({
      deckFilters: {
        ...state.deckFilters,
        sort: {
          ...state.deckFilters.sort,
          ...payload,
        },
      },
    }));
  },

  resetDeckFilter(filter) {
    set((state) => {
      const initialState = getInitialUIState().filters[filter];
      return {
        deckFilters: {
          ...state.deckFilters,
          open: { ...state.deckFilters.open },
          filters: { ...state.deckFilters.filters, [filter]: initialState },
        },
      };
    });
  },
});
