import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Sign Up
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("Sign Up Error Details:", errorDetails);
    throw error;
  }
};

// Login
export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    console.log("Login response:", response.data); // Debug respons

    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token || ""); // Pastikan string
      localStorage.setItem("userId", response.data.user._id || ""); // Pastikan string
      localStorage.setItem("role", response.data.user.role || ""); // Pastikan string
    } else {
      throw new Error("Token or user data missing in response");
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
};

// Mendapatkan user yang sedang login
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get User Error:", error.response?.data || error.message);
    throw error;
  }
};
