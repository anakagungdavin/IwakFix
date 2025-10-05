import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("Deskripsi");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Ambil ID dari URL

  // Ambil data produk dari API berdasarkan ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Gagal mengambil detail produk");
        console.error(
          "Fetch product error:",
          err.response ? err.response.data : err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="p-6 pl-0 pr-4 max-w-5xl mx-auto">
      {/* Loading/Error State */}
      {loading && (
        <p className="text-center text-gray-900 dark:text-white">
          Memuat detail produk...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      )}

      {/* Konten Produk */}
      {!loading && !error && product && (
        <>
          <div className="flex border-gray-300 dark:border-gray-600 mb-4">
            <h3
              className={`text-lg font-bold pb-2 mr-4 cursor-pointer ${
                activeTab === "Deskripsi"
                  ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              onClick={() => setActiveTab("Deskripsi")}
            >
              Deskripsi
            </h3>
            <h3
              className={`text-lg font-bold pb-2 cursor-pointer ${
                activeTab === "Spesifikasi"
                  ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              onClick={() => setActiveTab("Spesifikasi")}
            >
              Spesifikasi
            </h3>
          </div>

          {activeTab === "Deskripsi" ? (
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
              {product.description ||
                "Deskripsi tidak tersedia untuk produk ini."}
            </p>
          ) : (
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Spesifikasi
              </h4>
              <ul className="text-gray-800 dark:text-gray-200">
                <li>
                  <span className="font-semibold">Berat:</span>{" "}
                  {product.weight ? `${product.weight}kg` : "Tidak tersedia"}
                </li>
                <li>
                  <span className="font-semibold">Tinggi:</span>{" "}
                  {product.dimensions?.height
                    ? `${product.dimensions.height} cm`
                    : "Tidak tersedia"}
                </li>
                <li>
                  <span className="font-semibold">Panjang:</span>{" "}
                  {product.dimensions?.length
                    ? `${product.dimensions.length} cm`
                    : "Tidak tersedia"}
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
