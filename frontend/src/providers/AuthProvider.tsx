"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@/types/auth";
import {
  clearSession,
  getToken,
  getUser,
  setSession,
} from "@/lib/auth/storage";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(storedToken);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  function login(newToken: string, newUser: User) {
    setSession(newToken, newUser);

    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    clearSession();

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
