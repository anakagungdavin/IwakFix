import axios from "axios";

const API_URL = "https://iwak.onrender.com/api";
// const API_URL = "https://iwak-seven.vercel.app/api/users";
// const API_URL = "https://iwak.onrender.com";

// Sign Up
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Sign Up Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login
export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    localStorage.setItem("token", response.data.token); // Simpan token
    localStorage.setItem("role", response.data.user.role);
    console.log(response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
export const signOut = () => {
  localStorage.removeItem("token");
};

// Mendapatkan user yang sedang login
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get User Error:", error.response?.data || error.message);
    throw error;
  }
};

// Request OTP
export const requestOTP = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/users/request-otp`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("OTP Request Error:", error.response?.data || error.message);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/users/verify-otp`, {
      email,
      otp,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);
    return response.data;
  } catch (error) {
    console.error(
      "OTP Verification Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
