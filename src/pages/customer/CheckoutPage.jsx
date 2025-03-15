import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import ChangeAddress from "../../components/Customer/ChangeAddress";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state || null;
  const cartData = location.state?.cart || null;
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [proofPayment, setProofPayment] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

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

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected File:", file); // Tambahkan log ini
    if (file) {
      setProofPayment(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

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

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }
    if (!proofPayment) {
      setError("Silakan unggah bukti pembayaran.");
      return;
    }
    if (!paymentMethod) {
      setError("Silakan pilih metode pembayaran.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append(
        "shippingAddress",
        `${selectedAddress.recipientName}, ${selectedAddress.phoneNumber}, ${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`
      );
      formData.append("paymentMethod", paymentMethod);
      formData.append("proofOfPayment", proofPayment);

      if (productData && !cartData) {
        const orderItems = [
          {
            product: productData.product._id,
            quantity: productData.quantity,
            price: productData.product.price,
            discount: productData.product.discount || 0,
            discountedPrice: productData.price,
            size: productData.size,
            color: productData.color,
          },
        ];
        formData.append("items", JSON.stringify(orderItems));
        formData.append("totalAmount", finalTotal);
      }

      // Debugging: Log FormData entries
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await axios.post(`${API_URL}/api/orders`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage(
        "Pembayaran berhasil diproses! Menunggu verifikasi oleh admin. \nBeralih ke Dashboard dalam 5 detik..."
      );
      localStorage.removeItem("checkoutCart");

      setTimeout(() => {
        navigate("/customer-dashboard");
        window.scrollTo(0, 0);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses pembayaran");
      console.error("Payment error:", err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderCust />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pembayaran</h2>

        {loading && (
          <div className="text-center py-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
            <p className="mt-2 text-gray-600">Memuat...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}

        {!loading && !successMessage && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4">Alamat Pengiriman</h3>
              {selectedAddress ? (
                <div className="text-gray-700">
                  <p className="font-semibold">
                    {selectedAddress.recipientName}
                  </p>
                  <p className="text-sm">{selectedAddress.phoneNumber}</p>
                  <p className="text-sm">
                    {`${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Tidak ada alamat tersedia.
                </p>
              )}
              <button
                className="mt-4 text-blue-600 hover:underline"
                onClick={() => setShowAddressModal(true)}
              >
                Ganti Alamat
              </button>
              {showAddressModal && (
                <ChangeAddress
                  onClose={() => setShowAddressModal(false)}
                  onSelectAddress={handleSelectAddress}
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4">Item Pesanan</h3>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b py-4 last:border-b-0"
                  >
                    <img
                      src={item.product?.images?.[0] || item.image}
                      alt={item.product?.name || item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800">
                        {item.product?.name || item.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {item.product?.description || item.description}
                      </p>
                      <p className="font-semibold text-blue-600">
                        Rp
                        {(
                          (item.product?.price || item.price || 0) *
                          (1 - (item.product?.discount || 0) / 100)
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Warna:</span>{" "}
                        {item.color}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Ukuran:</span>{" "}
                        {item.size}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Jumlah:</span>{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Keranjang kosong.</p>
              )}
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Metode Pembayaran</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BCA">BCA</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                  {paymentMethod === "Mandiri" && (
                    <p className="mt-3 text-blue-600 font-semibold text-sm">
                      Nomor Rekening Mandiri: 123-456-7890 a/n IWAK Store
                    </p>
                  )}
                  {paymentMethod === "BCA" && (
                    <p className="mt-3 text-blue-600 font-semibold text-sm">
                      Nomor Rekening BCA: 098-765-4321 a/n IWAK Store
                    </p>
                  )}
                  {paymentMethod === "QRIS" && (
                    <div className="mt-3">
                      <p className="text-blue-600 font-semibold text-sm">
                        Silakan scan QRIS:
                      </p>
                      <img
                        src="/assets/qris-example.png"
                        alt="QRIS Code"
                        className="w-48 mt-2 rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">
                    Unggah Bukti Pembayaran
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {proofPreview && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm text-gray-700">
                        Preview Bukti Pembayaran:
                      </h4>
                      <img
                        src={proofPreview}
                        alt="Bukti Pembayaran"
                        className="w-48 h-auto mt-2 border rounded-md shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg shadow-inner">
                <h3 className="font-bold text-lg mb-4">Ringkasan Pembayaran</h3>
                <div className="space-y-2">
                  <p className="flex justify-between text-gray-700">
                    <span>Items ({cartItems.length}):</span>
                    <span>Rp{totalPriceBeforeDiscount.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-red-500">
                    <span>Diskon:</span>
                    <span>-Rp{totalDiscount.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total:</span>
                    <span>Rp{finalTotal.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${
                  loading || cartItems.length === 0 || !selectedAddress
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
                onClick={handlePayment}
                disabled={cartItems.length === 0 || !selectedAddress || loading}
              >
                {loading
                  ? "Memproses..."
                  : `Bayar Sekarang (${cartItems.length})`}
              </button>
            </div>
          </div>
        )}
      </main>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;
