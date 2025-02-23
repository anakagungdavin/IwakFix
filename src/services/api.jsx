import axios from "axios";

// const API_URL = "https://iwak.onrender.com/api";
const API_URL = "https://iwak-seven.vercel.app/api";

// Fungsi untuk mendapatkan daftar produk
export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Fungsi untuk mendapatkan detail produk berdasarkan ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menambahkan produk baru
export const addProduct = async (productData) => {
    try {
        // Ambil token dari localStorage atau dari state auth (sesuaikan dengan implementasi auth-mu)
        const token = localStorage.getItem("token"); // Pastikan token disimpan sebelumnya
        if (!token) {
            throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await axios.post(`${API_URL}/products`, productData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// Fungsi untuk mengupdate produk
// export const updateProduct = async (id, productData) => {
//     try {
//         const response = await axios.put(`${API_URL}/products/${id}`, productData, {
//             headers: { "Content-Type": "application/json" },
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`Error updating product with ID ${id}:`, error);
//         throw error;
//     }
// };
export const updateProduct = async (id, productData) => {
    try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
            throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await axios.put(`${API_URL}/products/${id}`, productData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Sertakan token dalam header
            },
        });

        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw error;
    }
};


// Fungsi untuk menghapus produk
export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_URL}/products/${id}`);
    } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
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
  