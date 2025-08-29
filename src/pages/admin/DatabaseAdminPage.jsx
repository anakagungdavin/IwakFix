// client/src/pages/Admin/DatabaseAdminPage.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DatabaseAdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      toast.error("Akses ditolak. Silakan login sebagai admin.");
      console.warn(
        "Token tidak ditemukan. Fitur backup/restore memerlukan autentikasi."
      );
    }
  }, []);

  const getApiUrl = (path) => {
    return `https://iwak.onrender.com/api/admin/db${path}`;
  };

  const handleBackup = async () => {
    if (!authToken) {
      toast.error("Autentikasi diperlukan untuk backup.");
      return;
    }
    setIsLoading(true);
    const loadingToastId = toast.loading("Memulai proses backup...");

    try {
      const response = await fetch(getApiUrl("/backup"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toast.dismiss(loadingToastId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Error ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "mongodb-backup.zip";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

      toast.success("Backup berhasil didownload!");
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Backup error:", error);
      toast.error(
        `Backup gagal: ${error.message} (Abaikan jika anda menggunakan Internet Download Manager)`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Logika dan UI untuk Restore tetap di-comment
  // ...

  return (
    // Perubahan: Latar belakang utama halaman
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Perubahan: Latar belakang kartu utama */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
        {/* Backup Section */}
        {/* Perubahan: Warna border kartu section */}
        <div className="mb-10 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          {/* Perubahan: Warna teks judul dan paragraf */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-white mb-3">
            Backup Database
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Klik tombol di bawah untuk membuat cadangan (backup) data dari
            database. File backup akan diunduh ke komputer Anda.
          </p>
          <button
            onClick={handleBackup}
            disabled={isLoading || !authToken}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses Backup..." : "Mulai Backup Database"}
          </button>
        </div>

        {/* ================================================================== */}
        {/* BAGIAN TAMPILAN (UI/JSX) RESTORE DI-COMMENT SESUAI PERMINTAAN */}
        {/* ================================================================== */}
        {/*
        <hr className="my-8 border-gray-300 dark:border-gray-600" />
        
        <div className="p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-white mb-3">
            Restore Database
          </h2>
          <div
            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold text-lg">Peringatan Penting!</p>
            <p className="text-sm">
              Operasi restore akan{" "}
              <strong className="underline">MENGHAPUS SELURUH DATA</strong> yang
              ada di database saat ini dan menggantinya dengan data dari file
              backup yang Anda unggah. Pastikan Anda memiliki backup yang benar
              dan memahami konsekuensinya.
            </p>
          </div>
          <div className="mb-5">
            <label
              htmlFor="backupFileRestore"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Pilih File Backup (.zip atau .gz):
            </label>
            <input
              id="backupFileRestore"
              type="file"
              // onChange={handleFileChange}
              disabled={isLoading || !authToken}
              accept=".zip,.gz,.archive"
              className="block w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-700 dark:file:text-indigo-300
                         hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/60
                         disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <button
            // onClick={handleRestore}
            // disabled={isLoading || !file || !authToken}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses Restore..." : "Mulai Restore Database"}
          </button>
        </div>
        */}
        {/* ================================================================== */}
        {/* AKHIR BAGIAN COMMENT RESTORE */}
        {/* ================================================================== */}
      </div>
    </div>
  );
};

export default DatabaseAdminPage;
