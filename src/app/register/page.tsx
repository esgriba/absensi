"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nis: "",
    class: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate unique QR code (menggunakan kombinasi NIS dan timestamp)
      const qrCode = `${formData.nis}-${Date.now()}`;

      // Insert data siswa ke database
      const { data, error } = await supabase
        .from("students")
        .insert([
          {
            name: formData.name,
            nis: formData.nis,
            class: formData.class,
            qr_code: qrCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Siswa berhasil didaftarkan!");
      
      // Redirect ke halaman detail siswa untuk melihat QR code
      router.push(`/students/${data.id}`);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.code === "23505") {
        toast.error("NIS sudah terdaftar!");
      } else {
        toast.error("Gagal mendaftarkan siswa");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Kembali</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrasi Siswa Baru</CardTitle>
            <CardDescription>
              Masukkan data siswa untuk generate QR Code absensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nis">NIS (Nomor Induk Siswa)</Label>
                <Input
                  id="nis"
                  placeholder="Masukkan NIS"
                  value={formData.nis}
                  onChange={(e) =>
                    setFormData({ ...formData, nis: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) =>
                    setFormData({ ...formData, class: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X RPL 1">X RPL 1</SelectItem>
                    <SelectItem value="X RPL 2">X RPL 2</SelectItem>
                    <SelectItem value="X TKJ 1">X TKJ 1</SelectItem>
                    <SelectItem value="X TKJ 2">X TKJ 2</SelectItem>
                    <SelectItem value="XI RPL 1">XI RPL 1</SelectItem>
                    <SelectItem value="XI RPL 2">XI RPL 2</SelectItem>
                    <SelectItem value="XI TKJ 1">XI TKJ 1</SelectItem>
                    <SelectItem value="XI TKJ 2">XI TKJ 2</SelectItem>
                    <SelectItem value="XII RPL 1">XII RPL 1</SelectItem>
                    <SelectItem value="XII RPL 2">XII RPL 2</SelectItem>
                    <SelectItem value="XII TKJ 1">XII TKJ 1</SelectItem>
                    <SelectItem value="XII TKJ 2">XII TKJ 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mendaftar..." : "Daftar & Generate QR Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
