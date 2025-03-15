import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state || null;
  const cartData = location.state?.cart || null;
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengatur item keranjang berdasarkan data yang diterima
  useEffect(() => {
    if (productData && !cartData) {
      setCartItems([{ ...productData, quantity: productData.quantity || 1 }]);
    } else if (cartData) {
      setCartItems(cartData);
    }
  }, [productData, cartData]);

  // Mengambil alamat dari API saat komponen dimuat
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Silakan login terlebih dahulu!");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.data;
        const primaryAddress = userData.addresses.find(
          (addr) => addr.isPrimary
        );
        if (primaryAddress) {
          setSelectedAddress(primaryAddress);
        } else if (userData.addresses.length > 0) {
          setSelectedAddress(userData.addresses[0]);
        } else {
          setError("Tidak ada alamat tersedia. Silakan tambahkan alamat.");
        }
      } catch (err) {
        setError("Gagal mengambil alamat. Silakan coba lagi.");
        console.error("Error fetching address:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [navigate]);

  // Menghitung total harga
  const totalPriceBeforeDiscount = cartItems.reduce(
    (total, item) =>
      total + (item.product?.price || item.price || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total +
      (((item.product?.price || item.price || 0) *
        (item.product?.discount || 0)) /
        100) *
        (item.quantity || 1),
    0
  );

  const finalTotal = totalPriceBeforeDiscount - totalDiscount;

  // Fungsi untuk memproses pembayaran
  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const shippingAddressString = `${selectedAddress.recipientName}, ${selectedAddress.phoneNumber}, ${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`;

      const response = await axios.post(
        `${API_URL}/api/orders`,
        {
          shippingAddress: shippingAddressString,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pembayaran berhasil!");
      localStorage.removeItem("checkoutCart");
      navigate("/customer-dashboard");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses pembayaran");
      console.error("Payment error:", err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>
        {loading && <p className="text-center">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg">Alamat Pengiriman</h3>
              {selectedAddress ? (
                <>
                  <p className="text-gray-700 font-semibold">
                    {selectedAddress.recipientName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {selectedAddress.phoneNumber}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {`${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Tidak ada alamat tersedia.
                </p>
              )}
              <button className="mt-2 text-blue-600">Ganti Alamat</button>
            </div>

            <div className="bg-white p-4 mt-6 rounded-lg shadow-lg">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b pb-4 mb-4"
                  >
                    <img
                      src={item.product?.images?.[0] || item.image}
                      alt={item.product?.name || item.name}
                      className="w-20 h-20 mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold">
                        {item.product?.name || item.name}
                      </h4>
                      <p className="text-gray-500">
                        {item.product?.description || item.description}
                      </p>
                      <p className="font-semibold">
                        Rp
                        {(
                          (item.product?.price || item.price || 0) *
                          (1 - (item.product?.discount || 0) / 100)
                        ).toLocaleString()}
                      </p>
                      <p className="mt-2 font-bold">
                        Warna: <span className="font-normal">{item.color}</span>
                      </p>
                      <p className="font-bold">
                        Ukuran: <span className="font-normal">{item.size}</span>
                      </p>
                      <p className="font-bold">
                        Jumlah:{" "}
                        <span className="font-normal">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Keranjang kosong.</p>
              )}
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h3 className="font-bold mb-2">Metode Pembayaran</h3>
              <div className="flex flex-col space-y-2 border-b pb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="BCA Virtual Account"
                    checked={paymentMethod === "BCA Virtual Account"}
                    onChange={() => setPaymentMethod("BCA Virtual Account")}
                    className="mr-2"
                  />
                  BCA Virtual Account
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="QRIS"
                    checked={paymentMethod === "QRIS"}
                    onChange={() => setPaymentMethod("QRIS")}
                    className="mr-2"
                  />
                  QRIS
                </label>
              </div>
              <h3 className="font-bold mt-4">Ringkasan</h3>
              <p className="flex justify-between">
                Items ({cartItems.length}): Rp
                {totalPriceBeforeDiscount.toLocaleString()}
              </p>
              <p className="flex justify-between text-red-500">
                Discounts: <span>-Rp{totalDiscount.toLocaleString()}</span>
              </p>
              <p className="font-bold text-lg mt-2 flex justify-between">
                Total: <span>Rp{finalTotal.toLocaleString()}</span>
              </p>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
                onClick={handlePayment}
                disabled={cartItems.length === 0 || !selectedAddress || loading}
              >
                Bayar Sekarang ({cartItems.length})
              </button>
            </div>
          </>
        )}
      </div>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;
