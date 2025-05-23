// SignUp.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate ditambahkan kembali jika ingin redirect
import { useState, useEffect } from "react";
import { signUp } from "../../../services/authApi"; // Pastikan path ini benar
import {
  EyeClosedIcon,
  EyeIcon,
  CheckCircle,
  AlertTriangle,
  Mail,
} from "lucide-react"; // Import ikon

const SignUp = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State untuk email yang berhasil didaftarkan
  const [registeredEmail, setRegisteredEmail] = useState(""); // Untuk menampilkan email di pesan sukses
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Untuk pesan sukses
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false); // Flag untuk status sukses
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: true,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setIsRegistrationSuccess(false);
    setRegisteredEmail(""); // Reset registered email
    setLoading(true);

    if (!passwordMatch) {
      setError("Konfirmasi kata sandi tidak sesuai");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password harus terdiri dari minimal 8 karakter, " +
          "minimal 1 huruf kapital, minimal 1 huruf kecil, " +
          "minimal 1 angka, minimal 1 simbol khusus, dan tidak boleh ada spasi."
      );
      setLoading(false);
      return;
    }
    try {
      const userData = { name, email, phoneNumber, password };
      const response = await signUp(userData);

      // Jika backend mengembalikan pesan bahwa email sudah terdaftar tapi belum diverifikasi
      if (response.message && response.message.includes("belum diverifikasi")) {
        setSuccessMessage(response.message); // Pesan ini sudah cukup jelas dari backend
        setRegisteredEmail(email); // Simpan email yang coba didaftarkan
        setIsRegistrationSuccess(true); // Anggap ini sebagai "sukses" dalam artian user perlu cek email
      } else {
        // Untuk pendaftaran baru yang sukses
        setSuccessMessage(
          `Registrasi berhasil! Kami telah mengirimkan email verifikasi ke alamat ${email}. Silakan periksa kotak masuk (dan folder spam) Anda untuk melanjutkan.`
        );
        setRegisteredEmail(email); // Simpan email yang berhasil didaftarkan
        setIsRegistrationSuccess(true);
      }

      // Kosongkan form setelah sukses
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      // Optional: redirect to a "check your email" page or login page after a delay
      // setTimeout(() => navigate('/login'), 10000); // Beri waktu user membaca pesan
    } catch (err) {
      setIsRegistrationSuccess(false);
      if (err.response && err.response.data) {
        if (
          err.response.data.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          setError(err.response.data.errors.map((e) => e.msg).join(", "));
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Registrasi gagal! Terjadi kesalahan tidak diketahui.");
        }
      } else {
        setError(
          "Registrasi gagal! Periksa koneksi internet Anda atau coba lagi nanti."
        );
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    // ... (fungsi validatePassword tetap sama)
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const noSpaces = /^\S*$/;

    return (
      minLength.test(password) &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password) &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password) &&
      noSpaces.test(password)
    );
  };

  useEffect(() => {
    // ... (useEffect untuk passwordValidation tetap sama)
    setPasswordValidation({
      minLength: /.{8,}/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSpaces: /^\S*$/.test(password),
    });
  }, [password]);

  const handleConfirmPasswordChange = (e) => {
    // ... (handleConfirmPasswordChange tetap sama)
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium text-black dark:text-white">
            Selamat Datang di Siphiko
          </span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Buat Akun Baru
          </h2>

          {/* Pesan Error */}
          {error &&
            !isRegistrationSuccess && ( // Hanya tampilkan error jika tidak ada pesan sukses
              <div className="mb-6 flex w-full items-center rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700 dark:bg-red-700 dark:text-red-100">
                <AlertTriangle size={24} className="mr-3" />
                <div>
                  <h5 className="font-semibold">Registrasi Gagal!</h5>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

          {/* Pesan Sukses yang Lebih Detail */}
          {isRegistrationSuccess && successMessage && (
            <div className="mb-6 flex w-full items-center rounded-lg border-l-4 border-green-500 bg-green-100 p-4 text-green-700 dark:bg-green-700 dark:text-green-100">
              <CheckCircle size={28} className="mr-3 flex-shrink-0" />
              <div>
                <h5 className="font-semibold">
                  {successMessage.includes("Kami telah mengirim ulang")
                    ? "Email Verifikasi Dikirim Ulang!"
                    : "Satu Langkah Lagi!"}
                </h5>
                <p className="text-sm mb-1">{successMessage}</p>
                <p className="text-xs">
                  Jika Anda tidak menemukan email di kotak masuk, coba periksa
                  folder <strong>Spam</strong> atau <strong>Junk</strong>. Email
                  akan dikirim dari{" "}
                  <span className="font-medium">
                    noreply.marketplaceiwak@gmail.com
                  </span>
                  {""}.
                </p>
                {registeredEmail && (
                  <p className="mt-2 text-xs">
                    Belum menerima email? Anda bisa{" "}
                    <Link
                      to="/resend-verification"
                      state={{ email: registeredEmail }}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      mengirim ulang email verifikasi
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form akan disembunyikan jika registrasi sukses dan tidak ada error */}
          {!(isRegistrationSuccess && !error) && (
            <form onSubmit={handleRegister}>
              {/* Input fields ... (tetap sama) */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nama <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukan nama anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500 dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                  {/* SVG Icon (jika ada) */}
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Masukan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500 dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                  {/* SVG Icon (jika ada) */}
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nomor Telephone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    pattern="^(\+62|62|0)8[1-9][0-9]{6,9}$"
                    inputMode="numeric"
                    placeholder="Masukan telephone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500 dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-blue-500"
                    disabled={loading}
                  />
                  {/* SVG Icon (jika ada) */}
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500 dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-blue-500"
                    disabled={loading}
                  />
                  <span
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    onClick={() => !loading && setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-current opacity-50 dark:opacity-70 size-5" />
                    ) : (
                      <EyeClosedIcon className="fill-current opacity-50 dark:opacity-70 size-5" />
                    )}
                  </span>
                </div>
                {/* Password validation criteria */}
                <div className="text-sm mt-3">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Kata sandi harus terdiri dari:
                  </p>
                  <ul className="space-y-1 ml-1 text-gray-600 dark:text-gray-400">
                    {/* ... kriteria password ... */}
                    <li
                      className={`flex items-center ${
                        passwordValidation.minLength
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.minLength ? "✓" : "✗"}
                      </span>{" "}
                      Minimal 8 karakter{" "}
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordValidation.hasUpperCase
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.hasUpperCase ? "✓" : "✗"}
                      </span>{" "}
                      Minimal 1 huruf kapital{" "}
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordValidation.hasLowerCase
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.hasLowerCase ? "✓" : "✗"}
                      </span>{" "}
                      Minimal 1 huruf kecil{" "}
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordValidation.hasNumber
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.hasNumber ? "✓" : "✗"}
                      </span>{" "}
                      Minimal 1 angka{" "}
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordValidation.hasSpecialChar
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                      </span>{" "}
                      Minimal 1 simbol khusus{" "}
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordValidation.noSpaces
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      <span className="mr-1">
                        {passwordValidation.noSpaces ? "✓" : "✗"}
                      </span>{" "}
                      Tidak ada spasi{" "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Masukan Konfirmasi Kata Sandi"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className={`w-full rounded-md border bg-white py-3 px-5 text-black focus:right-2 outline-none dark:bg-form-input dark:text-white ${
                      passwordMatch
                        ? "border-gray-300 focus:border-blue-500 dark:border-strokedark dark:focus:border-blue-500"
                        : "border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500"
                    }`}
                    disabled={loading}
                  />
                  {!passwordMatch && (
                    <p className="text-red-500 text-sm mt-1">
                      Konfirmasi kata sandi tidak cocok.
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3 transition hover:bg-opacity-90 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        /* ... SVG loading ... */ className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>{" "}
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>{" "}
                      </svg>
                      Mendaftar...
                    </>
                  ) : (
                    "Buat Akun"
                  )}
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-black dark:text-white">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className=" cursor-pointer text-[#FFBC00] hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Jika registrasi sukses, tampilkan link ke Login sebagai alternatif */}
          {isRegistrationSuccess && !error && (
            <div className="mt-8 text-center">
              <p className="text-black dark:text-white">
                Anda dapat menutup halaman ini atau{" "}
                <Link
                  to="/login"
                  className=" cursor-pointer text-[#FFBC00] hover:underline"
                >
                  kembali ke halaman Login
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
