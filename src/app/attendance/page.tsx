"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  status: string;
  student: {
    name: string;
    nis: string;
    class: string;
  };
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("attendance")
        .select(
          `
          id,
          date,
          time,
          status,
          students (
            name,
            nis,
            class
          )
        `
        )
        .order("time", { ascending: false });

      if (filterDate) {
        query = query.eq("date", filterDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      let transformedData: AttendanceRecord[] = (data || []).map((item: unknown) => {
        const record = item as {
          id: string;
          date: string;
          time: string;
          status: string;
          students: { name: string; nis: string; class: string } | null;
        };
        return {
          id: record.id,
          date: record.date,
          time: record.time,
          status: record.status,
          student: {
            name: record.students?.name || "-",
            nis: record.students?.nis || "-",
            class: record.students?.class || "-",
          },
        };
      });

      // Filter by class
      if (filterClass !== "all") {
        transformedData = transformedData.filter(
          (item) => item.student.class === filterClass
        );
      }

      // Filter by status
      if (filterStatus !== "all") {
        transformedData = transformedData.filter(
          (item) => item.status === filterStatus
        );
      }

      setAttendance(transformedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, filterClass, filterStatus]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Kembali</Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Absensi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{attendance.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalHadir}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Telat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {totalTelat}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Alpha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {totalAlpha}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ijin/Sakit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalIjin + totalSakit}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Absensi</CardTitle>
            <CardDescription>
              Riwayat absensi siswa dengan filter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Kelas</label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
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

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="hadir">✅ Hadir</SelectItem>
                    <SelectItem value="telat">⏰ Telat</SelectItem>
                    <SelectItem value="alpha">❌ Alpha</SelectItem>
                    <SelectItem value="ijin">📝 Ijin</SelectItem>
                    <SelectItem value="sakit">🏥 Sakit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data absensi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waktu</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {record.time.substring(0, 5)}
                        </TableCell>
                        <TableCell>{record.student.nis}</TableCell>
                        <TableCell>{record.student.name}</TableCell>
                        <TableCell>{record.student.class}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
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
