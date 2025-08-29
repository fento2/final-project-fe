import { create } from "zustand";

type AuthUIState = {
  showSignIn: boolean;
  showSignUp: boolean;
  setShowSignIn: (showSignIn: boolean) => void;
  setShowSignUp: (showSignUp: boolean) => void;
};

// tanpa persist
export const useAuthStore = create<AuthUIState>((set) => ({
  showSignIn: false,
  showSignUp: false,

  setShowSignIn: (value) => set({ showSignIn: value }),
  setShowSignUp: (value) => set({ showSignUp: value }),
}));
