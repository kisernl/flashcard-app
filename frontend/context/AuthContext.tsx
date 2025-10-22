"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite"; // your initialized Appwrite client
import type { Models } from "appwrite";
import { ID } from "appwrite";

interface AuthContextType {
  user: Models.User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const currentUser = await account.get();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Create email/password session
      await account.createEmailPasswordSession(email, password);
      // Get the current user data
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);

      // Clear old local data on login
      localStorage.removeItem("decks");
      localStorage.removeItem("stacks");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      await account.create({ userId: ID.unique(), email, password, name });
      // Automatically login after signup
      await login(email, password);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession({ sessionId: "current" });
      setUser(null);
      setIsAuthenticated(false);

      // Optionally clear local storage on logout
      localStorage.removeItem("decks");
      localStorage.removeItem("stacks");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
