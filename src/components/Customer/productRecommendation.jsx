import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ProductRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function untuk format harga
  const formatPrice = (price) => {
    if (typeof price !== "number") return "0";
    return price.toLocaleString("id-ID"); // Menggunakan locale Indonesia
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            limit: 3, // Ambil 3 produk terlaris atau sesuai kebutuhan
            sortBy: "sales",
            sortOrder: "desc",
          },
        });
        // console.log("API Response Products:", response.data.products);

        let transformedProducts = response.data.products.map((product) => {
          // 1. Handle jika tidak ada stocks atau stocks kosong
          if (!product.stocks || product.stocks.length === 0) {
            return {
              ...product,
              originalPrice: 0,
              discountedPrice: 0,
              discount: 0,
              satuan: "kg", // Default satuan jika tidak ada stock
            };
          }

          // 2. Group stocks by jenis, find lowest discounted price, and get satuan
          const groupedByJenis = product.stocks.reduce((acc, stock) => {
            const jenis = stock.jenis || "Unknown"; // Default jenis jika tidak ada
            const discountedPrice =
              stock.price - (stock.price * (stock.discount || 0)) / 100;

            if (!acc[jenis] || discountedPrice < acc[jenis].discountedPrice) {
              acc[jenis] = {
                originalPrice: stock.price,
                discountedPrice: discountedPrice,
                discount: stock.discount || 0,
                satuan: stock.satuan || "kg", // Ambil satuan dari stock, fallback ke "kg"
              };
            }
            return acc;
          }, {});

          // 3. Handle jika setelah grouping tidak ada jenis yang valid
          const jenisEntries = Object.values(groupedByJenis);
          if (jenisEntries.length === 0) {
            // Ini seharusnya tidak terjadi jika product.stocks tidak kosong,
            // tapi sebagai pengaman
            return {
              ...product,
              originalPrice: 0,
              discountedPrice: 0,
              discount: 0,
              satuan: "kg",
            };
          }

          // 4. Find the jenis entry with the lowest discounted price
          const lowestPriceJenisEntry = jenisEntries.reduce(
            (lowest, current) =>
              lowest.discountedPrice <= current.discountedPrice
                ? lowest
                : current,
            jenisEntries[0] // Inisialisasi dengan entri pertama
          );

          // 5. Return produk yang sudah ditransformasi dengan satuan yang benar
          return {
            ...product,
            originalPrice: lowestPriceJenisEntry.originalPrice,
            discountedPrice: lowestPriceJenisEntry.discountedPrice,
            discount: lowestPriceJenisEntry.discount,
            satuan: lowestPriceJenisEntry.satuan, // Gunakan satuan dari entri termurah
          };
        });
        // console.log("Transformed Recommendations:", transformedProducts);
        setRecommendations(transformedProducts);
      } catch (err) {
        setError("Gagal mengambil rekomendasi produk");
        console.error(
          "Fetch recommendations error:",
          err.response ? err.response.data : err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleShowMore = () => {
    navigate("/shop");
    window.scrollTo(0, 0);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice || originalPrice === 0) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-fish.png";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-blue-600 text-sm text-center mb-1">
        Temukan bibit ikanmu.
      </h3>
      <h3 className="text-2xl font-bold text-center mb-6">
        Bibit Ikan Terfavorit
      </h3>

      {loading && <p className="text-center">Memuat rekomendasi...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && recommendations.length > 0 && (
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6">
          {recommendations.map((item) => {
            const discountPercentage = calculateDiscount(
              item.originalPrice,
              item.discountedPrice
            );
            return (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-64 md:w-72 cursor-pointer flex flex-col justify-between"
                onClick={() => handleNavigate(item._id)}
              >
                <div>
                  <div className="relative w-full h-40 sm:h-48 mb-3 rounded overflow-hidden">
                    <img
                      src={item.images?.[0] || "/default-fish.png"}
                      alt={item.name}
                      className="w-full h-full object-cover" // Ganti object-contain ke object-cover untuk mengisi area
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-bold text-center text-lg truncate mb-1">
                    {item.name}
                  </h4>
                </div>
                <div className="text-center mt-auto">
                  <div className="flex justify-center items-baseline gap-2 min-h-[20px]">
                    {" "}
                    {/* Beri tinggi minimum */}
                    {discountPercentage > 0 && item.originalPrice > 0 && (
                      <>
                        <p className="text-gray-500 line-through text-sm">
                          Rp{formatPrice(item.originalPrice)}
                        </p>
                        <span className="text-red-500 text-xs bg-red-100 px-1 rounded">
                          {discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[#003D47] font-bold text-lg">
                    Rp{formatPrice(item.discountedPrice)}/{item.satuan || "kg"}{" "}
                    {/* Menggunakan item.satuan dengan fallback ke 'kg' */}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-center text-gray-600">
          Belum ada rekomendasi produk saat ini.
        </p>
      )}

      <div className="text-center mt-8">
        <button
          className="border border-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
          onClick={handleShowMore}
        >
          Lihat Semua Produk
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;
