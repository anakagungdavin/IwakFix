import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

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
            limit: 3, // Ambil hanya 3 produk
            sortBy: "sales", // Urutkan berdasarkan sales
            sortOrder: "desc", // Dari yang terbesar ke terkecil
          },
        });
        setRecommendations(response.data.products);
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

  const calculateDiscount = (originalPrice, price) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
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
          {recommendations.map((item) => (
            <div
              key={item._id}
              className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl w-full sm:w-64 cursor-pointer mb-4 sm:mb-0"
              onClick={() => handleNavigate(item._id)}
            >
              <div className="relative">
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-full h-40 object-contain mx-auto"
                />
              </div>
              <h4 className="font-bold mt-2 text-center text-lg">
                {item.name}
              </h4>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <p className="text-gray-500 line-through text-sm mr-2">
                    Rp{item.originalPrice.toLocaleString()}
                  </p>
                  <span className="text-red-500 text-sm">
                    -
                    {calculateDiscount(
                      item.originalPrice,
                      item.discountedPrice
                    )}
                    %
                  </span>
                </div>
                <p className="text-black font-bold text-lg">
                  Rp{item.discountedPrice.toLocaleString()}/kg
                </p>
              </div>
            </div>
          ))}
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
