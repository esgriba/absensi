"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
  qr_code: string;
}

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<Student | null>(null);
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const lastQrCodeRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => console.error(err));
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );

      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("Gagal memulai scanner. Pastikan kamera diizinkan.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Prevent duplicate scans within 3 seconds
    const now = Date.now();
    const timeSinceLastScan = now - lastScanTimeRef.current;
    
    // If same QR code scanned within 3 seconds, ignore
    if (
      processing || 
      (lastQrCodeRef.current === decodedText && timeSinceLastScan < 3000)
    ) {
      return;
    }

    // Update refs
    lastScanTimeRef.current = now;
    lastQrCodeRef.current = decodedText;
    setProcessing(true);

    console.log("QR Code detected:", decodedText);

    try {
      // Cari siswa berdasarkan QR code
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("qr_code", decodedText)
        .single();

      if (studentError || !student) {
        toast.error("QR Code tidak valid!");
        setProcessing(false);
        return;
      }

      // Cek apakah sudah absen hari ini
      const today = new Date().toISOString().split("T")[0];
      const { data: existingAttendance } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", student.id)
        .eq("date", today)
        .single();

      if (existingAttendance) {
        toast.warning(`${student.name} sudah absen hari ini!`);
        setLastScanned(student);
        setProcessing(false);
        
        // Clear after 3 seconds
        setTimeout(() => {
          setLastScanned(null);
        }, 3000);
        return;
      }

      // Tentukan status (hadir/telat berdasarkan jam)
      const now = new Date();
      const hour = now.getHours();
      const status = hour < 7 ? "hadir" : "telat";

      // Catat absensi
      const { error: attendanceError } = await supabase
        .from("attendance")
        .insert([
          {
            student_id: student.id,
            date: today,
            time: now.toTimeString().split(" ")[0],
            status: status,
          },
        ]);

      if (attendanceError) throw attendanceError;

      toast.success(
        `Absensi berhasil! ${student.name} - ${status.toUpperCase()}`
      );
      setLastScanned(student);

      // Clear processing state and last scanned after 3 seconds
      setTimeout(() => {
        setLastScanned(null);
        setProcessing(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mencatat absensi");
      setProcessing(false);
    }
  };

  const onScanFailure = () => {
    // Ignore errors saat scanning
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
            <CardTitle>Scan QR Code Absensi</CardTitle>
            <CardDescription>
              Arahkan kamera ke QR Code siswa untuk mencatat kehadiran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                id="reader"
                className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                style={{ minHeight: scanning ? "300px" : "0px" }}
              ></div>

              {!scanning ? (
                <Button onClick={startScanning} size="lg">
                  Mulai Scan
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="destructive" size="lg">
                  Stop Scan
                </Button>
              )}

              {processing && (
                <div className="text-sm text-gray-600">
                  Memproses...
                </div>
              )}
            </div>

            {lastScanned && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Absensi Berhasil!
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-600">Nama:</span>{" "}
                    {lastScanned.name}
                  </p>
                  <p>
                    <span className="text-gray-600">NIS:</span>{" "}
                    {lastScanned.nis}
                  </p>
                  <p>
                    <span className="text-gray-600">Kelas:</span>{" "}
                    {lastScanned.class}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>Pastikan QR Code terlihat jelas di dalam frame</p>
              <p className="mt-2">
                Absensi sebelum jam 07:00 = Hadir, setelahnya = Telat
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
