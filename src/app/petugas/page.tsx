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

export default function PetugasDashboard() {
  const { user, loading, logout, isPetugas } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isPetugas)) {
      router.push("/login");
    }
  }, [user, loading, isPetugas, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isPetugas) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Petugas
            </h1>
            <p className="text-gray-600">Selamat datang, {user.full_name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">📸 Scan Absensi</CardTitle>
              <CardDescription>
                Scan QR Code siswa untuk mencatat kehadiran
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Link href="/scan">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Mulai Scan QR Code
                  </Button>
                </Link>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Cara Penggunaan:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Klik tombol &ldquo;Mulai Scan QR Code&rdquo;</li>
                  <li>Izinkan akses kamera</li>
                  <li>Arahkan kamera ke QR Code siswa</li>
                  <li>Sistem akan otomatis mencatat absensi</li>
                  <li>Status akan ditampilkan (Hadir/Telat)</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Lihat Data Hari Ini</CardTitle>
                <CardDescription>
                  Cek data absensi siswa hari ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/attendance">
                  <Button className="w-full" variant="outline">
                    Lihat Data Absensi
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>✍️ Input Manual</CardTitle>
                <CardDescription>
                  Input absensi Alpha/Ijin/Sakit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/petugas/manual-attendance">
                  <Button className="w-full" variant="outline">
                    Input Manual
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👥 Daftar Siswa</CardTitle>
                <CardDescription>
                  Lihat daftar siswa terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/students">
                  <Button className="w-full" variant="outline">
                    Lihat Daftar Siswa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⏰ Perhatian:</strong> Absensi sebelum jam 07:00 = Hadir,
              setelahnya = Telat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
