// src/components/PageTracker.jsx
import React, { useEffect, useState, useRef } from "react"; // Tambahkan useRef
import { useLocation } from "react-router-dom";

const PageTracker = () => {
  const location = useLocation();
  // Menggunakan useRef untuk menyimpan status apakah request sudah dikirim untuk path saat ini
  // Ini lebih tahan terhadap re-render ganda dari StrictMode daripada hanya state biasa
  // karena useRef tidak memicu re-render.
  const trackedPathsRef = useRef(new Set()); // Simpan path yang sudah di-track dalam session ini

  useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;

    // Hanya kirim jika path ini BELUM ADA di trackedPathsRef
    if (!trackedPathsRef.current.has(currentPath)) {
      console.log(
        "Frontend: Attempting to track page view for (NEW):",
        currentPath
      );

      // Tandai path ini sudah di-track SEBELUM mengirim request
      // untuk mencegah pengiriman ganda jika ada pemanggilan useEffect yang cepat
      trackedPathsRef.current.add(currentPath);

      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      fetch(`${backendUrl}/api/stats/track-page-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: currentPath,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log(
              "Frontend: Page view tracked successfully by backend for",
              currentPath
            );
          } else {
            response.json().then((err) => {
              console.error(
                "Frontend: Failed to track page view on backend.",
                err
              );
              // Jika gagal, kita mungkin ingin menghapus path dari trackedPathsRef
              // agar bisa dicoba lagi nanti, tapi ini bisa rumit.
              // Untuk sekarang, biarkan.
              // trackedPathsRef.current.delete(currentPath);
            });
          }
        })
        .catch((error) => {
          console.error(
            "Frontend: Network error or other issue tracking page view:",
            error
          );
          // Sama seperti di atas, pertimbangkan untuk menghapus dari trackedPathsRef jika gagal
          // trackedPathsRef.current.delete(currentPath);
        });
    } else {
      console.log(
        "Frontend: Page view for (ALREADY TRACKED):",
        currentPath,
        " - Skipping."
      );
    }
    // Kita hanya ingin efek ini berjalan ketika 'location' berubah.
    // 'trackedPathsRef' adalah ref, jadi tidak perlu dimasukkan ke dependency array.
  }, [location]);

  return null;
};

export default PageTracker;
