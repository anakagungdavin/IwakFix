import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Komponen Placeholder untuk animasi loading (bisa ditaruh di file terpisah jika sering digunakan)
const ProductCardSkeleton = () => (
  <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow animate-pulse">
    <div className="w-full aspect-square overflow-hidden rounded bg-gray-300 mb-2"></div>
    <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>{" "}
    {/* Sesuaikan tinggi */}
    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-1"></div>{" "}
    {/* Sesuaikan tinggi */}
    <div className="h-5 bg-gray-300 rounded w-1/3 mx-auto"></div>{" "}
    {/* Sesuaikan tinggi */}
  </div>
);

const FishStore = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("terlaris");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Set loading true di awal
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async (search = "", sort = sortBy, pg = page) => {
    setLoading(true);
    setError(null);
    // Jika bukan halaman pertama, jangan reset produk agar tidak ada kedipan
    // if (pg === 1) {
    //   setProducts([]);
    // }
    try {
      const params = {
        page: pg,
        limit: 20, // Jumlah produk per halaman
        sortBy:
          sort === "terlaris"
            ? "sales"
            : sort === "terbaru"
            ? "createdAt"
            : null,
        sortOrder: sort === "harga-rendah" ? "asc" : "desc",
        search: search,
      };
      // Khusus untuk sorting harga, API mungkin tidak butuh sortBy dan sortOrder
      if (sort === "harga-rendah" || sort === "harga-tinggi") {
        delete params.sortBy; // Hapus sortBy jika backend menangani sort harga secara khusus
        // params.sortBy = "price"; // Atau set sortBy ke 'price' jika backend mendukung
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

      // Sorting harga di frontend jika API tidak melakukannya
      if (sort === "harga-rendah") {
        transformedProducts.sort(
          (a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0)
        );
      } else if (sort === "harga-tinggi") {
        transformedProducts.sort(
          (a, b) => (b.discountedPrice || 0) - (a.discountedPrice || 0)
        );
      }

      // console.log("Transformed Products:", transformedProducts);
      setProducts(transformedProducts); // Langsung set produk baru
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      setError(`Gagal mengambil data produk: ${err.message}`);
      console.error(
        "Fetch products error:",
        err.response ? err.response.data : err
      );
      setProducts([]); // Kosongkan produk jika error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    // Reset page ke 1 jika search atau sortBy berubah
    if (
      location.state?.prevSearch !== search ||
      location.state?.prevSortBy !== sortBy
    ) {
      setPage(1); // Kembali ke halaman 1
      fetchProducts(search, sortBy, 1);
    } else {
      fetchProducts(search, sortBy, page);
    }
    // Simpan state search dan sortBy untuk perbandingan berikutnya
    navigate(location.pathname + location.search, {
      replace: true,
      state: { ...location.state, prevSearch: search, prevSortBy: sortBy },
    });
  }, [location.search, sortBy, page]); // Tambahkan navigate ke dependency jika diperlukan, tapi hati-hati loop

  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice || originalPrice === 0) return 0; // Tambah cek originalPrice === 0
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-fish.png";
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "0"; // Tambah cek isNaN
    return price.toLocaleString("id-ID");
  };

  const handleSortChange = (newSortBy) => {
    // setPage(1); // Selalu kembali ke halaman 1 saat sort berubah
    setSortBy(newSortBy);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll ke atas saat ganti halaman
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <button
              className={`px-2 sm:px-4 py-2 text-sm sm:text-base rounded ${
                sortBy === "terlaris"
                  ? "bg-[#003D47] text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
              onClick={() => handleSortChange("terlaris")}
            >
              Terlaris
            </button>
            <button
              className={`px-2 sm:px-4 py-2 text-sm sm:text-base rounded ${
                sortBy === "terbaru"
                  ? "bg-[#003D47] text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
              onClick={() => handleSortChange("terbaru")}
            >
              Terbaru
            </button>
            <select
              className={`border rounded px-2 sm:px-3 py-2 text-sm sm:text-base cursor-pointer ${
                sortBy === "harga-rendah" || sortBy === "harga-tinggi"
                  ? "bg-[#003D47] text-white"
                  : "bg-white text-black"
              }`}
              value={sortBy} // Pastikan value sesuai dengan opsi yang ada atau default
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {/* Default value untuk select bisa berbeda, "paling-sesuai" mungkin tidak ada di logic sortBy Anda */}
              <option value="terlaris">Paling Sesuai</option>
              <option value="harga-rendah">Harga Termurah</option>
              <option value="harga-tinggi">Harga Termahal</option>
            </select>
          </div>
          {!loading && !error && (
            <span className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-0">
              Menampilkan {products.length} hasil
              {location.search &&
                ` untuk "${new URLSearchParams(location.search).get(
                  "search"
                )}"`}
            </span>
          )}
        </div>

        {/* Tampilan Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 py-5">
            {[...Array(10)].map(
              (
                _,
                index // Tampilkan 10 skeleton, atau sesuai limit Anda
              ) => (
                <ProductCardSkeleton key={index} />
              )
            )}
          </div>
        )}

        {/* Tampilan Error */}
        {!loading && error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* Tampilan Produk */}
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
                  className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
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
                  <div className="text-center mt-2 flex-grow flex flex-col justify-end">
                    {" "}
                    {/* Penyesuaian untuk tata letak teks */}
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate mb-0.5">
                      {product.name}
                    </h3>
                    <div className="flex justify-center items-center gap-1 sm:gap-2 min-h-[1.2em]">
                      {" "}
                      {/* Min height untuk discount */}
                      {discountPercentage > 0 &&
                        product.originalPrice > 0 && ( // Tambah cek originalPrice
                          <>
                            <p className="text-xs sm:text-sm text-gray-400 line-through">
                              Rp{formatPrice(product.originalPrice)}
                            </p>
                            <span className="text-red-500 text-xs sm:text-sm bg-red-100 px-1 rounded">
                              {discountPercentage}%
                            </span>
                          </>
                        )}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-[#003D47] mt-0.5">
                      Rp{formatPrice(product.discountedPrice)}/
                      {product.satuan || "kg"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pesan Jika Tidak Ada Produk */}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-600 py-10">
            Tidak ada produk ditemukan.
          </p>
        )}

        {/* Paginasi */}
        {!loading && !error && products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2 mt-6 sm:mt-8">
            <button
              className="bg-gray-300 hover:bg-gray-400 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            {/* Logika untuk menampilkan beberapa nomor halaman */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Sederhanakan: tampilkan semua atau logika yang lebih kompleks untuk "..."
              return (
                <button
                  key={pageNum}
                  className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded ${
                    page === pageNum
                      ? "bg-[#003D47] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="bg-gray-300 hover:bg-gray-400 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
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
