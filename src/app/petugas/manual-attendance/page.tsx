"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
}

interface AttendanceRecord {
  student_id: string;
  status: string;
  keterangan?: string;
}

export default function PetugasManualAttendancePage() {
  const { user, loading, isPetugas } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("all");
  const [attendanceData, setAttendanceData] = useState<
    Map<string, AttendanceRecord>
  >(new Map());
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isPetugas)) {
      router.push("/login");
    } else if (user && isPetugas) {
      fetchStudents();
    }
  }, [user, loading, isPetugas, router]);

  useEffect(() => {
    if (students.length > 0) {
      checkExistingAttendance();
    }
  }, [students, selectedDate]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("class", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data siswa");
    } finally {
      setLoadingData(false);
    }
  };

  const checkExistingAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", selectedDate);

      if (error) throw error;

      const existingMap = new Map<string, AttendanceRecord>();
      data?.forEach((record) => {
        existingMap.set(record.student_id, {
          student_id: record.student_id,
          status: record.status,
          keterangan: record.keterangan,
        });
      });
      setAttendanceData(existingMap);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    const newMap = new Map(attendanceData);
    newMap.set(studentId, {
      student_id: studentId,
      status: status,
      keterangan: newMap.get(studentId)?.keterangan || "",
    });
    setAttendanceData(newMap);
  };

  const handleKeteranganChange = (studentId: string, keterangan: string) => {
    const newMap = new Map(attendanceData);
    const existing = newMap.get(studentId);
    if (existing) {
      newMap.set(studentId, {
        ...existing,
        keterangan: keterangan,
      });
      setAttendanceData(newMap);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const recordsToUpsert = Array.from(attendanceData.values())
        .filter((record) => record.status)
        .map((record) => ({
          student_id: record.student_id,
          date: selectedDate,
          time: new Date().toTimeString().split(" ")[0],
          status: record.status,
          keterangan: record.keterangan || null,
        }));

      if (recordsToUpsert.length === 0) {
        toast.error("Tidak ada data untuk disimpan");
        setSaving(false);
        return;
      }

      // Try upsert first (requires unique constraint on student_id, date)
      let { error } = await supabase.from("attendance").upsert(
        recordsToUpsert,
        {
          onConflict: "student_id,date",
        }
      );

      // If upsert fails, try insert or update individually
      if (error) {
        console.warn("Upsert failed, trying individual operations:", error);
        
        // Process each record individually
        for (const record of recordsToUpsert) {
          // Check if record exists
          const { data: existing } = await supabase
            .from("attendance")
            .select("id")
            .eq("student_id", record.student_id)
            .eq("date", record.date)
            .single();

          if (existing) {
            // Update existing record
            const { error: updateError } = await supabase
              .from("attendance")
              .update({
                time: record.time,
                status: record.status,
                keterangan: record.keterangan,
              })
              .eq("student_id", record.student_id)
              .eq("date", record.date);

            if (updateError) {
              console.error("Update error for student:", record.student_id, updateError);
            }
          } else {
            // Insert new record
            const { error: insertError } = await supabase
              .from("attendance")
              .insert([record]);

            if (insertError) {
              console.error("Insert error for student:", record.student_id, insertError);
            }
          }
        }

        toast.success(`Berhasil menyimpan ${recordsToUpsert.length} absensi`);
      } else {
        toast.success(`Berhasil menyimpan ${recordsToUpsert.length} absensi`);
      }

      checkExistingAttendance();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menyimpan absensi: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleAutoAlpha = async () => {
    if (!confirm("Tandai semua siswa yang belum absen sebagai Alpha?")) {
      return;
    }

    setSaving(true);
    try {
      // Get students yang belum ada record hari ini
      const studentsWithoutAttendance = filteredStudents.filter(
        (student) => !attendanceData.has(student.id)
      );

      if (studentsWithoutAttendance.length === 0) {
        toast.info("Semua siswa sudah memiliki status absensi");
        return;
      }

      const alphaRecords = studentsWithoutAttendance.map((student) => ({
        student_id: student.id,
        date: selectedDate,
        time: new Date().toTimeString().split(" ")[0],
        status: "alpha",
        keterangan: "Auto-generated",
      }));

      const { error } = await supabase.from("attendance").insert(alphaRecords);

      if (error) throw error;

      toast.success(
        `Berhasil menandai ${alphaRecords.length} siswa sebagai Alpha`
      );
      checkExistingAttendance();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal generate Alpha");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      hadir: "bg-green-100 text-green-800",
      telat: "bg-yellow-100 text-yellow-800",
      alpha: "bg-red-100 text-red-800",
      ijin: "bg-blue-100 text-blue-800",
      sakit: "bg-purple-100 text-purple-800",
    };
    const labels = {
      hadir: "Hadir",
      telat: "Telat",
      alpha: "Alpha",
      ijin: "Ijin",
      sakit: "Sakit",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          badges[status as keyof typeof badges]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredStudents =
    selectedClass === "all"
      ? students
      : students.filter((s) => s.class === selectedClass);

  const classes = [...new Set(students.map((s) => s.class))];

  if (loading || loadingData) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link href="/petugas">
              <Button variant="ghost">← Kembali</Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📝 Input Absensi Manual</CardTitle>
            <CardDescription>
              Input absensi untuk siswa yang tidak hadir (Alpha/Ijin/Sakit)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Aksi Cepat</Label>
                <Button
                  onClick={handleAutoAlpha}
                  variant="outline"
                  className="w-full"
                  disabled={saving}
                >
                  🤖 Auto Alpha (Belum Absen)
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-5 gap-2 mb-4 text-sm">
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="font-bold text-green-700">
                  {
                    Array.from(attendanceData.values()).filter(
                      (a) => a.status === "hadir"
                    ).length
                  }
                </div>
                <div className="text-xs text-green-600">Hadir</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded text-center">
                <div className="font-bold text-yellow-700">
                  {
                    Array.from(attendanceData.values()).filter(
                      (a) => a.status === "telat"
                    ).length
                  }
                </div>
                <div className="text-xs text-yellow-600">Telat</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="font-bold text-red-700">
                  {
                    Array.from(attendanceData.values()).filter(
                      (a) => a.status === "alpha"
                    ).length
                  }
                </div>
                <div className="text-xs text-red-600">Alpha</div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="font-bold text-blue-700">
                  {
                    Array.from(attendanceData.values()).filter(
                      (a) => a.status === "ijin"
                    ).length
                  }
                </div>
                <div className="text-xs text-blue-600">Ijin</div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="font-bold text-purple-700">
                  {
                    Array.from(attendanceData.values()).filter(
                      (a) => a.status === "sakit"
                    ).length
                  }
                </div>
                <div className="text-xs text-purple-600">Sakit</div>
              </div>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => {
                    const record = attendanceData.get(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono">{student.nis}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          {record?.status ? (
                            getStatusBadge(record.status)
                          ) : (
                            <Select
                              value={record?.status || ""}
                              onValueChange={(value) =>
                                handleStatusChange(student.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Pilih..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hadir">✅ Hadir</SelectItem>
                                <SelectItem value="telat">⏰ Telat</SelectItem>
                                <SelectItem value="alpha">❌ Alpha</SelectItem>
                                <SelectItem value="ijin">📝 Ijin</SelectItem>
                                <SelectItem value="sakit">🏥 Sakit</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {record?.status && (
                            <Input
                              placeholder="Tambah keterangan..."
                              value={record?.keterangan || ""}
                              onChange={(e) =>
                                handleKeteranganChange(
                                  student.id,
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  saving || Array.from(attendanceData.values()).length === 0
                }
                size="lg"
              >
                {saving ? "Menyimpan..." : "💾 Simpan Absensi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
