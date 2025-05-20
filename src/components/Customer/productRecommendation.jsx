import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ambil 3 produk terlaris dari API
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            limit: 3,
            sortBy: "sales",
            sortOrder: "desc",
          },
        });
        console.log("API Response:", response.data.products);

        // Transformasi produk untuk menemukan harga terendah per jenis, sama seperti TokoCust.jsx
        let transformedProducts = response.data.products.map((product) => {
          if (!product.stocks || product.stocks.length === 0) {
            return {
              ...product,
              originalPrice: 0,
              discountedPrice: 0,
              discount: 0,
            };
          }

          // Group stocks by jenis and find the lowest discounted price for each jenis
          const groupedByJenis = product.stocks.reduce((acc, stock) => {
            const jenis = stock.jenis || "Unknown";
            const discountedPrice =
              stock.price - (stock.price * (stock.discount || 0)) / 100;
            if (!acc[jenis] || discountedPrice < acc[jenis].discountedPrice) {
              acc[jenis] = {
                originalPrice: stock.price,
                discountedPrice: discountedPrice,
                discount: stock.discount || 0,
              };
            }
            return acc;
          }, {});

          // Find the jenis with the lowest discounted price
          const lowestPriceJenis = Object.values(groupedByJenis).reduce(
            (lowest, current) =>
              lowest.discountedPrice <= current.discountedPrice
                ? lowest
                : current,
            Object.values(groupedByJenis)[0]
          );

          return {
            ...product,
            originalPrice: lowestPriceJenis.originalPrice,
            discountedPrice: lowestPriceJenis.discountedPrice,
            discount: lowestPriceJenis.discount,
          };
        });

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
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-fish.png";
  };

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-blue-600 text-sm text-center mb-1">
        Temukan bibit ikanmu.
      </h3>
      <h3 className="text-lg font-bold text-center mb-4">
        Bibit Ikan Terfavorit
      </h3>

      {/* Loading/Error State */}
      {loading && <p className="text-center">Memuat rekomendasi...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Produk */}
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
                className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl w-full sm:w-64 cursor-pointer mb-4 sm:mb-0"
                onClick={() => handleNavigate(item._id)}
              >
                <div className="relative">
                  <img
                    src={item.images?.[0] || "/default-fish.png"}
                    alt={item.name}
                    className="w-full h-40 object-contain mx-auto"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <h4 className="font-bold mt-2 text-center text-lg">
                  {item.name}
                </h4>
                <div className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    {discountPercentage > 0 && (
                      <>
                        <p className="text-gray-500 line-through text-sm">
                          Rp{(item.originalPrice || 0).toLocaleString()}
                        </p>
                        <span className="text-red-500 text-sm">
                          -{discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[#003D47] font-bold text-lg">
                    Rp{(item.discountedPrice || 0).toLocaleString()}/kg
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show More */}
      <div className="text-center mt-4">
        <button
          className="border px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          onClick={handleShowMore}
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;
