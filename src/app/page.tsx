import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistem Absensi Siswa SMK
          </h1>
          <p className="text-xl text-gray-600">
            Sistem absensi modern menggunakan QR Code
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Registrasi Siswa</CardTitle>
              <CardDescription>
                Daftarkan siswa baru dan generate QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full">Daftar Siswa</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Scan Absensi</CardTitle>
              <CardDescription>
                Scan QR Code untuk mencatat kehadiran
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

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Data Absensi</CardTitle>
              <CardDescription>
                Lihat laporan dan riwayat absensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance">
                <Button className="w-full" variant="outline">
                  Lihat Data
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Import Feature Card */}
        <div className="max-w-5xl mx-auto mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📥 Import Data Siswa
              </CardTitle>
              <CardDescription>
                Upload data siswa dalam jumlah banyak menggunakan file Excel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mendukung format .xlsx, .xls dengan kolom: nama, nis, kelas
                </div>
                <Link href="/import">
                  <Button>Import Excel</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/students">
            <Button variant="link">Lihat Daftar Siswa</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

