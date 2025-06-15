import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import ChangeAddress from "../../components/Customer/ChangeAddress";
import axios from "axios";

// Pindahkan ke luar komponen agar tidak dibuat ulang setiap render
const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
const DEFAULT_SHIPPING_COST = 25000;

// Buat instance Axios untuk konsistensi
const apiClient = axios.create({
  baseURL: API_URL,
});

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil data dari state navigasi
  const productDataFromState = location.state?.product || null;
  const cartDataFromState = location.state?.cart || null;

  // State Management yang disederhanakan untuk COD
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Langsung diatur ke COD
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [shippingCost, setShippingCost] = useState(DEFAULT_SHIPPING_COST);

  // Ambil token di luar agar bisa jadi dependency
  const token = localStorage.getItem("token");

  // Gunakan useCallback untuk memastikan fungsi log stabil
  const log = useCallback((...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  }, []);

  // Effect untuk menginisialisasi item yang akan di-checkout
  useEffect(() => {
    let itemsToCheckout = [];
    if (productDataFromState) {
      itemsToCheckout = [productDataFromState];
    } else if (cartDataFromState && Array.isArray(cartDataFromState)) {
      itemsToCheckout = cartDataFromState;
    } else {
      try {
        const storedCheckoutItems = localStorage.getItem("checkoutItems");
        if (storedCheckoutItems) {
          itemsToCheckout = JSON.parse(storedCheckoutItems);
        }
      } catch (e) {
        itemsToCheckout = [];
      }
    }

    if (itemsToCheckout.length === 0) {
      setError("Tidak ada item untuk di-checkout. Silakan kembali ke toko.");
    }

    setCartItems(itemsToCheckout);
    if (itemsToCheckout.length > 0) {
      localStorage.setItem("checkoutItems", JSON.stringify(itemsToCheckout));
    }
  }, [productDataFromState, cartDataFromState, log]);

  // Effect untuk mengambil data profil dan alamat pengguna
  useEffect(() => {
    const fetchProfileAndAddress = async () => {
      if (!token) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await apiClient.get("/api/users/profile");

        const userData = response.data.data;
        const primaryAddress = userData.addresses.find(
          (addr) => addr.isPrimary
        );
        if (primaryAddress) {
          setSelectedAddress(primaryAddress);
        } else if (userData.addresses.length > 0) {
          setSelectedAddress(userData.addresses[0]);
        } else {
          setError(
            "Anda belum memiliki alamat. Silakan tambahkan alamat pengiriman."
          );
          setSelectedAddress(null);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Gagal mengambil data profil Anda.";
        setError(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAddress();
  }, [token, navigate, log]);

  // Effect untuk ongkos kirim
  useEffect(() => {
    setShippingCost(DEFAULT_SHIPPING_COST);
  }, []); // paymentMethod statis, jadi dependency bisa kosong

  const getPriceDetails = useCallback(
    (item) => {
      if (item.price && typeof item.price === "number" && item.satuan) {
        return {
          price: item.price,
          discount: item.discount || 0,
          satuan: item.satuan,
        };
      } else if (item.product?.stocks && item.size && item.jenis) {
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
            satuan: stockEntry.satuan || "kg",
          };
        }
      }
      return { price: 0, discount: 0, satuan: "kg" };
    },
    [log]
  );

  const { totalPriceBeforeDiscount, totalDiscount, finalTotal } =
    cartItems.reduce(
      (acc, item) => {
        const { price, discount } = getPriceDetails(item);
        const quantity = item.quantity || 1;
        const itemPrice = typeof price === "number" ? price : 0;
        const itemDiscount = typeof discount === "number" ? discount : 0;
        const originalItemTotal = itemPrice * quantity;
        const discountAmountForItem = (originalItemTotal * itemDiscount) / 100;
        const discountedItemTotal = originalItemTotal - discountAmountForItem;
        acc.totalPriceBeforeDiscount += originalItemTotal;
        acc.totalDiscount += discountAmountForItem;
        acc.finalTotal += discountedItemTotal;
        return acc;
      },
      { totalPriceBeforeDiscount: 0, totalDiscount: 0, finalTotal: 0 }
    );

  const grandTotal = finalTotal + shippingCost;

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Tidak ada item untuk di-checkout.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
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

      formData.append("paymentMethod", paymentMethod); // Akan selalu 'COD'
      formData.append("source", cartDataFromState ? "cart" : "buyNow");

      const orderItemsPayload = cartItems.map((item) => {
        const stockData = item.product?.stocks.find(
          (s) =>
            s.jenis?.trim().toLowerCase() ===
              item.jenis?.trim().toLowerCase() &&
            s.size?.trim().toLowerCase() === item.size?.trim().toLowerCase()
        );
        if (!stockData) {
          throw new Error(
            `Informasi stok untuk ${item.product.name} (${item.jenis} - ${item.size}) tidak ditemukan.`
          );
        }
        const price = stockData.price;
        const discount = stockData.discount || 0;
        return {
          product: item.product?._id || item._id,
          quantity: item.quantity || 1,
          price: price,
          discount: discount,
          discountedPrice: price * (1 - discount / 100),
          size: item.size || "N/A",
          jenis: item.jenis || "N/A",
          satuan: stockData.satuan,
        };
      });

      if (orderItemsPayload.length === 0) {
        throw new Error("Tidak ada item valid untuk dipesan.");
      }

      formData.append("items", JSON.stringify(orderItemsPayload));
      formData.append("totalAmount", grandTotal);
      formData.append("shippingCost", shippingCost);

      log("Mengirim FormData (COD):", Object.fromEntries(formData.entries()));

      await apiClient.post("/api/orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("checkoutItems");
      setCartItems([]);
      setSuccessMessage(
        "Pesanan Anda berhasil dibuat! Anda akan dihubungi oleh kurir untuk pengiriman. \nBeralih ke Dashboard dalam 30 detik..."
      );

      setTimeout(() => {
        navigate("/customer-dashboard", {
          state: {
            orderPlaced: true,
            source: cartDataFromState ? "cart" : "buyNow",
          },
        });
        window.scrollTo(0, 0);
      }, 30000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal membuat pesanan. Silakan coba lagi.";
      setError(errorMessage);
      log("Order creation error:", err.response?.data || err);
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
            <p className="whitespace-pre-line">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p className="whitespace-pre-line">{successMessage}</p>
          </div>
        )}

        {!loading && !successMessage && cartItems.length > 0 && (
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
                  <p className="text-gray-500 text-sm">{`${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`}</p>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Tidak ada alamat yang dipilih.
                </p>
              )}
              <button
                className="mt-2 text-blue-600 hover:underline"
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

            <div className="bg-white p-4 mt-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4">Detail Pesanan</h3>
              {cartItems.map((item, index) => {
                const { price, discount, satuan } = getPriceDetails(item);
                const itemPrice = typeof price === "number" ? price : 0;
                const itemDiscount =
                  typeof discount === "number" ? discount : 0;
                const discountedPricePerUnit =
                  itemPrice * (1 - itemDiscount / 100);
                const quantity = item.quantity || 1;
                return (
                  <div
                    key={`${item.product?._id || item._id || `item-${index}`}-${
                      item.size
                    }-${item.jenis}`}
                    className="flex items-start border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <img
                      src={
                        item.image ||
                        item.product?.images?.[0] ||
                        "/images/placeholder.png"
                      }
                      alt={item.product?.name || item.name || "Produk"}
                      className="w-20 h-20 mr-4 object-cover rounded"
                      onError={(e) =>
                        (e.target.src = "/images/placeholder.png")
                      }
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-md">
                        {item.product?.name ||
                          item.name ||
                          "Nama Produk Tidak Tersedia"}
                      </h4>
                      <p className="text-sm">
                        Harga: Rp{" "}
                        {discountedPricePerUnit.toLocaleString("id-ID")}/
                        {satuan}
                        {itemDiscount > 0 && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            Rp {itemPrice.toLocaleString("id-ID")}/{satuan}
                          </span>
                        )}
                      </p>
                      <p className="text-sm">Jenis: {item.jenis || "N/A"}</p>
                      <p className="text-sm">Ukuran: {item.size || "N/A"}</p>
                      <p className="text-sm">
                        Jumlah: {quantity.toLocaleString("id-ID")} {satuan}
                      </p>
                      <p className="font-semibold text-sm mt-1">
                        Subtotal: Rp{" "}
                        {(discountedPricePerUnit * quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <div className="grid grid-cols-1">
                <div>
                  <h3 className="font-bold text-lg mb-2">Metode Pembayaran</h3>
                  <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                    <p className="font-semibold text-gray-800">
                      Bayar di Tempat (COD)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Siapkan uang tunai sesuai total tagihan untuk diserahkan
                      kepada kurir saat pesanan tiba.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-xl mb-3">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span>
                      Rp {totalPriceBeforeDiscount.toLocaleString("id-ID")}
                    </span>
                  </p>
                  {totalDiscount > 0 && (
                    <p className="flex justify-between text-red-600">
                      <span>Total Diskon</span>
                      <span>-Rp {totalDiscount.toLocaleString("id-ID")}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>
                      {shippingCost === 0
                        ? "Gratis"
                        : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                    </span>
                  </p>
                  <p className="font-bold text-lg mt-2 flex justify-between border-t pt-2">
                    <span>Total Akhir</span>
                    <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                  </p>
                </div>
                <button
                  className={`mt-6 w-full font-semibold py-3 rounded-lg transition-colors text-white ${
                    loading || !selectedAddress
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handlePayment}
                  disabled={loading || !selectedAddress}
                >
                  {loading ? "Memproses..." : "Buat Pesanan"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <FooterCust />
    </div>
  );
};

export default CheckoutPage;
