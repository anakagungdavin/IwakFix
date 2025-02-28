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
    handleError(error, "fetching products");
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
    handleError(error, `fetching product with ID ${id}`);
    throw error;
  }
};

// Fungsi untuk menambahkan produk baru dengan gambar
export const addProduct = async (productData, imageFiles) => {
  try {
<<<<<<< Updated upstream
    const formData = new FormData();

    // Tambahkan data produk ke FormData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Tambahkan semua file gambar ke FormData
    imageFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });

    const headers = getHeaders(formData);

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleError(error, "adding product with images");
=======
    // Debugging: Log semua isi FormData
    console.log("FormData entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Debugging: Cek token
    const token = localStorage.getItem("token");
    console.log("Token yang dikirim:", token);

    // Debugging: Cek tipe produk
    const colors = formData.getAll("type[color]");
    const sizes = formData.getAll("type[size]");

    console.log("Colors:", colors);
    console.log("Sizes:", sizes);

    if (!colors.length) {
      console.warn("Field 'type[color]' kosong atau tidak dikirim");
    }
    if (!sizes.length) {
      console.warn("Field 'type[size]' kosong atau tidak dikirim");
    }

    // API call
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Produk berhasil ditambahkan:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);

    // Log detail error dari backend
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

>>>>>>> Stashed changes
    throw error;
  }
};

// Fungsi untuk mengupdate produk dan mengganti gambar
export const updateProduct = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token yang dikirim:", token); // Debugging
    const headers = getHeaders(formData);

    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleError(error, "updating product with images");
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
    handleError(error, `deleting product with ID ${id}`);
    throw error;
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
