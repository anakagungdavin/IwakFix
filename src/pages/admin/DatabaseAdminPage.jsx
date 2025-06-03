// client/src/pages/Admin/DatabaseAdminPage.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; // <--- Impor toast

const DatabaseAdminPage = () => {
  // const [message, setMessage] = useState(""); // Kita tidak lagi menggunakan state message ini
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      toast.error("Akses ditolak. Silakan login sebagai admin."); // <--- Ganti setMessage dengan toast
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
      toast.error("Autentikasi diperlukan untuk backup."); // <--- Ganti
      return;
    }
    setIsLoading(true);
    // setMessage("Memulai proses backup..."); // Tidak perlu lagi, atau bisa toast.loading
    const loadingToastId = toast.loading("Memulai proses backup..."); // <--- Toast loading

    try {
      const response = await fetch(getApiUrl("/backup"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toast.dismiss(loadingToastId); // <--- Hapus toast loading

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

      toast.success("Backup berhasil didownload!"); // <--- Ganti
    } catch (error) {
      toast.dismiss(loadingToastId); // Pastikan loading toast dihapus jika error
      console.error("Backup error:", error);
      toast.error(
        `Backup gagal: ${error.message} (Abaikan jika anda menggunakan Internet Download Manager)`
      ); // <--- Ganti
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // setMessage(""); // Tidak perlu lagi
  };

  const handleRestore = async () => {
    if (!authToken) {
      toast.error("Autentikasi diperlukan untuk restore."); // <--- Ganti
      return;
    }
    if (!file) {
      toast.error("Pilih file backup terlebih dahulu."); // <--- Ganti
      return;
    }

    const confirmRestore = window.confirm(
      "PERHATIAN! Proses ini akan MENGHAPUS data database saat ini dan menggantinya dengan data dari file backup. Apakah Anda yakin ingin melanjutkan?"
    );
    if (!confirmRestore) {
      toast.custom(
        (
          t // Contoh custom toast jika ingin
        ) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Informasi</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Proses restore dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Tutup
              </button>
            </div>
          </div>
        ),
        { duration: 4000 }
      ); // Custom toast bisa memiliki style sendiri
      // atau sederhananya: toast('Proses restore dibatalkan.');
      return;
    }

    setIsLoading(true);
    // setMessage("Memulai proses restore..."); // Tidak perlu lagi
    const loadingToastId = toast.loading("Memulai proses restore..."); // <--- Toast loading

    const formData = new FormData();
    formData.append("backupFile", file);

    try {
      const response = await fetch(getApiUrl("/restore"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      toast.dismiss(loadingToastId); // <--- Hapus toast loading

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      // Menampilkan pesan sukses dan warnings jika ada
      let successMessage = `Database berhasil direstore!`;
      // if (result.warnings && result.warnings.length > 10) {
      //   // Hanya tampilkan warning jika ada dan tidak terlalu panjang (atau parse)
      //   successMessage += ` (Ada beberapa peringatan, cek konsol backend)`;
      //   console.warn("Restore Warnings:", result.warnings); // Tetap log warning panjang ke konsol
      // } else if (result.warnings) {
      //   successMessage += ` (Warnings: ${result.warnings.substring(
      //     0,
      //     100
      //   )}...)`; // Potong warning jika terlalu panjang untuk toast
      // }
      toast.success(successMessage, { duration: 7000 }); // Sukses tampil lebih lama untuk dibaca
    } catch (error) {
      toast.dismiss(loadingToastId); // Pastikan loading toast dihapus jika error
      console.error("Restore error:", error);
      toast.error(`Restore gagal: ${error.message}`); // <--- Ganti
    } finally {
      setIsLoading(false);
      setFile(null);
      if (document.getElementById("backupFileRestore")) {
        document.getElementById("backupFileRestore").value = "";
      }
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-8">
        {/* ... (Konten JSX lainnya tetap sama) ... */}
        {/* HAPUS BAGIAN INI: */}
        {/* {message && (
          <div
            className={`mt-8 p-4 rounded-lg text-center font-medium text-sm
                        ${
                          message.toLowerCase().includes("gagal") ||
                          message.toLowerCase().includes("error") ||
                          message.toLowerCase().includes("ditolak")
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : message.toLowerCase().includes("dibatalkan")
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-green-100 text-green-800 border border-green-300"
                        }`}
          >
            {message}
          </div>
        )} */}
        {/* Bagian di atas dihapus karena kita menggunakan toast */}

        {/* Backup Section (tombol, dll tidak berubah) */}
        <div className="mb-10 p-4 md:p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
            Backup Database
          </h2>
          <p className="text-sm text-gray-600 mb-5">
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

        <hr className="my-8 border-gray-300" />

        {/* Restore Section (tombol, dll tidak berubah) */}
        <div className="p-4 md:p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
            Restore Database
          </h2>
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih File Backup (.zip atau .gz):
            </label>
            <input
              id="backupFileRestore"
              type="file"
              onChange={handleFileChange}
              disabled={isLoading || !authToken}
              accept=".zip,.gz,.archive"
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100
                         disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleRestore}
            disabled={isLoading || !file || !authToken}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses Restore..." : "Mulai Restore Database"}
          </button>
        </div>
        {/* Tidak ada lagi blok {message && ...} di sini */}
      </div>
    </div>
  );
};

export default DatabaseAdminPage;
