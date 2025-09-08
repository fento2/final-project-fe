import { create } from "zustand";

type AuthState = {
  email: string;
  role: string;
  isLogin: boolean;
  checkLogin: boolean;
  profile_picture: string;

  setAuth: (email: string, role: string, profile_picture: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setChekLogin: (checkLogin: boolean) => void;
  setLogOut: () => void;
};

// tanpa persist
export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  role: "",
  profile_picture: "",
  isLogin: false,
  checkLogin: true,

  setAuth: (email, role, profile_picture) =>
    set({ email, role, profile_picture }),
  setIsLogin: (isLogin) => set({ isLogin }),
  setChekLogin: (checkLogin) => set({ checkLogin }),
  setLogOut: () =>
    set({
      email: "",
      role: "",
      isLogin: false,
      checkLogin: true,
      profile_picture: "",
    }),
}));
