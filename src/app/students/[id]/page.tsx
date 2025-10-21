"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QRCode from "react-qr-code";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
  qr_code: string;
  created_at: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${student?.nis}-${student?.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Siswa Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/students">
            <Button variant="ghost">← Kembali</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Absensi</CardTitle>
            <CardDescription>
              QR Code untuk absensi siswa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIS</p>
                  <p className="font-medium">{student.nis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kelas</p>
                  <p className="font-medium">{student.class}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <QRCode
                  id="qr-code"
                  value={student.qr_code}
                  size={256}
                  level="H"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownloadQR}>
                  Download QR Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Simpan atau cetak QR Code ini untuk absensi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
