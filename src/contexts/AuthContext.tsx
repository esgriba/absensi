"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "petugas" | "siswa";
  student_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isPetugas: boolean;
  isSiswa: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Query user from database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error("Email atau password salah");
      }

      // In production, you should verify password hash
      // For now, we'll use simple comparison
      // Note: Password in DB should be hashed with bcrypt
      
      const bcrypt = await import("bcryptjs");
      const isValid = await bcrypt.compare(password, data.password);
      
      if (!isValid) {
        throw new Error("Email atau password salah");
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        student_id: data.student_id,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set cookie for middleware access
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400`;

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "petugas") {
        router.push("/petugas");
      } else if (data.role === "siswa") {
        router.push("/siswa");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    // Clear cookie
    document.cookie = "user=; path=/; max-age=0";
    router.push("/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === "admin",
    isPetugas: user?.role === "petugas",
    isSiswa: user?.role === "siswa",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
