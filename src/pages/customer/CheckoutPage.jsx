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
  const productData = location.state?.product || null;
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

  const log = process.env.NODE_ENV === "development" ? console.log : () => {};

  // Mengatur item keranjang berdasarkan data yang diterima
  useEffect(() => {
    let items = [];
    if (productData) {
      log("Product Data diterima:", productData);
      items = [productData];
    } else if (cartData) {
      log("Cart Data diterima:", cartData);
      items = cartData;
    } else {
      const storedCart = localStorage.getItem("checkoutCart");
      if (storedCart) {
        items = JSON.parse(storedCart);
      }
    }
    setCartItems(items);
    localStorage.setItem("checkoutCart", JSON.stringify(items));
    log("Cart items set:", items);
  }, [productData, cartData]);

  // Mengambil alamat dari API
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
        log("User Data:", userData);
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
        log("Error fetching address:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [navigate]);

  // Fungsi untuk mendapatkan detail harga berdasarkan item
  const getPriceDetails = (item) => {
    log("Getting price details for item:", item);
    if (item.price && typeof item.price === "number") {
      // Untuk productData (pembelian langsung)
      return {
        price: item.price || 0,
        discount: item.discount || 0,
      };
    } else if (item.product?.stocks && item.size && item.jenis) {
      // Untuk cartData (dari keranjang)
      const sanitizedSize = item.size?.trim().toLowerCase() || "";
      const sanitizedJenis = item.jenis?.trim().toLowerCase() || "";
      const stockEntry = item.product.stocks.find(
        (stock) =>
          stock.size?.trim().toLowerCase() === sanitizedSize &&
          stock.jenis?.trim().toLowerCase() === sanitizedJenis
      );
      if (stockEntry) {
        return {
          price: stockEntry.price || 0,
          discount: stockEntry.discount || 0,
        };
      }
    }
    log("No valid price details found for item:", item);
    return { price: 0, discount: 0 };
  };

  // Menghitung total harga
  const { totalPriceBeforeDiscount, totalDiscount, finalTotal } =
    cartItems.reduce(
      (acc, item) => {
        const { price, discount } = getPriceDetails(item);
        const quantity = item.quantity || 1;
        const discountedPrice = price * (1 - discount / 100);
        acc.totalPriceBeforeDiscount += price * quantity;
        acc.totalDiscount += ((price * discount) / 100) * quantity;
        acc.finalTotal += discountedPrice * quantity + 25000; // Ongkir
        return acc;
      },
      { totalPriceBeforeDiscount: 0, totalDiscount: 0, finalTotal: 0 }
    );

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    const storedCart = localStorage.getItem("checkoutCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    log("Selected File:", file);
    if (file) {
      setProofPayment(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }
    if (!paymentMethod) {
      setError("Silakan pilih metode pembayaran.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Keranjang kosong. Silakan tambahkan produk.");
      return;
    }
    if (paymentMethod !== "cod" && !proofPayment) {
      setError("Silakan unggah bukti pembayaran.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Silakan login terlebih dahulu!");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      // Kirim shippingAddress sebagai objek JSON
      formData.append(
        "shippingAddress",
        JSON.stringify({
          recipientName: selectedAddress.recipientName || "",
          phoneNumber: selectedAddress.phoneNumber || "",
          streetAddress: selectedAddress.streetAddress || "",
          city: selectedAddress.city || "",
          province: selectedAddress.province || "",
          postalCode: selectedAddress.postalCode || "",
        })
      );

      formData.append("paymentMethod", paymentMethod);
      if (paymentMethod !== "cod" && proofPayment) {
        formData.append("proofOfPayment", proofPayment);
      }

      const orderItems = cartItems.map((item) => {
        const { price, discount } = getPriceDetails(item);
        return {
          product: item.product?._id || item._id,
          quantity: item.quantity || 1,
          price: price || 0,
          discount: discount || 0,
          discountedPrice: price * (1 - discount / 100),
          size: item.size || "default",
          jenis: item.jenis || "default",
          color: item.color || "default",
        };
      });

      if (orderItems.length === 0) {
        throw new Error("Tidak ada item valid untuk dipesan.");
      }

      formData.append("items", JSON.stringify(orderItems));
      formData.append("totalAmount", finalTotal);
      formData.append("shippingCost", 25000);

      log("Mengirim FormData:", [...formData.entries()]);

      const response = await axios.post(`${API_URL}/api/orders`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      log("Order creation response:", response.data);

      localStorage.removeItem("checkoutCart");
      setCartItems([]);

      setSuccessMessage(
        "Pembayaran berhasil diproses! Menunggu verifikasi oleh admin. \nBeralih ke Dashboard dalam 5 detik..."
      );

      setTimeout(() => {
        navigate("/customer-dashboard", { state: { cartCleared: true } });
        window.scrollTo(0, 0);
      }, 5000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal memproses pembayaran. Silakan coba lagi.";
      setError(errorMessage);
      log("Payment error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderCust />
      <div className="max-w-6xl mx-auto px-6 py-10">
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
              {showAddressModal && (
                <ChangeAddress
                  onClose={() => setShowAddressModal(false)}
                  onSelectAddress={handleSelectAddress}
                />
              )}
              <button
                className="mt-2 text-blue-600"
                onClick={() => setShowAddressModal(true)}
              >
                Ganti Alamat
              </button>
            </div>

            <div className="bg-white p-4 mt-6 rounded-lg shadow-lg">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => {
                  const { price, discount } = getPriceDetails(item);
                  const discountedPrice = price * (1 - discount / 100);
                  log("Rendering item:", item);
                  return (
                    <div
                      key={`${item.product?._id || item._id}-${
                        item.size
                      }-${index}`}
                      className="flex items-center border-b pb-4 mb-4"
                    >
                      <img
                        src={item.image || item.product?.images?.[0]}
                        alt={item.product?.name || item.name || "Produk"}
                        className="w-20 h-20 mr-4 object-cover"
                        onError={(e) =>
                          (e.target.src = "/path/to/default-image.png")
                        } // Ganti dengan path gambar default
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold">
                          {item.product?.name ||
                            item.name ||
                            "Nama Produk Tidak Tersedia"}
                        </h4>
                        <p className="text-gray-500">
                          {item.product?.description ||
                            item.description ||
                            "Deskripsi Tidak Tersedia"}
                        </p>
                        <p className="font-semibold">
                          Rp{(discountedPrice || 0).toLocaleString()}
                          {discount > 0 && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              Rp{(price || 0).toLocaleString()}
                            </span>
                          )}
                        </p>
                        <p className="mt-2 font-bold">
                          Jenis:{" "}
                          <span className="font-normal">
                            {item.jenis || "Tidak Tersedia"}
                          </span>
                        </p>
                        <p className="font-bold">
                          Ukuran:{" "}
                          <span className="font-normal">
                            {item.size || "Tidak Tersedia"}
                          </span>
                        </p>
                        <p className="font-bold">
                          Jumlah:{" "}
                          <span className="font-normal">
                            {item.quantity || "Tidak Tersedia"}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">Keranjang kosong.</p>
              )}
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
                <div>
                  <h3 className="font-bold text-lg mb-2">Metode Pembayaran</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="bank_jateng">Bank Jateng</option>
                    <option value="cod">COD</option>
                    <option value="qris">QRIS</option>
                  </select>

                  {paymentMethod === "bank_jateng" && (
                    <p className="mt-3 text-blue-600 font-semibold">
                      Nomor Rekening Bank Jateng: 123-456-7890 a/n IWAK Store
                    </p>
                  )}

                  {paymentMethod === "qris" && (
                    <div className="mt-3">
                      <p className="text-blue-600 font-semibold">
                        Silakan scan QRIS:
                      </p>
                      <img
                        src="/assets/qris-example.png"
                        alt="QRIS Code"
                        className="w-48 mt-2"
                      />
                    </div>
                  )}
                </div>

                {/* Hanya tampilkan "Unggah Bukti Pembayaran" jika metode bukan COD */}
                {paymentMethod !== "cod" && (
                  <div>
                    <h3 className="font-bold">Unggah Bukti Pembayaran</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded-md mt-2"
                    />

                    {proofPreview && (
                      <div className="mt-4">
                        <h4 className="font-semibold">
                          Preview Bukti Pembayaran:
                        </h4>
                        <img
                          src={proofPreview}
                          alt="Bukti Pembayaran"
                          className="w-48 h-auto mt-2 border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h3 className="font-bold mt-4">Ringkasan</h3>
              <p className="flex justify-between">
                <span>Items ({cartItems.length})</span>
                <span>Rp{totalPriceBeforeDiscount.toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-red-500">
                Discounts: <span>-Rp{totalDiscount.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                Ongkir: <span>Rp 25.000</span>
              </p>
              <p className="font-bold text-lg mt-2 flex justify-between">
                Total: <span>Rp{finalTotal.toLocaleString()}</span>
              </p>
              <button
                className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-lg ${
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
          </>
        )}
      </div>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;
