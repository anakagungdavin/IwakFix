// src/pages/Auth/VerifyEmailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Pastikan axios terinstal

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(
    "Verifikasi email Anda..."
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          setLoading(true);
          setError("");
          // Ganti URL dengan URL API Anda
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/verify-email/${token}`
          );
          setVerificationStatus(
            response.data.message || "Email berhasil diverifikasi!"
          );
          // Arahkan ke login setelah beberapa detik
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Gagal memverifikasi email. Token mungkin tidak valid atau kedaluwarsa."
          );
          setVerificationStatus("Verifikasi Gagal");
        } finally {
          setLoading(false);
        }
      };
      verifyEmail();
    } else {
      setError("Token verifikasi tidak ditemukan.");
      setVerificationStatus("Verifikasi Gagal");
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#003D47]">
          Status Verifikasi Email
        </h2>
        {loading && (
          <div className="flex justify-center items-center my-4">
            <svg
              className="animate-spin h-8 w-8 text-[#003D47]"
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
            <p className="ml-2 text-gray-600">Memproses...</p>
          </div>
        )}
        {!loading && verificationStatus && !error && (
          <p className="text-green-600 text-lg mb-6">{verificationStatus}</p>
        )}
        {!loading && error && (
          <p className="text-red-500 text-lg mb-6">{error}</p>
        )}
        {!loading && (
          <Link
            to="/login"
            className="inline-block bg-[#003D47] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#002c33] transition duration-300"
          >
            Ke Halaman Login
          </Link>
        )}
        {!loading && error && (
          <Link
            to="/resend-verification" // Anda perlu membuat halaman atau komponen ini
            className="mt-4 inline-block text-sm text-[#FFBC00] hover:underline"
          >
            Kirim ulang email verifikasi?
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
