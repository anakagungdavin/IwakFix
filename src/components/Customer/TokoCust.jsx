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
        limit: 20,
        sortBy:
          sort === "terlaris"
            ? "sales"
            : sort === "terbaru"
            ? "createdAt"
            : null,
        sortOrder: sort === "harga-rendah" ? "asc" : "desc",
        search: search,
      };
      if (sort === "harga-rendah" || sort === "harga-tinggi") {
        delete params.sortBy;
        delete params.sortOrder;
      }
      const response = await axios.get(`${API_URL}/api/products`, { params });
      const { products: fetchedProducts, pagination } = response.data;

      let transformedProducts = fetchedProducts.map((product) => {
        if (!product.stocks || product.stocks.length === 0) {
          return {
            ...product,
            originalPrice: 0,
            discountedPrice: 0,
            discount: 0,
            satuan: "kg",
          };
        }

        const groupedByJenis = product.stocks.reduce((acc, stock) => {
          const jenis = stock.jenis || "Unknown";
          const discountedPrice =
            stock.price - (stock.price * (stock.discount || 0)) / 100;

          if (!acc[jenis] || discountedPrice < acc[jenis].discountedPrice) {
            acc[jenis] = {
              originalPrice: stock.price,
              discountedPrice: discountedPrice,
              discount: stock.discount || 0,
              satuan: stock.satuan || "kg",
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
            lowest.discountedPrice <= current.discountedPrice
              ? lowest
              : current,
          jenisEntries[0]
        );

        return {
          ...product,
          originalPrice: lowestPriceJenisEntry.originalPrice,
          discountedPrice: lowestPriceJenisEntry.discountedPrice,
          discount: lowestPriceJenisEntry.discount,
          satuan: lowestPriceJenisEntry.satuan,
        };
      });

      if (sort === "harga-rendah") {
        transformedProducts.sort(
          (a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0)
        );
      } else if (sort === "harga-tinggi") {
        transformedProducts.sort(
          (a, b) => (b.discountedPrice || 0) - (a.discountedPrice || 0)
        );
      }

      console.log("Transformed Products:", transformedProducts);
      setProducts(transformedProducts);
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
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-fish.png";
  };

  // Helper function untuk format harga
  const formatPrice = (price) => {
    if (typeof price !== "number") return "0";
    return price.toLocaleString("id-ID"); // Menggunakan locale Indonesia
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
            {products.map((product) => {
              const discountPercentage = calculateDiscount(
                product.originalPrice,
                product.discountedPrice
              );

              return (
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
                      {discountPercentage > 0 && (
                        <>
                          <p className="text-xs sm:text-sm text-gray-400 line-through">
                            Rp{formatPrice(product.originalPrice)}{" "}
                            {/* <-- PERUBAHAN DI SINI */}
                          </p>
                          <span className="text-red-500 text-xs sm:text-sm">
                            -{discountPercentage}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-[#003D47]">
                      Rp{formatPrice(product.discountedPrice)}/
                      {product.satuan || "kg"}
                    </p>
                  </div>
                </div>
              );
            })}
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
