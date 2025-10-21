"use client";

import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  status: string;
  keterangan?: string;
}

export default function SiswaDashboard() {
  const { user, loading, logout, isSiswa } = useAuth();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isSiswa)) {
      router.push("/login");
    } else if (user && isSiswa) {
      fetchStudentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, isSiswa, router]);

  const fetchStudentData = async () => {
    if (!user?.student_id) return;

    try {
      // Fetch student info
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.student_id)
        .single();

      if (studentError) throw studentError;
      setStudent(studentData);

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", user.student_id)
        .order("date", { ascending: false })
        .order("time", { ascending: false })
        .limit(30);

      if (attendanceError) throw attendanceError;
      setAttendance(attendanceData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      hadir: { bg: "bg-green-100", text: "text-green-800", label: "✅ Hadir" },
      telat: { bg: "bg-yellow-100", text: "text-yellow-800", label: "⏰ Telat" },
      alpha: { bg: "bg-red-100", text: "text-red-800", label: "❌ Alpha" },
      ijin: { bg: "bg-blue-100", text: "text-blue-800", label: "📝 Ijin" },
      sakit: { bg: "bg-purple-100", text: "text-purple-800", label: "🏥 Sakit" },
    };

    const badge = badges[status as keyof typeof badges] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-medium`}
      >
        {badge.label}
      </span>
    );
  };

  const totalHadir = attendance.filter((a) => a.status === "hadir").length;
  const totalTelat = attendance.filter((a) => a.status === "telat").length;
  const totalAlpha = attendance.filter((a) => a.status === "alpha").length;
  const totalIjin = attendance.filter((a) => a.status === "ijin").length;
  const totalSakit = attendance.filter((a) => a.status === "sakit").length;

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isSiswa) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Data Kehadiran
            </h1>
            <p className="text-gray-600">Selamat datang, {user.full_name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Student Info */}
        {student && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informasi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-semibold">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIS</p>
                  <p className="font-semibold">{student.nis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kelas</p>
                  <p className="font-semibold">{student.class}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                Total Absensi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{attendance.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">✅ Hadir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{totalHadir}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">⏰ Telat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{totalTelat}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">❌ Alpha</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{totalAlpha}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">📝 Ijin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalIjin}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">🏥 Sakit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{totalSakit}</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Absensi (30 Terakhir)</CardTitle>
            <CardDescription>
              Data absensi Anda dalam 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada data absensi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{record.time.substring(0, 5)}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {record.keterangan || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
