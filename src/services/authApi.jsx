// src/services/authApi.jsx (atau path yang sesuai di proyek Anda)
import axios from "axios";

// Pastikan API_URL ini sesuai dengan backend Anda
const API_URL = "http://localhost:5000/api"; // Sesuaikan jika berbeda

// Sign Up
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data; // Backend akan mengembalikan { message: "..." }
  } catch (error) {
    // Biarkan komponen SignUp menangani error untuk menampilkan pesan yang lebih spesifik
    // error.response akan ada jika backend mengirim respons error (misalnya 400, 409, atau 200 dengan pesan khusus)
    throw error;
  }
};

// Login
export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    console.log("Login response:", response.data); // Untuk debugging

    // Jika login berhasil dan user terverifikasi, token dan data user akan ada
    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token || "");
      localStorage.setItem("userId", response.data.user._id || "");
      localStorage.setItem("role", response.data.user.role || "");
      // Simpan data user lain yang mungkin berguna
      localStorage.setItem("userName", response.data.user.name || "");
      localStorage.setItem("userEmail", response.data.user.email || "");
      localStorage.setItem("userAvatar", response.data.user.avatar || ""); // Jika ada
    } else if (response.data.action === "resend_verification_required") {
      // Kondisi ini seharusnya tidak terjadi jika backend mengirim status 403 untuk unverified
      // Tapi sebagai jaga-jaga jika backend mengirim status 200 dengan flag ini
      throw { response: { data: response.data } }; // Lempar agar ditangani di komponen
    } else {
      // Token atau data user tidak ada (seharusnya tidak terjadi jika backend konsisten)
      throw new Error(
        "Token atau data pengguna tidak ada dalam respons login yang sukses"
      );
    }
    return response.data;
  } catch (error) {
    // error.response akan ada jika backend mengirim status error (401, 403, dll.)
    // console.error("Login Error:", error.response?.data || error.message);
    throw error; // Lempar error agar bisa ditangkap dan ditangani di komponen LoginPage
  }
};

// Logout
export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userAvatar");
  // Anda bisa redirect ke halaman login di sini jika dipanggil dari tempat yang tidak melakukan redirect otomatis
  // window.location.href = '/login';
};

// Mendapatkan user yang sedang login
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // signOut(); // Hapus sisa data jika token tidak ada
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Simpan/update data user di localStorage jika ada perubahan dari server
    if (response.data.success && response.data.data) {
      localStorage.setItem("userId", response.data.data._id || "");
      localStorage.setItem("role", response.data.data.role || "");
      localStorage.setItem("userName", response.data.data.name || "");
      localStorage.setItem("userEmail", response.data.data.email || "");
      localStorage.setItem("userAvatar", response.data.data.avatar || "");
    }
    return response.data;
  } catch (error) {
    // console.error("Get User Error:", error.response?.data || error.message);
    // Jika token tidak valid (misalnya 401 Unauthorized atau 403 Forbidden dari server)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      signOut(); // Logout user dengan menghapus data dari localStorage
    }
    throw error;
  }
};

// Fungsi baru untuk Kirim Ulang Email Verifikasi
export const resendVerificationEmail = async (emailData) => {
  // emailData = { email: "user@example.com" }
  try {
    const response = await axios.post(
      `${API_URL}/users/resend-verification-email`,
      emailData
    );
    return response.data; // Seharusnya mengembalikan { message: "Email verifikasi telah dikirim ulang..." }
  } catch (error) {
    // console.error("Resend Verification Email Error:", error.response?.data || error.message);
    throw error; // Biarkan komponen yang memanggil menangani error spesifik
  }
};

// Fungsi untuk Forgot Password
export const forgotPassword = async (emailData) => {
  // emailData = { email: "user@example.com" }
  try {
    const response = await axios.post(
      `${API_URL}/users/forgot-password`,
      emailData
    );
    return response.data;
  } catch (error) {
    // console.error("Forgot Password Error:", error.response?.data || error.message);
    throw error;
  }
};

// Fungsi untuk Reset Password
export const resetPassword = async (token, passwordData) => {
  // passwordData = { password: "newPassword" }
  try {
    const response = await axios.post(
      `${API_URL}/users/reset-password/${token}`,
      passwordData
    );
    return response.data;
  } catch (error) {
    // console.error("Reset Password Error:", error.response?.data || error.message);
    throw error;
  }
};
