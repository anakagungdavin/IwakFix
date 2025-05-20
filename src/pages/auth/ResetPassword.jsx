import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  message = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/signin"), 3000); // Redirect ke login setelah 3 detik
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mereset password");
    }
  };

  return (
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Masukkan password baru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="mb-5">
              <button
                type="submit"
                className="flex w-full items-center justify-center cursor-pointer bg-[#003D47] text-[#ffff] rounded-md py-3"
              >
                Reset Password
              </button>
            </div>
            <div className="mt-6 text-center">
              <p>
                Kembali ke{" "}
                <Link to="/login" className="cursor-pointer text-[#003D47]">
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
