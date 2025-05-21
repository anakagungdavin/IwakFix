import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Komponen helper untuk menampilkan kriteria password
const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "Minimal 8 karakter", regex: /.{8,}/ },
    { label: "Minimal 1 huruf kapital (A-Z)", regex: /[A-Z]/ },
    { label: "Minimal 1 huruf kecil (a-z)", regex: /[a-z]/ },
    { label: "Minimal 1 angka (0-9)", regex: /[0-9]/ },
    {
      label: 'Minimal 1 simbol khusus (!@#$%^&*(),.?":{}|<>)',
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
    { label: "Tidak mengandung spasi", regex: /^\S*$/ },
  ];

  return (
    <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
      {criteria.map((item, index) => (
        <li
          key={index}
          className={
            item.regex.test(password) ? "text-green-500" : "text-red-500"
          }
        >
          {item.label} {item.regex.test(password) ? "✓" : "✗"}
        </li>
      ))}
    </ul>
  );
};

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle show/hide password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token tidak valid atau URL tidak lengkap.");
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Reset error spesifik password saat pengguna mulai mengetik lagi
    if (error.toLowerCase().includes("password")) {
      setError("");
    }
    setMessage(""); // Juga reset pesan sukses
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    // Validasi frontend sederhana sebelum kirim (opsional, backend tetap jadi sumber utama)
    const criteriaMet = [
      /.{8,}/,
      /[A-Z]/,
      /[a-z]/,
      /[0-9]/,
      /[!@#$%^&*(),.?":{}|<>]/,
      /^\S*$/,
    ].every((regex) => regex.test(password));

    if (!criteriaMet) {
      setError("Password tidak memenuhi semua kriteria.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      let errorMessage = "Gagal reset password";
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors) &&
        err.response.data.errors.length > 0
      ) {
        // Gabungkan semua pesan error validasi jika ada lebih dari satu, atau ambil yang pertama
        errorMessage = err.response.data.errors.map((e) => e.msg).join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-2xl font-bold text-black">
            Reset Password Baru
          </h2>
          {message && (
            <p className="text-green-500 mb-4 p-3 bg-green-100 border border-green-300 rounded">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 mb-4 p-3 bg-red-100 border border-red-300 rounded">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 pl-5 pr-12 text-black outline-none focus:border-blue-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 py-3 text-gray-600 hover:text-gray-800"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {/* Tampilkan kriteria password jika password tidak kosong */}
              {password && <PasswordCriteria password={password} />}
            </div>

            <div className="mb-5">
              <button
                type="submit"
                className={`flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading || !token} // Nonaktifkan juga jika token tidak ada
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
                    Mengatur Ulang...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
            <div className="mt-6 text-center">
              <p>
                Ingat password Anda?{" "}
                <Link
                  to="/login"
                  className={`text-[#003D47] ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
