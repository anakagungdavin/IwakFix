// src/pages/auth/ResendVerificationPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resendVerificationEmail } from "../../services/authApi"; // Sesuaikan path jika perlu

const ResendVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email wajib diisi.");
      setLoading(false);
      return;
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      setLoading(false);
      return;
    }

    try {
      const response = await resendVerificationEmail({ email });
      setMessage(
        response.message ||
          "Jika email terdaftar dan belum diverifikasi, email verifikasi akan dikirim ulang."
      );
      setEmail(""); // Kosongkan field email setelah berhasil
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (
        err.response &&
        err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        // Jika backend mengirim array errors (dari express-validator)
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError(
          "Gagal mengirim ulang email verifikasi. Silakan coba lagi nanti."
        );
      }
      console.error("Resend verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#003D47] dark:text-[#FFBC00]">
            Kirim Ulang Email Verifikasi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Masukkan alamat email Anda untuk menerima link verifikasi baru.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-700 dark:text-green-100">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-700 dark:text-red-100">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FFBC00] focus:border-[#FFBC00] focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#003D47] dark:focus:border-[#003D47]"
                placeholder="Alamat Email"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#003D47] hover:bg-[#002c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003D47] dark:bg-[#FFBC00] dark:hover:bg-[#e0a800] dark:focus:ring-[#FFBC00] dark:text-gray-900 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                "Kirim Ulang Email"
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link
            to="/login"
            className="font-medium text-[#003D47] hover:text-[#002c33] dark:text-[#FFBC00] dark:hover:text-[#e0a800]"
          >
            Kembali ke Halaman Login
          </Link>
        </div>
        <div className="text-sm text-center">
          <Link
            to="/register"
            className="font-medium text-[#003D47] hover:text-[#002c33] dark:text-[#FFBC00] dark:hover:text-[#e0a800]"
          >
            Belum punya akun? Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
