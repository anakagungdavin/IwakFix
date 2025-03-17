// TokoCust.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const FishStore = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("terlaris");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async (search = "", sort = sortBy, pg = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pg,
        limit: 20, // Ubah dari 10 menjadi 20
        sortBy:
          sort === "terlaris"
            ? "sales"
            : sort === "terbaru"
            ? "createdAt"
            : "price",
        sortOrder: sort === "harga-rendah" ? "asc" : "desc",
        search: search,
      };
      const response = await axios.get(`${API_URL}/api/products`, { params });
      const { products: fetchedProducts, pagination } = response.data;

      setProducts(fetchedProducts);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      setError(`Gagal mengambil data produk: ${err.message}`);
      console.error(
        "Fetch products error:",
        err.response ? err.response.data : err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    fetchProducts(search, sortBy, page);
  }, [location.search, sortBy, page]);

  const calculateDiscount = (originalPrice, discountedPrice) => {
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-fish.png";
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <button
              className={`px-2 sm:px-4 py-2 text-sm sm:text-base rounded ${
                sortBy === "terlaris" && "bg-[#003D47] text-white"
              }`}
              onClick={() => setSortBy("terlaris")}
            >
              Terlaris
            </button>
            <button
              className={`px-2 sm:px-4 py-2 text-sm sm:text-base rounded ${
                sortBy === "terbaru" && "bg-[#003D47] text-white"
              }`}
              onClick={() => setSortBy("terbaru")}
            >
              Terbaru
            </button>
            <select
              className={`border rounded px-2 sm:px-3 py-2 text-sm sm:text-base ${
                sortBy === "harga-rendah" || sortBy === "harga-tinggi"
                  ? "bg-[#003D47] text-white"
                  : "bg-white text-black"
              }`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="paling-sesuai">Paling Sesuai</option>
              <option value="harga-rendah">Harga Termurah</option>
              <option value="harga-tinggi">Harga Termahal</option>
            </select>
          </div>
          <span className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-0">
            Menampilkan {products.length} hasil
            {location.search &&
              ` untuk "${new URLSearchParams(location.search).get("search")}"`}
          </span>
        </div>

        {loading && <p className="text-center">Memuat produk...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow flex flex-col justify-between cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="w-full aspect-square overflow-hidden rounded">
                  <img
                    src={product.images?.[0] || "/default-fish.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                    <p className="text-xs sm:text-sm text-gray-400 line-through">
                      Rp{product.originalPrice.toLocaleString()}
                    </p>
                    <span className="text-red-500 text-xs sm:text-sm">
                      -
                      {calculateDiscount(
                        product.originalPrice,
                        product.discountedPrice
                      )}
                      %
                    </span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#003D47]">
                    Rp{product.discountedPrice.toLocaleString()}/kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center">Tidak ada produk ditemukan</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center flex-wrap gap-1 sm:gap-2 mt-4 sm:mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded ${
                  page === num ? "bg-[#003D47] text-white" : "bg-gray-200"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="bg-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishStore;
