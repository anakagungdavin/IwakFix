import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import axios from "axios";
import defaultImage from "../../images/image1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data keranjang dari API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Silakan login terlebih dahulu!");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart data:", response.data);
        setCartItems(response.data.items || []);
      } catch (err) {
        setError("Gagal mengambil data keranjang");
        console.error(
          "Fetch cart error:",
          err.response ? err.response.data : err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Perbarui kuantitas
  const handleQuantityChange = async (index, change) => {
    const item = cartItems[index];
    const newQuantity = Math.max(1, item.quantity + change);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/cart`,
        {
          productId: item.product._id,
          quantity: newQuantity,
          size: item.size,
          color: item.color,
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
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui kuantitas");
      console.error("Update quantity error:", err);
    }
  };

  // Hapus item dari keranjang
  const handleDelete = async (index) => {
    const item = cartItems[index];
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/cart/${item.product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          size: item.size,
          color: item.color,
        },
      });
      setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus item");
      console.error("Delete item error:", err);
    }
  };

  // Ubah ukuran (state lokal, belum sinkron dengan API)
  const handleSizeChange = (index, newSize) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, size: newSize } : item
    );
    setCartItems(updatedCart);
    console.log("Changed size to:", newSize);
  };

  // Ubah warna (state lokal, belum sinkron dengan API)
  const handleColorChange = (index, newColor) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, color: newColor } : item
    );
    setCartItems(updatedCart);
    console.log("Changed color to:", newColor);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout", { state: { cart: cartItems } });
  };

  // Hitung harga total sebelum diskon (jumlah harga asli × kuantitas)
  const totalPriceBeforeDiscount = cartItems.reduce(
    (total, item) => total + (item.product.price || 0) * (item.quantity || 1),
    0
  );

  // Hitung total diskon (akumulasi diskon dari semua produk)
  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total +
      ((item.product.price * (item.product.discount || 0)) / 100) *
        (item.quantity || 1),
    0
  );

  // Hitung harga total setelah diskon
  const finalTotal = totalPriceBeforeDiscount - totalDiscount;

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-yellow-500 mb-6">Keranjang</h2>
        {loading && <p className="text-center">Memuat keranjang...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-b py-4 last:border-b-0 relative"
                >
                  <img
                    src={item.product.images?.[0] || defaultImage}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold">
                      {item.product.name}
                    </h4>
                    <p className="text-gray-500">
                      {item.product.description || "Deskripsi produk"}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      Rp
                      {(
                        item.product.price *
                        (1 - (item.product.discount || 0) / 100)
                      ).toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <select
                        value={item.size || ""}
                        onChange={(e) =>
                          handleSizeChange(index, e.target.value)
                        }
                        className="border rounded-md px-3 py-1"
                      >
                        {(item.product.type?.size || ["S", "M", "L", "XL"]).map(
                          (size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={item.color || ""}
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                        className="border rounded-md px-3 py-1"
                      >
                        {(
                          item.product.type?.colors || [
                            "Red",
                            "Blue",
                            "Green",
                            "Black",
                          ]
                        ).map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-3 py-1 text-lg"
                          onClick={() => handleQuantityChange(index, -1)}
                        >
                          -
                        </button>
                        <span className="px-5 text-lg">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-lg"
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center"
                      onClick={() => handleDelete(index)}
                    >
                      <FiTrash2 className="mr-1" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
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
            <div className="flex flex-col bg-white rounded-md items-center text-center mt-20 p-12">
              <img
                src="src/images/20943865.jpg"
                alt="Keranjang Kosong"
                className="w-64 h-64 object-cover"
              />
              <p className="text-lg font-bold mt-4">Keranjang kamu kosong!</p>
              <p className="text-gray-600 mt-2">
                Daripada dianggurin, isi saja dengan ikan - ikan menarik.
                <br />
                Lihat-lihat dulu, siapa tahu ada yang kamu butuhkan!
              </p>
              <button
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
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
