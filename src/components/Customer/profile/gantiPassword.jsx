// src/components/customer/profile/gantiPassword.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: true, // Default true untuk string kosong
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();

  // Fungsi HANYA untuk mengecek validitas password dan mengembalikan boolean
  const checkPasswordValidity = (password) => {
    const minLength = /.{8,}/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaces = /^\S*$/.test(password);

    return (
      minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      noSpaces
    );
  };

  // Fungsi untuk MENGATUR state passwordValidation
  // useCallback di sini penting karena fungsi ini akan menjadi dependensi useEffect
  const updatePasswordValidationState = useCallback(
    (password) => {
      setPasswordValidation({
        minLength: /.{8,}/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        noSpaces: /^\S*$/.test(password) || password === "", // Anggap string kosong tidak punya spasi
      });
    },
    [setPasswordValidation]
  ); // setPasswordValidation adalah dependensi stabil

  useEffect(() => {
    // Update state validasi ketika formData.newPassword berubah
    updatePasswordValidationState(formData.newPassword);
  }, [formData.newPassword, updatePasswordValidationState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };

      if (name === "newPassword") {
        // updatePasswordValidationState sudah dipanggil oleh useEffect di atas
        // Cukup update passwordMatch jika confirmNewPassword sudah diisi
        if (newFormData.confirmNewPassword) {
          setPasswordMatch(value === newFormData.confirmNewPassword);
        } else {
          setPasswordMatch(true); // Jika konfirmasi kosong, anggap cocok untuk sementara
        }
      } else if (name === "confirmNewPassword") {
        setPasswordMatch(value === newFormData.newPassword);
      }
      return newFormData;
    });
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    if (!checkPasswordValidity(formData.newPassword)) {
      setError(
        "Password baru tidak memenuhi semua kriteria. Silakan periksa kembali."
      );
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sesi tidak valid. Silakan login kembali.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(`${apiUrl}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengganti password.");
      }

      setSuccess(data.message || "Password berhasil diubah.");
      setFormData({
        // Ini akan memicu useEffect untuk mereset passwordValidation
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordMatch(true); // Reset match
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PasswordValidationCriteria = ({ criteria }) => (
    <div className="text-sm mt-3 mb-3">
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Password baru harus terdiri dari:
      </p>
      <ul className="space-y-1 ml-1 text-gray-600 dark:text-gray-400">
        <li
          className={`flex items-center ${
            criteria.minLength ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.minLength ? "✓" : "✗"}</span>
          Minimal 8 karakter
        </li>
        <li
          className={`flex items-center ${
            criteria.hasUpperCase ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.hasUpperCase ? "✓" : "✗"}</span>
          Minimal 1 huruf kapital
        </li>
        <li
          className={`flex items-center ${
            criteria.hasLowerCase ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.hasLowerCase ? "✓" : "✗"}</span>
          Minimal 1 huruf kecil
        </li>
        <li
          className={`flex items-center ${
            criteria.hasNumber ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.hasNumber ? "✓" : "✗"}</span>
          Minimal 1 angka
        </li>
        <li
          className={`flex items-center ${
            criteria.hasSpecialChar ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.hasSpecialChar ? "✓" : "✗"}</span>
          Minimal 1 simbol khusus (!@#$%^&*)
        </li>
        <li
          className={`flex items-center ${
            criteria.noSpaces ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="mr-1">{criteria.noSpaces ? "✓" : "✗"}</span>
          Tidak ada spasi
        </li>
      </ul>
    </div>
  );

  // Tentukan apakah tombol submit harus dinonaktifkan
  const isNewPasswordFilled = !!formData.newPassword;
  const isNewPasswordValid = isNewPasswordFilled
    ? checkPasswordValidity(formData.newPassword)
    : false; // Hanya valid jika diisi dan valid
  const isConfirmPasswordFilled = !!formData.confirmNewPassword;
  const passwordsMatch = formData.newPassword === formData.confirmNewPassword;

  const isSubmitDisabled =
    loading ||
    (isNewPasswordFilled && !isNewPasswordValid) || // Jika newPassword diisi tapi tidak valid
    (isNewPasswordFilled && isConfirmPasswordFilled && !passwordsMatch); // Jika keduanya diisi tapi tidak cocok

  return (
    <div className="bg-white p-0 md:p-6 rounded-lg">
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
          role="alert"
        >
          <p className="font-bold">Sukses</p>
          <p>{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Password Lama <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword.old ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("old")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword.old ? "Sembunyikan password" : "Tampilkan password"
              }
              disabled={loading}
            >
              {showPassword.old ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Password Baru <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("new")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword.new
                  ? "Sembunyikan password baru"
                  : "Tampilkan password baru"
              }
              disabled={loading}
            >
              {showPassword.new ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <PasswordValidationCriteria criteria={passwordValidation} />
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Konfirmasi Password Baru <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                !formData.confirmNewPassword || passwordsMatch // Gunakan `passwordsMatch`
                  ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  : "border-red-500 focus:ring-red-500 focus:border-red-500"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirm")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword.confirm
                  ? "Sembunyikan konfirmasi password"
                  : "Tampilkan konfirmasi password"
              }
              disabled={loading}
            >
              {showPassword.confirm ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {formData.confirmNewPassword &&
            !passwordsMatch && ( // Gunakan `passwordsMatch`
              <p className="text-red-500 text-xs mt-1">
                Konfirmasi password tidak cocok.
              </p>
            )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003D47] hover:bg-[#002c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Menyimpan...
              </>
            ) : (
              "Ganti Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
