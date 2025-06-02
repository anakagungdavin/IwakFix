import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Sesuaikan dengan URL API Anda

// Komponen Placeholder untuk animasi loading
const ProductCardSkeleton = () => (
  <div className="bg-white p-4 rounded-2xl shadow-lg w-full animate-pulse">
    <div className="relative w-full h-36 sm:h-40 md:h-48 mb-3 rounded overflow-hidden bg-gray-300"></div>
    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-1"></div>
    <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
  </div>
);

const ProductRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function untuk format harga
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "0";
    return price.toLocaleString("id-ID"); // Menggunakan locale Indonesia
  };

  // Helper function untuk transformasi produk (harga, satuan)
  const transformProductData = (product) => {
    if (!product) return null; // Handle jika produk null

    if (!product.stocks || product.stocks.length === 0) {
      return {
        ...product,
        originalPrice: 0,
        discountedPrice: 0,
        discount: 0,
        satuan: "kg", // Default satuan jika tidak ada stock
      };
    }

    // Group stocks by jenis, find lowest discounted price, and get satuan
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

    const jenisEntries = Object.values(groupedByJenis);
    if (jenisEntries.length === 0) {
      return {
        ...product,
        originalPrice: 0,
        discountedPrice: 0,
        discount: 0,
        satuan: "kg",
      };
    }

    const lowestPriceJenisEntry = jenisEntries.reduce(
      (lowest, current) =>
        lowest.discountedPrice <= current.discountedPrice ? lowest : current,
      jenisEntries[0] // Inisialisasi dengan entri pertama
    );

    return {
      ...product,
      originalPrice: lowestPriceJenisEntry.originalPrice,
      discountedPrice: lowestPriceJenisEntry.discountedPrice,
      discount: lowestPriceJenisEntry.discount,
      satuan: lowestPriceJenisEntry.satuan, // Gunakan satuan dari entri termurah
    };
  };

  useEffect(() => {
    const fetchOrderedRecommendations = async () => {
      setLoading(true);
      setError(null);

      // Urutan prioritas yang diinginkan: Lele, Nila, Mas, Gurame
      // PERHATIKAN URUTAN INI JIKA ANDA INGIN MENGUBAHNYA
      const fishOrderPriority = [
        { id: "lele", searchKeywords: ["lele"] },
        { id: "nila", searchKeywords: ["nila"] },
        { id: "mas", searchKeywords: ["mas", "ikan mas"] },
        { id: "gurame", searchKeywords: ["gurameh", "gurami"] },
      ];

      const orderedResults = new Array(4).fill(null); // Array untuk 4 produk, diisi null awalnya
      const fetchedProductIds = new Set(); // Untuk melacak ID produk yang sudah diambil

      // Fungsi untuk fetch produk terlaris berdasarkan keyword
      const fetchTopProductByKeywords = async (keywords) => {
        for (const term of keywords) {
          try {
            const response = await axios.get(`${API_URL}/api/products`, {
              params: {
                search: term,
                sortBy: "sales",
                sortOrder: "desc",
                limit: 1,
              },
            });
            if (response.data.products && response.data.products.length > 0) {
              return response.data.products[0]; // Return produk jika ditemukan
            }
          } catch (err) {
            console.warn(
              `Error fetching product for keyword "${term}":`,
              err.message
            );
          }
        }
        return null;
      };

      try {
        // 1. Panggilan Paralel untuk Ikan Prioritas
        const priorityPromises = fishOrderPriority.map((fish) =>
          fetchTopProductByKeywords(fish.searchKeywords)
        );
        const priorityProductsResults = await Promise.all(priorityPromises);

        // Isi slot berdasarkan hasil panggilan paralel
        priorityProductsResults.forEach((product, index) => {
          if (product && !fetchedProductIds.has(product._id)) {
            orderedResults[index] = product;
            fetchedProductIds.add(product._id);
          }
        });

        // 2. Jika masih ada slot kosong, isi dengan produk terlaris umum (fallback)
        let currentProductCount = orderedResults.filter(
          (p) => p !== null
        ).length;
        if (currentProductCount < 4) {
          const neededForFallback = 4 - currentProductCount;
          if (neededForFallback > 0) {
            const generalResponse = await axios.get(`${API_URL}/api/products`, {
              params: {
                limit: neededForFallback + fetchedProductIds.size + 10,
                sortBy: "sales",
                sortOrder: "desc",
              },
            });

            const generalProducts = generalResponse.data.products;
            let generalProductIndex = 0;

            for (let i = 0; i < orderedResults.length; i++) {
              if (orderedResults[i] === null) {
                while (generalProductIndex < generalProducts.length) {
                  const fallbackProduct = generalProducts[generalProductIndex];
                  generalProductIndex++;
                  if (
                    fallbackProduct &&
                    !fetchedProductIds.has(fallbackProduct._id)
                  ) {
                    orderedResults[i] = fallbackProduct;
                    fetchedProductIds.add(fallbackProduct._id);
                    break;
                  }
                }
              }
              if (orderedResults.filter((p) => p !== null).length >= 4) break;
            }
          }
        }

        // 3. Transformasi produk yang berhasil dikumpulkan
        const finalProducts = orderedResults
          .filter((p) => p !== null)
          .map(transformProductData)
          .filter((p) => p !== null);

        setRecommendations(finalProducts);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Gagal memuat rekomendasi produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderedRecommendations();
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
    if (!originalPrice || originalPrice === 0 || !discountedPrice) return 0;
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
      {/* <h3 className="text-blue-600 text-sm text-center mb-1">
        Temukan bibit ikanmu.
      </h3> */}
      <h3 className="text-2xl font-bold text-center mb-6">
        Bibit Ikan Terfavorit
      </h3>

      {/* Tampilan Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-10">
          {/* Buat 4 skeleton card */}
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Tampilan Error */}
      {!loading && error && (
        <p className="text-center text-red-500 py-10">{error}</p>
      )}

      {/* Tampilan Rekomendasi Produk */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((item) => {
            if (!item || !item._id) return null;

            const discountPercentage = calculateDiscount(
              item.originalPrice,
              item.discountedPrice
            );
            return (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full cursor-pointer flex flex-col justify-between"
                onClick={() => handleNavigate(item._id)}
              >
                <div>
                  <div className="relative w-full h-36 sm:h-40 md:h-48 mb-3 rounded overflow-hidden">
                    <img
                      src={item.images?.[0] || "/default-fish.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-bold text-center text-base md:text-lg truncate mb-1">
                    {item.name}
                  </h4>
                </div>
                <div className="text-center mt-auto">
                  <div className="flex justify-center items-baseline gap-2 min-h-[20px]">
                    {discountPercentage > 0 && item.originalPrice > 0 && (
                      <>
                        <p className="text-gray-500 line-through text-xs sm:text-sm">
                          Rp{formatPrice(item.originalPrice)}
                        </p>
                        <span className="text-red-500 text-xs bg-red-100 px-1 rounded">
                          {discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[#003D47] font-bold text-sm sm:text-base md:text-lg">
                    Rp{formatPrice(item.discountedPrice)}/{item.satuan || "kg"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pesan jika tidak ada rekomendasi */}
      {!loading && !error && recommendations.length === 0 && (
        <p className="text-center text-gray-600 py-10">
          Belum ada rekomendasi produk yang dapat ditampilkan saat ini.
        </p>
      )}

      <div className="text-center mt-8">
        <button
          className="border border-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 cursor-pointer" // Tambahkan cursor-pointer di sini
          onClick={handleShowMore}
        >
          Lihat Semua Produk
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;
