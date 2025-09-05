import { create } from "zustand";

type AuthState = {
  email: string;
  role: string;
  isLogin: boolean;
  checkLogin: boolean;

  setAuth: (email: string, role: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setChekLogin: (checkLogin: boolean) => void;
  setLogOut: () => void;
};

// tanpa persist
export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  role: "",
  isLogin: false,
  checkLogin: true,

  setAuth: (email, role) => set({ email, role }),
  setIsLogin: (isLogin) => set({ isLogin }),
  setChekLogin: (checkLogin) => set({ checkLogin }),
  setLogOut: () =>
    set({ email: "", role: "", isLogin: false, checkLogin: true }),
}));
