import React, { useState, useEffect } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defaultImage from "../../images/image1.png";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ProductOverview = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
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
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images?.[0] || defaultImage);
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

  const discountedPrice = product
    ? product.price * (1 - (product.discount || 0) / 100)
    : 0;

  // const handleBuyNow = () => {
  //   console.log(
  //     "Selected Size:",
  //     selectedSize,
  //     "Selected Color:",
  //     selectedColor
  //   ); // Debug
  //   if (!selectedSize || !selectedColor) {
  //     alert("Pilih ukuran dan warna terlebih dahulu!");
  //     return;
  //   }
  //   navigate("/checkout", {
  //     state: {
  //       name: product.name,
  //       size: selectedSize,
  //       color: selectedColor,
  //       quantity,
  //       description: product.description,
  //       price: discountedPrice,
  //       image: product.images?.[0] || defaultImage,
  //     },
  //   });
  // };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Pilih ukuran dan warna terlebih dahulu!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }

    try {
      // Cek stok sebelum melanjutkan
      const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
      const productData = productResponse.data;
      if (quantity > productData.stock) {
        alert("Jumlah melebihi stok yang tersedia!");
        return;
      }
      // Data produk untuk dikirim ke CheckoutPage
      const buyNowData = {
        product: {
          _id: id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          description: product.description,
          images: product.images,
        },
        size: selectedSize,
        color: selectedColor,
        quantity,
        image: product.images?.[0] || defaultImage,
        price: discountedPrice,
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
    if (!selectedSize || !selectedColor) {
      alert("Pilih ukuran dan warna terlebih dahulu!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu!");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: id,
          quantity: quantity,
          size: selectedSize,
          color: selectedColor,
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

  // Fallback sizes dan colors jika data API kosong
  const availableSizes = product?.type?.size || ["S", "M", "L", "XL"];
  const availableColors = product?.type?.colors || [
    "Red",
    "Blue",
    "Green",
    "Black",
  ];

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
                {product.discount > 0 && (
                  <>
                    <p className="text-sm text-red-500">{product.discount}%</p>
                    <p className="text-sm text-gray-500 line-through">
                      Rp{product.price.toLocaleString()}
                    </p>
                  </>
                )}
              </div>
              <p className="text-2xl text-[#003D47] font-bold">
                Rp{discountedPrice.toLocaleString()}
              </p>
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
              <div className="mt-4">
                <label className="block font-semibold">Warna</label>
                <div className="flex gap-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedColor === color
                          ? "bg-[#FFBC00] text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
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
                    Stok Total: <b>{product.stock}</b>
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