"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">Selamat datang, {user.full_name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kelola Siswa */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>👥 Kelola Siswa</CardTitle>
              <CardDescription>
                Lihat, tambah, edit, dan hapus data siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/students">
                  <Button className="w-full">Daftar Siswa</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full" variant="outline">
                    Tambah Siswa
                  </Button>
                </Link>
                <Link href="/import">
                  <Button className="w-full" variant="outline">
                    Import Excel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Absensi */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>📊 Data Absensi</CardTitle>
              <CardDescription>
                Lihat dan kelola data absensi siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/attendance">
                  <Button className="w-full">Lihat Data Absensi</Button>
                </Link>
                <Link href="/admin/manual-attendance">
                  <Button className="w-full" variant="outline">
                    📝 Input Manual
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Kelola Users */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>🔐 Kelola Users</CardTitle>
              <CardDescription>
                Kelola akun admin, petugas, dan siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">Kelola Users</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Scan Absensi */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>📸 Scan Absensi</CardTitle>
              <CardDescription>
                Scan QR Code untuk absensi siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/scan">
                <Button className="w-full" variant="secondary">
                  Mulai Scan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Laporan */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>📈 Laporan</CardTitle>
              <CardDescription>
                Download dan cetak laporan absensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Generate Laporan
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>⚙️ Pengaturan</CardTitle>
              <CardDescription>
                Konfigurasi sistem dan pengaturan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Pengaturan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
