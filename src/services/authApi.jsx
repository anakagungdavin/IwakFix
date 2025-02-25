import axios from "axios";

const API_URL = "https://iwak.onrender.com/api/users";
// const API_URL = "https://iwak-seven.vercel.app/api/users";
// const API_URL = "http://localhost:5000/api";

// Sign Up
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
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
