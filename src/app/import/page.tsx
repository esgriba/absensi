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
import * as XLSX from "xlsx";

interface StudentData {
  name: string;
  nis: string;
  class: string;
  status?: "pending" | "success" | "error";
  error?: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
          string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any
        >[];

        // Parse data from Excel
        const parsedStudents: StudentData[] = jsonData.map((row) => ({
          name: row.nama || row.Nama || row.name || row.Name || "",
          nis: String(row.nis || row.NIS || row.Nis || ""),
          class: row.kelas || row.Kelas || row.class || row.Class || "",
          status: "pending",
        }));

        // Validate data
        const validStudents = parsedStudents.filter(
          (student) => student.name && student.nis && student.class
        );

        if (validStudents.length === 0) {
          toast.error("Tidak ada data valid dalam file Excel!");
          return;
        }

        setStudents(validStudents);
        toast.success(`${validStudents.length} siswa berhasil dibaca dari file`);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Gagal membaca file. Pastikan format Excel benar.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (students.length === 0) {
      toast.error("Tidak ada data untuk diimport");
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    // Process each student
    const updatedStudents = [...students];

    for (let i = 0; i < updatedStudents.length; i++) {
      const student = updatedStudents[i];
      
      try {
        // Generate unique QR code
        const qrCode = `${student.nis}-${Date.now()}-${i}`;

        // Insert to database
        const { error } = await supabase.from("students").insert([
          {
            name: student.name,
            nis: student.nis,
            class: student.class,
            qr_code: qrCode,
          },
        ]);

        if (error) {
          // Check if duplicate NIS
          if (error.code === "23505") {
            updatedStudents[i].status = "error";
            updatedStudents[i].error = "NIS sudah terdaftar";
            errorCount++;
          } else {
            throw error;
          }
        } else {
          updatedStudents[i].status = "success";
          successCount++;
        }

        // Update state to show progress
        setStudents([...updatedStudents]);

        // Small delay to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("Error importing student:", error);
        updatedStudents[i].status = "error";
        updatedStudents[i].error = "Gagal menyimpan";
        errorCount++;
        setStudents([...updatedStudents]);
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} siswa berhasil diimport!`);
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} siswa gagal diimport`);
    }

    // Redirect after 2 seconds if all success
    if (errorCount === 0) {
      setTimeout(() => {
        router.push("/students");
      }, 2000);
    }
  };

  const downloadTemplate = () => {
    // Create sample data
    const template = [
      { nama: "John Doe", nis: "12345", kelas: "X RPL 1" },
      { nama: "Jane Smith", nis: "12346", kelas: "X RPL 2" },
      { nama: "Bob Wilson", nis: "12347", kelas: "XI TKJ 1" },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Siswa");

    // Download
    XLSX.writeFile(wb, "template-siswa.xlsx");
    toast.success("Template berhasil didownload!");
  };

  const getStatusBadge = (status?: string) => {
    if (status === "success") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Berhasil
        </span>
      );
    } else if (status === "error") {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          Gagal
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
          Pending
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/students">
            <Button variant="ghost">← Kembali</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Import Data Siswa dari Excel</CardTitle>
            <CardDescription>
              Upload file Excel (.xlsx, .xls) dengan kolom: nama, nis, kelas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-2">
                    📥 Download Template Excel
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Download template untuk mempermudah input data siswa
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    Format kolom: <strong>nama</strong>, <strong>nis</strong>,{" "}
                    <strong>kelas</strong>
                  </p>
                </div>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  Download Template
                </Button>
              </div>
            </div>

            {/* Upload File */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload File Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={loading}
              />
              {fileName && (
                <p className="text-sm text-gray-600">File: {fileName}</p>
              )}
            </div>

            {/* Preview & Import Button */}
            {students.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {students.length} siswa siap diimport
                    </p>
                    <p className="text-sm text-gray-600">
                      Periksa data sebelum melanjutkan
                    </p>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? "Importing..." : "Import Semua"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Table */}
        {students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Data</CardTitle>
              <CardDescription>
                Daftar siswa yang akan diimport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.nis}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell className="text-red-600 text-sm">
                          {student.error || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
