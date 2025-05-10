import React, { useState, useEffect } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defaultImage from "../../images/image1.png";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ProductOverview = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        const fetchedProduct = response.data;
        console.log(
          "Full product data:",
          JSON.stringify(fetchedProduct, null, 2)
        );
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images?.[0] || defaultImage);

        // Sanitize jenis and size arrays before setting defaults
        const sanitizedJenis =
          fetchedProduct.type?.jenis?.map((item) => item.trim()) || [];
        const sanitizedSizes =
          fetchedProduct.type?.size?.map((item) => item.trim()) || [];

        if (sanitizedJenis.length > 0) {
          setSelectedJenis(sanitizedJenis[0]);
        } else {
          console.warn(
            "No jenis available in product.type:",
            fetchedProduct.type
          );
        }
        if (sanitizedSizes.length > 0) {
          setSelectedSize(sanitizedSizes[0]);
        } else {
          console.warn(
            "No size available in product.type:",
            fetchedProduct.type
          );
        }
      } catch (err) {
        setError("Gagal mengambil detail produk");
        console.error(
          "Fetch product error:",
          err.response ? err.response.data : err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fungsi untuk mendapatkan harga dan diskon berdasarkan jenis dan ukuran
  const getPriceForCombination = (jenis, size) => {
    console.log("Mencari harga untuk:", { jenis, size }); // Log input values
    console.log("Stocks available:", product?.stocks);

    if (!product?.stocks || product.stocks.length === 0) {
      console.log("Stocks tidak ada atau kosong:", product?.stocks);
      return { price: 0, discount: 0, stock: 0 };
    }

    const sanitizedJenis = jenis?.trim().toLowerCase() || "";
    const sanitizedSize = size?.trim().toLowerCase() || "";

    const stockEntry = product.stocks.find((stock) => {
      const stockJenis = stock.jenis?.trim().toLowerCase() || "";
      const stockSize = stock.size?.trim().toLowerCase() || "";
      console.log("Comparing:", {
        stockJenis,
        stockSize,
        searchJenis: sanitizedJenis,
        searchSize: sanitizedSize,
      });
      return stockJenis === sanitizedJenis && stockSize === sanitizedSize;
    });

    console.log("Hasil pencarian stockEntry:", stockEntry);

    if (!stockEntry) {
      console.warn(
        `No stock found for jenis: ${sanitizedJenis}, size: ${sanitizedSize}`
      );
      return { price: 0, discount: 0, stock: 0 };
    }

    return {
      price: stockEntry.price || 0,
      discount: stockEntry.discount || 0,
      stock: stockEntry.stock || 0,
    };
  };

  // Harga dan diskon berdasarkan kombinasi yang dipilih
  const { price, discount, stock } =
    selectedJenis && selectedSize
      ? getPriceForCombination(selectedJenis, selectedSize)
      : { price: 0, discount: 0, stock: 0 };

  const discountedPrice = price * (1 - discount / 100);

  const handleBuyNow = async () => {
    if (!selectedJenis || !selectedSize) {
      alert("Pilih jenis dan ukuran terlebih dahulu!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
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
        alert("Kombinasi jenis dan ukuran tidak ditemukan!");
        return;
      }

      if (quantity > selectedStock.stock) {
        alert("Jumlah melebihi stok yang tersedia!");
        return;
      }

      const buyNowData = {
        product: {
          _id: id,
          name: product.name,
          price: selectedStock.price,
          discount: selectedStock.discount || 0,
          description: product.description,
          images: product.images,
        },
        jenis: selectedJenis,
        size: selectedSize,
        quantity,
        image: product.images?.[0] || defaultImage,
        price: selectedStock.price * (1 - (selectedStock.discount || 0) / 100),
      };

      navigate("/checkout", { state: buyNowData });
    } catch (err) {
      alert(
        "Gagal memproses pembelian: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Buy now error:", err.response ? err.response.data : err);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedJenis || !selectedSize) {
      alert("Pilih jenis dan ukuran terlebih dahulu!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu!");
        navigate("/login");
        return;
      }

      const selectedStock = product.stocks.find(
        (stock) =>
          stock.jenis?.trim().toLowerCase() ===
            selectedJenis?.trim().toLowerCase() &&
          stock.size?.trim().toLowerCase() ===
            selectedSize?.trim().toLowerCase()
      );

      if (!selectedStock) {
        alert("Kombinasi jenis dan ukuran tidak ditemukan!");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: id,
          quantity: quantity,
          jenis: selectedJenis,
          size: selectedSize,
          price: selectedStock.price,
          discount: selectedStock.discount || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produk berhasil ditambahkan ke keranjang!");
      console.log("Cart updated:", response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan produk ke keranjang";
      alert(errorMessage);
      console.error(
        "Add to cart error:",
        err.response ? err.response.data : err
      );
    }
  };

  const availableJenis = (product?.type?.jenis || ["Default Jenis"]).map(
    (item) => item.trim()
  );
  const availableSizes = (product?.type?.size || ["S", "M", "L", "XL"]).map(
    (item) => item.trim()
  );

  return (
    <div className="max-w-6xl mx-auto px-16">
      {loading && <p className="text-center">Memuat detail produk...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

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
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>

            <div className="w-1/2 pl-6">
              <h2 className="text-2xl font-bold text-black">{product.name}</h2>
              <div className="flex items-center gap-2">
                {discount > 0 && selectedJenis && selectedSize ? (
                  <>
                    <p className="text-sm text-red-500">{discount}%</p>
                    <p className="text-sm text-gray-500 line-through">
                      Rp{price.toLocaleString()}
                    </p>
                  </>
                ) : null}
              </div>
              <p className="text-2xl text-[#003D47] font-bold">
                {selectedJenis && selectedSize
                  ? price === 0
                    ? "Harga tidak tersedia"
                    : `Rp${discountedPrice.toLocaleString()}`
                  : "Pilih jenis dan ukuran untuk melihat harga"}
              </p>

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
                      onClick={() => setSelectedJenis(jenis)}
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
                      onClick={() => setSelectedSize(size)}
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
                  <span>{quantity}</span>
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => setQuantity((prev) => prev + 1)}
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
                >
                  Beli
                </button>
                <button
                  className="bg-[#003D47] text-white px-6 py-2 rounded-lg w-full"
                  onClick={handleAddToCart}
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
