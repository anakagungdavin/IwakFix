import axios from "axios";

const API_URL = "https://iwak.onrender.com/api";

// Helper function untuk mendapatkan headers
const getHeaders = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Sesuaikan Content-Type berdasarkan tipe data
  headers["Content-Type"] =
    data instanceof FormData ? "multipart/form-data" : "application/json";

  return headers;
};

// Fungsi untuk mendapatkan daftar produk
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    handleError(error, "fetching products");
  }
};

// Fungsi untuk mendapatkan detail produk berdasarkan ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `fetching product with ID ${id}`);
  }
};

// Fungsi untuk menambahkan produk baru
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: getHeaders(productData),
    });
    return response.data;
  } catch (error) {
    handleError(error, "adding product");
  }
};

// Fungsi untuk mengupdate produk
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: getHeaders(productData),
    });
    return response.data;
  } catch (error) {
    handleError(error, `updating product with ID ${id}`);
  }
};

// Fungsi untuk menghapus produk
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error, `deleting product with ID ${id}`);
  }
};

// Function to handle errors
const handleError = (error, context) => {
  console.error(`Error ${context}:`, error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
  throw error;
};
