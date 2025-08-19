import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { signIn } from "../../../services/authApi"; // Pastikan path ini benar
import { EyeClosedIcon, EyeIcon } from "lucide-react"; // Menggunakan lucide-react

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const navigate = useNavigate();

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (error === "Harap verifikasi bahwa Anda bukan robot.") {
      setError(null); // Hapus error captcha jika token diterima
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error di awal
    setLoading(true); // Set loading true

    if (!recaptchaToken) {
      setError("Harap verifikasi bahwa Anda bukan robot.");
      setLoading(false); // Set loading false
      return;
    }

    try {
      // Fungsi signIn Anda harus menangani request axios dan mengembalikan data atau melempar error
      // Misalnya, jika signIn adalah wrapper untuk axios:
      // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      //   email,
      //   password,
      //   recaptchaToken, // Jika backend Anda memvalidasi reCAPTCHA
      // });
      // const userData = response.data;

      // Menggunakan fungsi signIn yang diimpor
      const userData = await signIn({ email, password, recaptchaToken });

      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.user.role); // Simpan role

      // Redirect berdasarkan role
      if (userData.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.user.role === "customer") {
        navigate("/customer-dashboard"); // Pastikan rute ini ada
      } else {
        navigate("/"); // Fallback redirect
      }
    } catch (err) {
      // Tangani error spesifik dari rate limiter atau error umum lainnya
      if (err.response) {
        // Error dari server (misalnya 4xx, 5xx)
        if (err.response.status === 429) {
          // Rate limit terlampaui
          setError(
            err.response.data.message ||
              "Terlalu banyak percobaan, coba lagi nanti."
          );
        } else if (err.response.data && err.response.data.message) {
          // Error lain dari backend dengan pesan
          setError(err.response.data.message);
        } else if (
          err.response.data &&
          err.response.data.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          // Error validasi dari express-validator
          setError(err.response.data.errors.map((e) => e.msg).join(", "));
        } else {
          // Error server umum
          setError("Login gagal! Periksa kembali email dan password Anda.");
        }
      } else if (err.request) {
        // Request dibuat tapi tidak ada respons (masalah jaringan)
        setError(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        // Error lain saat setup request
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error("Login error:", err); // Untuk debugging
    } finally {
      setLoading(false); // Set loading false di akhir
      // Reset reCAPTCHA jika ada error login, kecuali error captcha itu sendiri
      if (
        window.grecaptcha &&
        error !== "Harap verifikasi bahwa Anda bukan robot."
      ) {
        try {
          window.grecaptcha.reset();
          setRecaptchaToken(null);
        } catch (e) {
          console.warn("Gagal mereset reCAPTCHA:", e);
        }
      }
    }
  };

  return (
    <div className="rounded-sm border-stroke bg-white dark:bg-[#262626] px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">Selamat Datang</span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Sign In ke Akun Anda
          </h2>
          <form onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 mb-4 p-3 bg-red-100 border border-red-300 rounded">
                {error}
              </p>
            )}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                  disabled={loading}
                />
                <span className="absolute right-4 top-4">
                  {/* SVG ikon email */}
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 pl-5 pr-12 text-black outline-none focus:border-blue-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-gray-800"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeClosedIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {RECAPTCHA_SITE_KEY && (
              <div className="mb-6 flex justify-center">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  onExpired={() => setRecaptchaToken(null)} // Reset token on expiry
                  onError={() =>
                    setError("Gagal memuat reCAPTCHA. Coba muat ulang halaman.")
                  } // Handle reCAPTCHA load error
                />
              </div>
            )}
            <div className="mb-5">
              <button // Mengubah input submit menjadi button untuk loading state
                type="submit"
                className={`flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Memproses...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            <div className="mt-6 text-center">
              <p>
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className={`cursor-pointer text-[#003D47] ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Sign Up
                </Link>
              </p>
              <p className="mt-2">
                <Link
                  to="/forgot-password"
                  className={`cursor-pointer text-[#003D47] ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Lupa Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
