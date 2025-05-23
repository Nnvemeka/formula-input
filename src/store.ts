import { create } from "zustand";

export type Token = {
  id: string;
  type: "variable" | "number" | "operator";
  name?: string;
  value: string | number;
};

type FormulaState = {
  tokens: Token[];
  inputValue: string;
  showAutocomplete: boolean;
  activeTagId: string | null;
  setTokens: (tokens: Token[]) => void;
  setInputValue: (value: string) => void;
  setShowAutocomplete: (show: boolean) => void;
  setActiveTagId: (id: string | null) => void;
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
  tokens: [],
  inputValue: "",
  showAutocomplete: false,
  activeTagId: null,
  setTokens: (tokens) => set({ tokens }),
  setInputValue: (inputValue) => set({ inputValue }),
  setShowAutocomplete: (showAutocomplete) => set({ showAutocomplete }),
  setActiveTagId: (activeTagId) => set({ activeTagId }),
  addToken: (token) => {
    set((state) => {
      return {
        tokens: [...state.tokens, token],
        inputValue: "",
        showAutocomplete: false,
      };
    });
  },
  removeToken: (id) =>
    set((state) => ({
      tokens: state.tokens.filter((token) => token.id !== id),
    })),
}));
