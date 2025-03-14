import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../../services/authApi";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Data yang dikirim:", { email, password });

    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    try {
      const userData = await signIn({ email, password });
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.user.role);
      localStorage.setItem("userId", userData.user._id);
      if (userData.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.user.role === "customer") {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      const serverError =
        error.response?.data?.errors?.[0]?.msg ||
        "Login gagal! Periksa email atau password";
      setError(serverError);
    }
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">Selamat Datang</span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Sign In to Iwak.
          </h2>
          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Kata Sandi"
                  value={password}
                  onChange={(e) => {
                    console.log("Password input:", e.target.value); // Debugging
                    setPassword(e.target.value);
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon
                      className="dark:fill-gray-300 size-5"
                      opacity="0.5"
                    />
                  ) : (
                    <EyeClosedIcon
                      className="dark:fill-gray-300 size-5"
                      opacity="0.5"
                    />
                  )}
                </span>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Sign In"
                className="flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3"
              />
            </div>
            <div className="mt-6 text-center">
              <p>
                Belum punya akun?{" "}
                <Link to="/register" className="cursor-pointer text-[#FFBC00]">
                  Sign Up
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
