import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL = "https://iwak.onrender.com/api";

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
// export const deleteProduct = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/products/${id}`, {
//       headers: getHeaders(null), // Sertakan token
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
export const deleteProduct = async (id) => {
  try {
    const url = `https://iwak.onrender.com/api/products/${id}`; // Use the full backend URL
    console.log("Deleting product with URL:", url); // Log the URL

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Response status:", response.status); // Log the status
    const responseText = await response.text();
    console.log("Response text:", responseText); // Log the raw response text

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
};