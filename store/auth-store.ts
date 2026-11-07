import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
  image?: string | null;
  role?: string;
  roleName?: string;
  userType?: string;
  loginType?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "portfolio-auth",
    }
  )
);
