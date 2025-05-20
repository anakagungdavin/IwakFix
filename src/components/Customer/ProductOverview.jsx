import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import defaultImage from "/images/image1.png";
import "./ProductOverview.css";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ProductOverview = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        setSelectedImage(fetchedProduct.images?.[0] || defaultImage);

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
      return { stock: 0, price: 0, discount: 0 };
    }

    const sanitizedJenis = jenis?.trim().toLowerCase();
    const sanitizedSize = size?.trim().toLowerCase();

    if (!sanitizedJenis || !sanitizedSize) {
      log("Invalid jenis or size:", { sanitizedJenis, sanitizedSize });
      return { stock: 0, price: 0, discount: 0 };
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
      return { stock: 0, price: 0, discount: 0 };
    }

    return {
      stock: stockEntry.stock || 0,
      price: stockEntry.price || 0,
      discount: stockEntry.discount || 0,
    };
  };

  const stockDetails = useMemo(() => {
    if (selectedJenis && selectedSize) {
      return getStockDetailsForCombination(selectedJenis, selectedSize);
    }
    return { stock: 0, price: 0, discount: 0 };
  }, [selectedJenis, selectedSize, product?.stocks]);

  const { stock, price: originalPrice, discount } = stockDetails;
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

      // Struktur data yang dikirim harus sesuai dengan ekspektasi CheckoutPage.jsx
      const buyNowData = {
        product: {
          _id: id,
          name: productData.name,
          description: productData.description,
          images: productData.images,
          stocks: productData.stocks, // Sertakan stocks untuk kalkulasi harga
        },
        jenis: selectedJenis,
        size: selectedSize,
        quantity: quantity,
        price: selectedStock.price, // Harga asli dari stock
        discount: selectedStock.discount || 0, // Diskon dari stock
        discountedPrice:
          selectedStock.price * (1 - (selectedStock.discount || 0) / 100), // Harga setelah diskon
        image: productData.images?.[0] || defaultImage, // Gambar utama
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Silakan login terlebih dahulu!");
        navigate("/login");
        log("No token found");
        return;
      }

      const selectedStock = product.stocks.find(
        (stock) =>
          stock.jenis?.trim().toLowerCase() ===
            selectedJenis.trim().toLowerCase() &&
          stock.size?.trim().toLowerCase() === selectedSize.trim().toLowerCase()
      );

      if (!selectedStock) {
        setError("Kombinasi jenis dan ukuran tidak ditemukan!");
        log("No stock entry found for:", { selectedJenis, selectedSize });
        return;
      }

      if (quantity > selectedStock.stock) {
        setError("Jumlah melebihi stok yang tersedia!");
        log("Quantity exceeds stock:", {
          quantity,
          stock: selectedStock.stock,
        });
        return;
      }

      const payload = {
        productId: id,
        quantity: parseInt(quantity),
        jenis: selectedJenis.trim(),
        size: selectedSize.trim(),
      };
      log("Cart payload:", payload);

      const response = await axios.post(`${API_URL}/api/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setError(null);
      alert("Produk berhasil ditambahkan ke keranjang!");
      log("Cart updated:", response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan produk ke keranjang";
      setError(errorMsg);
      log("Add to cart error:", err.response?.data || err);
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
      {loading && <p className="text-center">Memuat detail produk...</p>}
      {error && (
        <p className="text-center text-red-500 py-4 bg-red-100 rounded-lg">
          {error}
        </p>
      )}
      {!loading && !error && product && (
        <>
          <div className="pt-8">
            <Breadcrumb pageName={product.name} />
          </div>
          <div className="flex pb-10 gap-6 border-b justify-center">
            <div className="w-1/2">
              <img
                src={selectedImage}
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
                        ? "border-gray-500"
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
              <h2 className="text-2xl font-bold text-black">{product.name}</h2>
              <div className="mt-4">
                {selectedJenis && selectedSize ? (
                  <div className="flex items-center gap-2">
                    {discount > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-[#003D47]">
                          Rp{discountedPrice.toLocaleString()}/kg
                        </p>
                        <p className="text-base text-gray-400 line-through">
                          Rp{originalPrice.toLocaleString()}/kg
                        </p>
                        <span className="text-red-500 text-base">
                          -{discount}%
                        </span>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-[#003D47]">
                        Rp{originalPrice.toLocaleString()}/kg
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-gray-600">
                    Pilih jenis dan ukuran untuk melihat harga
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label className="block font-semibold">Jenis</label>
                <div className="flex gap-2 mt-2">
                  {availableJenis.map((jenis) => (
                    <button
                      key={jenis}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedJenis === jenis
                          ? "bg-[#FFBC00] text-white"
                          : "bg-gray-100"
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
                <label className="block font-semibold">Ukuran</label>
                <div className="flex gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === size
                          ? "bg-[#FFBC00] text-white"
                          : "bg-gray-100"
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
              <div className="mt-4 p-4 border rounded-lg w-fit">
                <span className="block font-semibold mb-2">Atur Jumlah</span>
                <div className="flex items-center gap-4">
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="quantity-input w-16 text-center border rounded py-1 text-base"
                    min="1"
                    max={stock}
                  />
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() =>
                      setQuantity((prev) => Math.min(stock, prev + 1))
                    }
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-600">
                    Stok Tersedia:{" "}
                    <b>
                      {selectedJenis && selectedSize
                        ? stock
                        : "Pilih jenis dan ukuran"}
                    </b>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-grow gap-4 w-[325px]">
                <button
                  className="border-2 border-[#003D47] text-black px-6 py-2 rounded-lg w-full"
                  onClick={handleBuyNow}
                  disabled={!selectedJenis || !selectedSize}
                >
                  Beli
                </button>
                <button
                  className="bg-[#003D47] text-white px-6 py-2 rounded-lg w-full"
                  onClick={handleAddToCart}
                  disabled={!selectedJenis || !selectedSize}
                >
                  + Keranjang
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
