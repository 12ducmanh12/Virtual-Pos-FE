import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initialize isAuthenticated based on localStorage
  isAuthenticated: (() => {
    const token = localStorage.getItem("token");
    return !!(token);
  })(),

  setIsAuthenticated: (value: boolean) => {
    set({ isAuthenticated: value });
    if (!value) {
      localStorage.removeItem("token");
    }
  },
}));
