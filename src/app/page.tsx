"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Jika belum login, redirect ke login
        router.push("/login");
      } else {
        // Jika sudah login, redirect ke dashboard sesuai role
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "petugas") {
          router.push("/petugas");
        } else if (user.role === "siswa") {
          router.push("/siswa");
        }
      }
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
