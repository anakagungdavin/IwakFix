// src/pages/auth/AuthMessagePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, Info, Mail } from "lucide-react"; // Import ikon
import { resendVerificationEmail } from "../../services/authApi"; // Sesuaikan path

const AuthMessagePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const emailForResend = searchParams.get("email"); // Untuk kasus token kedaluwarsa

  const [pageTitle, setPageTitle] = useState("Status Proses");
  const [displayMessage, setDisplayMessage] = useState(
    message || "Memproses permintaan Anda..."
  );
  const [icon, setIcon] = useState(
    <Info size={48} className="text-blue-500" />
  );
  const [showResendLink, setShowResendLink] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatusMessage, setResendStatusMessage] = useState("");

  useEffect(() => {
    if (!status && !message) {
      // Jika tidak ada parameter, mungkin redirect ke home atau login
      navigate("/login");
      return;
    }

    switch (status) {
      case "invalid_token":
        setPageTitle("Token Tidak Valid");
        setIcon(<AlertTriangle size={48} className="text-red-500" />);
        setShowResendLink(false); // Token salah, tidak ada email untuk dikirim ulang
        break;
      case "expired_token":
        setPageTitle("Token Kedaluwarsa");
        setIcon(<AlertTriangle size={48} className="text-orange-500" />);
        if (emailForResend) setShowResendLink(true);
        break;
      case "error":
        setPageTitle("Terjadi Kesalahan");
        setIcon(<AlertTriangle size={48} className="text-red-500" />);
        break;
      // Anda bisa menambahkan status lain dari backend jika perlu
      default:
        // Jika tidak ada status spesifik, anggap sebagai info umum
        setPageTitle("Informasi");
        setIcon(<Info size={48} className="text-blue-500" />);
    }
    // Display message sudah di-set dari searchParams
  }, [status, message, emailForResend, navigate]);

  const handleResendVerification = async () => {
    if (!emailForResend) return;
    setResendLoading(true);
    setResendStatusMessage("");
    try {
      const response = await resendVerificationEmail({ email: emailForResend });
      setResendStatusMessage(
        response.message ||
          "Email verifikasi telah dikirim ulang. Periksa inbox dan spam Anda."
      );
      setShowResendLink(false); // Sembunyikan link setelah berhasil kirim ulang
    } catch (err) {
      setResendStatusMessage(
        err.response?.data?.message || "Gagal mengirim ulang email verifikasi."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex justify-center">{icon}</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {pageTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          {displayMessage}
        </p>

        {showResendLink && (
          <div className="mb-6">
            <button
              onClick={handleResendVerification}
              disabled={resendLoading}
              className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#003D47] hover:bg-[#002c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003D47] dark:bg-[#FFBC00] dark:hover:bg-[#e0a800] dark:text-gray-900 ${
                resendLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resendLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                <>
                  <Mail size={20} className="mr-2" />
                  Kirim Ulang Email Verifikasi
                </>
              )}
            </button>
            {resendStatusMessage && (
              <p
                className={`mt-3 text-sm ${
                  resendStatusMessage.includes("Gagal")
                    ? "text-red-500"
                    : "text-green-500"
                } dark:text-gray-300`}
              >
                {resendStatusMessage}
              </p>
            )}
          </div>
        )}

        <Link
          to="/login"
          className="font-medium text-[#003D47] hover:text-[#002c33] dark:text-[#FFBC00] dark:hover:text-[#e0a800] transition duration-150 ease-in-out"
        >
          Kembali ke Halaman Login
        </Link>
        <div className="mt-4">
          <Link
            to="/customer-dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Atau kunjungi Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthMessagePage;
