import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import axios from "axios";
import defaultImage from "../../images/image1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const log = process.env.NODE_ENV === "development" ? console.log : () => {};

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Silakan login terlebih dahulu!");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        log("Cart data:", JSON.stringify(response.data, null, 2));
        setCartItems(response.data.items || []);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Gagal mengambil data keranjang";
        setError(errorMsg);
        log("Fetch cart error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    // Periksa apakah kembali dari checkout dan keranjang sudah dibersihkan
    if (location.state?.cartCleared) {
      setCartItems([]); // Kosongkan state jika cartCleared true
      log("Cart cleared due to cartCleared state:", location.state);
    } else {
      fetchCart();
    }
  }, [navigate, location]);

  const getPriceDetails = (product, jenis, size) => {
    if (!product?.stocks || product.stocks.length === 0) {
      log("No stocks available for product:", product?._id || "unknown");
      return {
        price: 0,
        discount: 0,
        stock: 0,
        image: product?.images?.[0] || defaultImage,
      };
    }

    const sanitizedJenis = jenis?.trim().toLowerCase() || "";
    const sanitizedSize = size?.trim().toLowerCase() || "";
    const stockEntry = product.stocks.find(
      (stock) =>
        stock.jenis?.trim().toLowerCase() === sanitizedJenis &&
        stock.size?.trim().toLowerCase() === sanitizedSize
    );

    if (!stockEntry) {
      log(
        `No stock found for jenis: ${sanitizedJenis}, size: ${sanitizedSize}`
      );
      return {
        price: 0,
        discount: 0,
        stock: 0,
        image: product?.images?.[0] || defaultImage,
      };
    }

    return {
      price: stockEntry.price || 0,
      discount: stockEntry.discount || 0,
      stock: stockEntry.stock || 0,
      image: stockEntry.image || product?.images?.[0] || defaultImage,
    };
  };

  const handleQuantityChange = async (index, change) => {
    const item = cartItems[index];
    const { stock } = getPriceDetails(item.product, item.jenis, item.size);
    const newQuantity = Math.max(1, Math.min(item.quantity + change, stock));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/cart`,
        {
          productId: item.product._id,
          quantity: newQuantity,
          jenis: item.jenis,
          size: item.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item
        )
      );
      log("Quantity updated:", response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal memperbarui kuantitas";
      setError(errorMsg);
      log("Update quantity error:", err.response?.data || err);
    }
  };

  const handleDelete = async (index) => {
    const item = cartItems[index];
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/cart/${item.product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            jenis: item.jenis,
            size: item.size,
          },
        }
      );
      setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
      log("Item deleted:", response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal menghapus item";
      setError(errorMsg);
      log("Delete item error:", err.response?.data || err);
    }
  };

  const handleJenisChange = async (index, newJenis) => {
    const item = cartItems[index];
    const { stock } = getPriceDetails(item.product, newJenis, item.size);
    if (stock === 0) {
      setError(`Stok untuk jenis ${newJenis} tidak tersedia`);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cart/${item.product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          jenis: item.jenis,
          size: item.size,
        },
      });
      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: item.product._id,
          quantity: Math.min(item.quantity, stock),
          jenis: newJenis,
          size: item.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((prevItem, i) =>
          i === index
            ? {
                ...prevItem,
                jenis: newJenis,
                ...getPriceDetails(item.product, newJenis, item.size),
              }
            : prevItem
        )
      );
      log("Jenis updated:", response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal memperbarui jenis";
      setError(errorMsg);
      log("Update jenis error:", err.response?.data || err);
    }
  };

  const handleSizeChange = async (index, newSize) => {
    const item = cartItems[index];
    const { stock } = getPriceDetails(item.product, item.jenis, newSize);
    if (stock === 0) {
      setError(`Stok untuk ukuran ${newSize} tidak tersedia`);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cart/${item.product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          jenis: item.jenis,
          size: item.size,
        },
      });
      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: item.product._id,
          quantity: Math.min(item.quantity, stock),
          jenis: item.jenis,
          size: newSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((prevItem, i) =>
          i === index
            ? {
                ...prevItem,
                size: newSize,
                ...getPriceDetails(item.product, item.jenis, newSize),
              }
            : prevItem
        )
      );
      log("Size updated:", response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal memperbarui ukuran";
      setError(errorMsg);
      log("Update size error:", err.response?.data || err);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout", { state: { cart: cartItems } });
  };

  const { totalPriceBeforeDiscount, totalDiscount, finalTotal } =
    cartItems.reduce(
      (acc, item) => {
        const { price, discount } = getPriceDetails(
          item.product,
          item.jenis,
          item.size
        );
        const quantity = item.quantity || 1;
        const discountedPrice = price * (1 - discount / 100);
        acc.totalPriceBeforeDiscount += price * quantity;
        acc.totalDiscount += ((price * discount) / 100) * quantity;
        acc.finalTotal += discountedPrice * quantity;
        return acc;
      },
      { totalPriceBeforeDiscount: 0, totalDiscount: 0, finalTotal: 0 }
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-6">
          Keranjang
        </h2>
        {loading && <p className="text-center">Memuat keranjang...</p>}
        {error && (
          <p className="text-center text-red-500 py-4 bg-red-100 rounded-lg">
            {error}
          </p>
        )}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
              {cartItems.map((item, index) => {
                const { price, discount, image } = getPriceDetails(
                  item.product,
                  item.jenis,
                  item.size
                );
                const discountedPrice = price * (1 - discount / 100);
                return (
                  <div
                    key={`${item.product._id}-${item.jenis}-${item.size}`}
                    className="flex flex-col sm:flex-row items-center border-b py-4 last:border-b-0"
                  >
                    <img
                      src={image}
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md mb-3 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="text-lg font-semibold">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {item.product.description || "Deskripsi produk"}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        Rp{discountedPrice.toLocaleString()}
                        {discount > 0 && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            Rp{price.toLocaleString()}
                          </span>
                        )}
                      </p>
                      <div className="flex justify-center sm:justify-start items-center mt-2 space-x-3">
                        <select
                          value={item.jenis || ""}
                          onChange={(e) =>
                            handleJenisChange(index, e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          {(
                            item.product.type?.jenis || ["Salmon Norwegia"]
                          ).map((jenis) => (
                            <option key={jenis} value={jenis}>
                              {jenis}
                            </option>
                          ))}
                        </select>
                        <select
                          value={item.size || ""}
                          onChange={(e) =>
                            handleSizeChange(index, e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          {(
                            item.product.type?.size || [
                              "Slice 200gr",
                              "Slice 400gr",
                            ]
                          ).map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-2 py-1 text-sm"
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-sm"
                            onClick={() => handleQuantityChange(index, 1)}
                            disabled={
                              item.quantity >=
                              getPriceDetails(
                                item.product,
                                item.jenis,
                                item.size
                              ).stock
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        className="text-red-500 hover:text-red-700 mt-3 sm:mt-0"
                        onClick={() => handleDelete(index)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Ringkasan
              </h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items ({cartItems.length})</span>
                <span>Rp{totalPriceBeforeDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Discounts</span>
                <span className="text-red-500">
                  -Rp{totalDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>Rp{finalTotal.toLocaleString()}</span>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proses Pembayaran ({cartItems.length})
              </button>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center text-center bg-white rounded-md mt-20 p-6">
              <img
                src="src/images/20943865.jpg"
                alt="Keranjang Kosong"
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover"
              />
              <p className="text-lg font-bold mt-4">Keranjang kamu kosong!</p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Daripada dianggurin, isi saja dengan ikan - ikan menarik.
                <br />
                Lihat-lihat dulu, siapa tahu ada yang kamu butuhkan!
              </p>
              <button
                className="mt-6 bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                onClick={() => navigate("/shop")}
              >
                Mulai Belanja
              </button>
            </div>
          )
        )}
      </div>
      <FooterCust />
    </div>
  );
};

export default CartPage;
