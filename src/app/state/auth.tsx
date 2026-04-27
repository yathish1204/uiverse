import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  fullName: string;
  email: string;
  role?: "Admin" | "User";
};

type StoredAccount = AuthUser & {
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string };
  signup: (
    fullName: string,
    email: string,
    password: string
  ) => { ok: true } | { ok: false; message: string };
  logout: () => void;
};

const AUTH_USER_KEY = "uiverse.auth.user";
const AUTH_ACCOUNTS_KEY = "uiverse.auth.accounts";

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function loadAccounts(): StoredAccount[] {
  const parsed = safeJsonParse<StoredAccount[]>(localStorage.getItem(AUTH_ACCOUNTS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadUser(): AuthUser | null {
  const parsed = safeJsonParse<AuthUser>(localStorage.getItem(AUTH_USER_KEY));
  if (!parsed?.email) return null;
  return { fullName: parsed.fullName, email: parsed.email, role: parsed.role ?? "User" };
}

function saveUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(loadUser());
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      login: (email, password) => {
        const accounts = loadAccounts();
        const match = accounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
        );
        if (!match) return { ok: false, message: "Invalid email or password." };
        const nextUser: AuthUser = {
          fullName: match.fullName,
          email: match.email,
          role: match.role ?? (match.email.toLowerCase() === "admin@uiverse.com" ? "Admin" : "User"),
        };
        setUser(nextUser);
        saveUser(nextUser);
        return { ok: true };
      },
      signup: (fullName, email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!fullName.trim()) return { ok: false, message: "Full name is required." };
        if (!normalizedEmail) return { ok: false, message: "Email is required." };
        if (!password) return { ok: false, message: "Password is required." };

        const accounts = loadAccounts();
        if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, message: "An account with this email already exists." };
        }

        const nextAccount: StoredAccount = {
          fullName: fullName.trim(),
          email: normalizedEmail,
          role: normalizedEmail === "admin@uiverse.com" ? "Admin" : "User",
          password,
        };
        saveAccounts([...accounts, nextAccount]);

        const nextUser: AuthUser = {
          fullName: nextAccount.fullName,
          email: nextAccount.email,
          role: nextAccount.role,
        };
        setUser(nextUser);
        saveUser(nextUser);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        saveUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

