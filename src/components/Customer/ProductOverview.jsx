import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import defaultImage from "/images/image1.png";
import "./ProductOverview.css";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

// Simple SVG Spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ProductOverview = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // State untuk loading tombol keranjang
  const { id } = useParams();
  const navigate = useNavigate();

  const log = process.env.NODE_ENV === "development" ? console.log : () => {};

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        const fetchedProduct = response.data;
        log("Full product data:", JSON.stringify(fetchedProduct, null, 2));
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images?.[0] /*|| defaultImage*/);

        const availableJenis = [
          ...new Set(
            fetchedProduct.stocks
              ?.map((stock) => stock.jenis?.trim())
              .filter(Boolean)
          ),
        ];
        const availableSizes = [
          ...new Set(
            fetchedProduct.stocks
              ?.map((stock) => stock.size?.trim())
              .filter(Boolean)
          ),
        ];

        if (availableJenis.length === 0) {
          log("No jenis available:", fetchedProduct.stocks);
          setError("Tidak ada jenis produk tersedia.");
          setLoading(false);
          return;
        }
        if (availableSizes.length === 0) {
          log("No size available:", fetchedProduct.stocks);
          setError("Tidak ada ukuran produk tersedia.");
          setLoading(false);
          return;
        }

        setSelectedJenis(availableJenis[0]);
        setSelectedSize(availableSizes[0]);
        log("Initial selection:", {
          jenis: availableJenis[0],
          size: availableSizes[0],
        });
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Gagal mengambil detail produk";
        setError(errorMsg);
        log("Fetch product error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getStockDetailsForCombination = (jenis, size) => {
    log("Mencari detail stok untuk:", { jenis, size });
    log("Stocks available:", product?.stocks);

    if (!product?.stocks || product.stocks.length === 0) {
      log("Stocks tidak ada atau kosong:", product?.stocks);
      return { stock: 0, price: 0, discount: 0, satuan: "kg" };
    }

    const sanitizedJenis = jenis?.trim().toLowerCase();
    const sanitizedSize = size?.trim().toLowerCase();

    if (!sanitizedJenis || !sanitizedSize) {
      log("Invalid jenis or size:", { sanitizedJenis, sanitizedSize });
      return { stock: 0, price: 0, discount: 0, satuan: "kg" };
    }

    const stockEntry = product.stocks.find(
      (stock) =>
        stock.jenis?.trim().toLowerCase() === sanitizedJenis &&
        stock.size?.trim().toLowerCase() === sanitizedSize
    );

    log("Hasil pencarian stockEntry:", stockEntry);

    if (!stockEntry) {
      log(
        `No stock found for jenis: ${sanitizedJenis}, size: ${sanitizedSize}`
      );
      return { stock: 0, price: 0, discount: 0, satuan: "kg" };
    }

    return {
      stock: stockEntry.stock || 0,
      price: stockEntry.price || 0,
      discount: stockEntry.discount || 0,
      satuan: stockEntry.satuan || "kg",
    };
  };

  const stockDetails = useMemo(() => {
    if (selectedJenis && selectedSize) {
      return getStockDetailsForCombination(selectedJenis, selectedSize);
    }
    return { stock: 0, price: 0, discount: 0, satuan: "kg" };
  }, [selectedJenis, selectedSize, product?.stocks]);

  const { stock, price: originalPrice, discount, satuan } = stockDetails;
  const discountedPrice = originalPrice - (originalPrice * discount) / 100;

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1;
    if (numValue < 1) {
      setQuantity(1);
    } else if (numValue > stock) {
      setQuantity(stock);
    } else {
      setQuantity(numValue);
    }
  };

  const handleBuyNow = async () => {
    // ... (fungsi handleBuyNow tetap sama)
    if (!selectedJenis || !selectedSize) {
      setError("Pilih jenis dan ukuran terlebih dahulu!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }

    try {
      const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
      const productData = productResponse.data;
      const selectedStock = productData.stocks.find(
        (stock) =>
          stock.jenis?.trim().toLowerCase() ===
            selectedJenis?.trim().toLowerCase() &&
          stock.size?.trim().toLowerCase() ===
            selectedSize?.trim().toLowerCase()
      );

      if (!selectedStock) {
        setError("Kombinasi jenis dan ukuran tidak ditemukan!");
        return;
      }

      if (quantity > selectedStock.stock) {
        setError("Jumlah melebihi stok yang tersedia!");
        return;
      }

      const buyNowData = {
        product: {
          _id: id,
          name: productData.name,
          description: productData.description,
          images: productData.images,
          stocks: productData.stocks,
        },
        jenis: selectedJenis,
        size: selectedSize,
        quantity: quantity,
        price: selectedStock.price,
        discount: selectedStock.discount || 0,
        discountedPrice:
          selectedStock.price * (1 - (selectedStock.discount || 0) / 100),
        satuan: selectedStock.satuan || "kg",
        image: productData.images?.[0] /*|| defaultImage*/,
      };

      log("BuyNow Data:", buyNowData);
      navigate("/checkout", { state: { product: buyNowData } });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal memproses pembelian";
      setError(errorMsg);
      log("Buy now error:", err.response?.data || err);
    }
  };

  const handleAddToCart = async () => {
    log("handleAddToCart called with:", {
      selectedJenis,
      selectedSize,
      quantity,
    });

    if (!selectedJenis || !selectedSize) {
      setError("Pilih jenis dan ukuran terlebih dahulu!");
      log("Validation failed: jenis or size missing");
      return;
    }

    if (!selectedJenis.trim() || !selectedSize.trim()) {
      setError("Jenis atau ukuran tidak valid!");
      log("Validation failed: jenis or size is empty after trim");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Silakan login terlebih dahulu!");
      navigate("/login");
      log("No token found");
      return;
    }

    setIsAddingToCart(true); // Mulai loading
    setError(null); // Reset error sebelumnya

    try {
      const selectedStock = product.stocks.find(
        (stock) =>
          stock.jenis?.trim().toLowerCase() ===
            selectedJenis.trim().toLowerCase() &&
          stock.size?.trim().toLowerCase() === selectedSize.trim().toLowerCase()
      );

      if (!selectedStock) {
        setError("Kombinasi jenis dan ukuran tidak ditemukan!");
        log("No stock entry found for:", { selectedJenis, selectedSize });
        return; // Jangan lupa return di sini agar finally dijalankan setelah error state di set
      }

      if (quantity > selectedStock.stock) {
        setError("Jumlah melebihi stok yang tersedia!");
        log("Quantity exceeds stock:", {
          quantity,
          stock: selectedStock.stock,
        });
        return; // Jangan lupa return
      }

      const payload = {
        productId: id,
        quantity: parseInt(quantity),
        jenis: selectedJenis.trim(),
        size: selectedSize.trim(),
        satuan: selectedStock.satuan || "kg",
      };
      log("Cart payload:", payload);

      const response = await axios.post(`${API_URL}/api/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Produk berhasil ditambahkan ke keranjang!");
      log("Cart updated:", response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan produk ke keranjang";
      setError(errorMsg);
      log("Add to cart error:", err.response?.data || err);
    } finally {
      setIsAddingToCart(false); // Selesai loading, baik sukses maupun gagal
    }
  };

  const availableJenis = [
    ...new Set(
      product?.stocks?.map((stock) => stock.jenis?.trim()).filter(Boolean)
    ),
  ];
  const availableSizes = [
    ...new Set(
      product?.stocks?.map((stock) => stock.size?.trim()).filter(Boolean)
    ),
  ];

  return (
    <div className="max-w-6xl mx-auto px-16">
      {loading && (
        <p className="text-center text-gray-900 dark:text-white">
          Memuat detail produk...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400 py-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
          {error}
        </p>
      )}
      {!loading && !error && product && (
        <>
          <div className="pt-8">
            <Breadcrumb pageName={product.name} />
          </div>
          <div className="flex pb-10 gap-6 border-b border-gray-200 dark:border-gray-700 justify-center">
            <div className="w-1/2">
              <img
                src={selectedImage || "/images/placeholder.png"}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Thumbnail"
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === img
                        ? "border-gray-500 dark:border-gray-400"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedImage(img);
                      log("Image selected:", img);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="w-1/2 pl-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {product.name}
              </h2>
              <div className="mt-4">
                {selectedJenis && selectedSize ? (
                  <div className="flex items-center gap-2">
                    {discount > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-[#003D47] dark:text-[#FFBC00]">
                          Rp{discountedPrice.toLocaleString("id-ID")}/{satuan}
                        </p>
                        <p className="text-base text-gray-400 dark:text-gray-500 line-through">
                          Rp{originalPrice.toLocaleString("id-ID")}/{satuan}
                        </p>
                        <span className="text-red-500 dark:text-red-400 text-base">
                          -{discount}%
                        </span>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-[#003D47] dark:text-[#FFBC00]">
                        Rp{originalPrice.toLocaleString("id-ID")}/{satuan}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Pilih jenis dan ukuran untuk melihat harga
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label className="block font-semibold text-gray-900 dark:text-white">
                  Jenis
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableJenis.map((jenis) => (
                    <button
                      key={jenis}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedJenis === jenis
                          ? "bg-[#FFBC00] text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        setSelectedJenis(jenis);
                        log("Jenis selected:", jenis);
                      }}
                    >
                      {jenis}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-semibold text-gray-900 dark:text-white">
                  Ukuran
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === size
                          ? "bg-[#FFBC00] text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        setSelectedSize(size);
                        log("Size selected:", size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg w-fit bg-white dark:bg-gray-800">
                <span className="block font-semibold mb-2 text-gray-900 dark:text-white">
                  Atur Jumlah
                </span>
                <div className="flex items-center gap-4">
                  <button
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="quantity-input w-16 text-center border border-gray-300 dark:border-gray-600 rounded py-1 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max={stock}
                  />
                  <button
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() =>
                      setQuantity((prev) => Math.min(stock, prev + 1))
                    }
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-600 dark:text-gray-400">
                    Stok Tersedia:{" "}
                    <b className="text-gray-900 dark:text-white">
                      {selectedJenis && selectedSize
                        ? `${stock.toLocaleString("id-ID")} ${satuan}`
                        : "Pilih jenis dan ukuran"}
                    </b>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-grow gap-4 w-[325px]">
                <button
                  className="border-2 border-[#003D47] dark:border-[#FFBC00] text-black dark:text-white px-6 py-2 rounded-lg w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleBuyNow}
                  disabled={!selectedJenis || !selectedSize || isAddingToCart} // Disable saat loading juga
                >
                  Beli
                </button>
                <button
                  className={`bg-[#003D47] dark:bg-[#FFBC00] text-white dark:text-black px-6 py-2 rounded-lg w-full cursor-pointer flex items-center justify-center ${
                    isAddingToCart ? "opacity-70" : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={!selectedJenis || !selectedSize || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Spinner />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <span>+ Keranjang</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductOverview;
