"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "@/lib/appwrite";

type User = {
  $id: string;
  name: string;
  email: string;
} | null;

interface AuthContextProps {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    await account.createEmailPasswordSession({ email, password });
    const current = await account.get();
    setUser(current);
  }

  async function signup(email: string, password: string, name: string) {
    await account.create({ userId: "unique()", email, password, name });
    await login(email, password); // auto-login
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
