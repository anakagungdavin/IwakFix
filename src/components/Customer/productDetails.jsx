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

  // Default sizes jika API tidak mengembalikan data ukuran
  const defaultSizes = [
    { label: "XL", value: "3 Inchi" },
    { label: "L", value: "2.5 Inchi" },
    { label: "M", value: "2 Inchi" },
    { label: "S", value: "1.5 Inchi" },
  ];

  // Mapping sizes dari API (type.size)
  const sizes = product?.type?.size?.length
    ? product.type.size.map((size, index) => ({
        label: ["S", "M", "L", "XL"][index] || `Size ${index + 1}`,
        value: size,
      }))
    : defaultSizes;

  return (
    <div className="p-6 pl-0 pr-4 max-w-5xl mx-auto">
      {/* Loading/Error State */}
      {loading && <p className="text-center">Memuat detail produk...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Konten Produk */}
      {!loading && !error && product && (
        <>
          <div className="flex border-gray-300 mb-4">
            <h3
              className={`text-lg font-bold pb-2 mr-4 cursor-pointer ${
                activeTab === "Deskripsi"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Deskripsi")}
            >
              Deskripsi
            </h3>
            <h3
              className={`text-lg font-bold pb-2 cursor-pointer ${
                activeTab === "Spesifikasi"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Spesifikasi")}
            >
              Spesifikasi
            </h3>
          </div>

          {activeTab === "Deskripsi" ? (
            <p className="text-gray-800 leading-relaxed mb-4">
              {product.description ||
                "Deskripsi tidak tersedia untuk produk ini."}
            </p>
          ) : (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Spesifikasi Ukuran:
              </h4>
              <ul className="text-gray-800">
                {sizes.map((size) => (
                  <li key={size.label}>
                    <span className="font-semibold">{size.label}:</span>{" "}
                    {size.value}
                  </li>
                ))}
              </ul>
              <h4 className="text-lg font-bold text-gray-900 mt-4 mb-2">
                SKU:
              </h4>
              <p className="text-gray-800">{product.sku || "Tidak tersedia"}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
