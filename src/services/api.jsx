import axios from "axios";

const API_URL = "http://localhost:5000/api";
// const API_URL = "https://iwak.onrender.com/api";

// Fungsi untuk menentukan header berdasarkan tipe data
const getHeaders = (data) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`, // Sertakan token JWT
  };

  if (data instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// Fungsi untuk mendapatkan daftar produk
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: getHeaders(null), // Sertakan token
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mendapatkan detail produk berdasarkan ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      headers: getHeaders(null), // Sertakan token
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menambahkan produk baru dengan gambar
export const addProduct = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mengupdate produk dan mengganti gambar
export const updateProduct = async (id, formData) => {
  try {
    const headers = getHeaders(formData);

    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menghapus produk
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: getHeaders(null), // Sertakan token
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
