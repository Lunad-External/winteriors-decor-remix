import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { currentAdminFn, loginFn, logoutFn } from "@/lib/auth.functions";

/** The logged-in admin, as confirmed by the server (session cookie). */
export interface AdminUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    currentAdminFn()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await loginFn({ data: { email, password } });
      if ("error" in res) return { error: new Error(res.error) };
      setUser(res.admin);
      return { error: null };
    } catch {
      return { error: new Error("Login failed. Please try again.") };
    }
  };

  // Admin accounts are created on the server (scripts/create-admin.mjs), not from the website.
  const signUp = async () => ({ error: new Error("Sign-up is disabled. Ask an administrator for an account.") });

  const signOut = async () => {
    await logoutFn().catch(() => undefined);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
