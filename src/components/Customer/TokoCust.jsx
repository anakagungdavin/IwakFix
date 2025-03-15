import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FishStore = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("terlaris");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Ambil data produk dari API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        sortBy:
          sortBy === "terlaris"
            ? "sales"
            : sortBy === "terbaru"
            ? "createdAt"
            : "price",
        sortOrder: sortBy === "harga-rendah" ? "asc" : "desc",
      };
      const response = await axios.get(`${API_URL}/api/products`, { params }); // Perbaiki URL
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
    fetchProducts();
  }, [sortBy, page]);

  const calculateDiscount = (originalPrice, discountedPrice) => {
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded ${
                sortBy === "terlaris" && "bg-[#003D47] text-white"
              }`}
              onClick={() => setSortBy("terlaris")}
            >
              Terlaris
            </button>
            <button
              className={`px-4 py-2 rounded ${
                sortBy === "terbaru" && "bg-[#003D47] text-white"
              }`}
              onClick={() => setSortBy("terbaru")}
            >
              Terbaru
            </button>
            <select
              className={`border rounded px-3 py-2 ${
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
          <span className="text-gray-600">
            Menampilkan {products.length} hasil
          </span>
        </div>

        {/* Loading/Error State */}
        {loading && <p className="text-center">Memuat produk...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Grid Produk 5 Kolom */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow h-[250px] flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images?.[0] || "/default-fish.png"}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="flex justify-center items-center gap-2">
                    <p className="text-sm text-gray-400 line-through">
                      Rp{product.originalPrice.toLocaleString()}
                    </p>
                    <span className="text-red-500 text-sm">
                      -
                      {calculateDiscount(
                        product.originalPrice,
                        product.discountedPrice
                      )}
                      %
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[#003D47]">
                    Rp{product.discountedPrice.toLocaleString()}/kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-4 py-2 rounded ${
                  page === num ? "bg-[#003D47] text-white" : "bg-gray-200"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="bg-gray-300 px-4 py-2 rounded"
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
