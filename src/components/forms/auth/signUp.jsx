import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../../services/authApi";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: true,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert("Konfirmasi kata sandi tidak sesuai");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        "Password harus terdiri dari minimal 8 karakter, " +
          "minimal 1 huruf kapital, minimal 1 huruf kecil, " +
          "minimal 1 angka, minimal 1 simbol khusus, dan tidak boleh ada spasi."
      );
      return;
    }
    try {
      // The backend should generate and send OTP in this step
      await signUp({ name, email, phoneNumber, password });
      // Pass email to the OTP verification page
      navigate("/otp-verification", { state: { email, isSignUp: true } });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Email sudah terdaftar! Gunakan email lain.");
      } else {
        alert("Registrasi gagal! Coba lagi.");
      }
      setError("Registrasi gagal! Coba lagi.");
    }
  };

  const validatePassword = (password) => {
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
    // Update validation status whenever password changes
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
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">
            Selamat Datang di Iwak.
          </span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Buat akun baru
          </h2>
          <form onSubmit={handleRegister}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nama <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukan nama anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                />
                <span className="absolute right-4 top-4">
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
                        d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                        fill=""
                      />
                      <path
                        d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Masukan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                />
                <span className="absolute right-4 top-4">
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
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nomor Telephone <span className="text-red-500">*</span>{" "}
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
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
                <span className="absolute right-4 top-4">
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
                        d="M6.6 2H17.4C19.29 2 20.8 3.51 20.8 5.4V18.6C20.8 20.49 19.29 22 17.4 22H6.6C4.71 22 3.2 20.49 3.2 18.6V5.4C3.2 3.51 4.71 2 6.6 2ZM6.6 3.6C5.49 3.6 4.6 4.49 4.6 5.6V18.4C4.6 19.51 5.49 20.4 6.6 20.4H17.4C18.51 20.4 19.4 19.51 19.4 18.4V5.6C19.4 4.49 18.51 3.6 17.4 3.6H6.6ZM12 18C11.45 18 11 17.55 11 17C11 16.45 11.45 16 12 16C12.55 16 13 16.45 13 17C13 17.55 12.55 18 12 18ZM12 5C12.83 5 13.5 5.67 13.5 6.5C13.5 7.33 12.83 8 12 8C11.17 8 10.5 7.33 10.5 6.5C10.5 5.67 11.17 5 12 5ZM12 9C13.93 9 15.5 10.57 15.5 12.5C15.5 13.22 15.22 13.86 14.72 14.36L12.6 16.48C12.46 16.62 12.24 16.62 12.1 16.48L9.98 14.36C9.48 13.86 9.2 13.22 9.2 12.5C9.2 10.57 10.77 9 12 9Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Kata Sandi <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
                <span
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className=" dark:fill-gray-400 size-5 opacity-55" />
                  ) : (
                    <EyeClosedIcon className=" dark:fill-gray-400 size-5 opacity-55" />
                  )}
                </span>
              </div>

              <div className="text-sm mt-3">
                <p className="text-gray-600 mb-2">
                  Kata sandi harus terdiri dari:
                </p>
                <ul className="space-y-1 ml-1">
                  <li
                    className={`flex items-center ${
                      passwordValidation.minLength
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.minLength ? "✓" : "✗"}
                    </span>
                    Minimal 8 karakter
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidation.hasUpperCase
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasUpperCase ? "✓" : "✗"}
                    </span>
                    Minimal 1 huruf kapital
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidation.hasLowerCase
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasLowerCase ? "✓" : "✗"}
                    </span>
                    Minimal 1 huruf kecil
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidation.hasNumber
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasNumber ? "✓" : "✗"}
                    </span>
                    Minimal 1 angka
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidation.hasSpecialChar
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                    </span>
                    Minimal 1 simbol khusus
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidation.noSpaces
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.noSpaces ? "✓" : "✗"}
                    </span>
                    Tidak boleh ada spasi
                  </li>
                </ul>
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Masukan Konfirmasi Kata Sandi"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black focus:border-blue-500 focus:right-2 outline-none ${
                    passwordMatch
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-red-500 focus:ring-red-500"
                  }`}
                />
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Konfirmasi kata sandi tidak cocok.
                  </p>
                )}
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Buat Akun"
                className="flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3"
              />
            </div>
            <div className="mt-6 text-center">
              <p>
                Sudah punya akun?{" "}
                <Link to="/login" className=" cursor-pointer text-[#FFBC00]">
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

export default SignUp;
