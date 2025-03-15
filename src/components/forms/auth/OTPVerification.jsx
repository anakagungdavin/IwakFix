import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifySignUpOTP, resendOTP } from "../../../services/authApi";

const OTPVerification = () => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const isSignUp = location.state?.isSignUp || false;

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Kode OTP wajib diisi!");
      return;
    }

    try {
      await verifySignUpOTP(email, otp);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const serverError =
        error.response?.data?.errors?.[0]?.msg ||
        "Verifikasi gagal! Kode OTP tidak valid.";
      setError(serverError);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await resendOTP(email);
      setTimeLeft(300); // Reset timer to 5 minutes
      setError(null);
    } catch (error) {
      setError("Gagal mengirim ulang kode OTP. Silakan coba lagi.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (success) {
    return (
      <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
        <div className="max-w-full overflow-x-auto">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5 text-center">
            <div className="mb-6 text-green-500 text-6xl">✓</div>
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              Akun Berhasil Diverifikasi!
            </h2>
            <p className="mb-6 text-gray-600">
              Selamat! Akun Anda telah berhasil diverifikasi. Anda akan
              diarahkan ke halaman login dalam beberapa detik.
            </p>
            <Link to="/login" className="text-[#FFBC00]">
              Login Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">Verifikasi Akun</span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Masukkan Kode OTP
          </h2>
          <p className="mb-4 text-gray-600">
            Kami telah mengirimkan kode OTP ke email{" "}
            <span className="font-semibold">{email}</span>
          </p>
          <form onSubmit={handleVerify}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Kode OTP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan kode 6 digit"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                  maxLength={6}
                />
              </div>
            </div>
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600 mb-4">
                Kode akan kedaluwarsa dalam {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-sm text-red-500 mb-4">
                Kode telah kedaluwarsa. Silakan minta kode baru.
              </p>
            )}
            <div className="mb-5">
              <input
                type="submit"
                value="Verifikasi Akun"
                className="flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3"
                disabled={timeLeft === 0}
              />
            </div>
            <div className="mt-6 text-center">
              <p>
                Tidak menerima kode?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="cursor-pointer text-[#FFBC00]"
                  disabled={timeLeft > 240 || isResending} // Wait at least 1 minute before resending
                >
                  {isResending ? "Mengirim..." : "Kirim Ulang"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
