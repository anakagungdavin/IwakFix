import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import ChangeAddress from "../../components/Customer/ChangeAddress";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
const DEFAULT_SHIPPING_COST = 25000; // Definisikan ongkir default

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productDataFromState = location.state?.product || null;
  const cartDataFromState = location.state?.cart || null;

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [proofPayment, setProofPayment] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  // State baru untuk ongkos kirim
  const [shippingCost, setShippingCost] = useState(DEFAULT_SHIPPING_COST);

  const log = process.env.NODE_ENV === "development" ? console.log : () => {};

  useEffect(() => {
    let itemsToCheckout = [];
    if (productDataFromState) {
      log("Mode: Buy Now. Product Data diterima:", productDataFromState);
      itemsToCheckout = [productDataFromState];
    } else if (cartDataFromState && Array.isArray(cartDataFromState)) {
      log("Mode: Checkout from Cart. Cart Data diterima:", cartDataFromState);
      itemsToCheckout = cartDataFromState;
    } else {
      const storedCheckoutItems = localStorage.getItem("checkoutItems");
      if (storedCheckoutItems) {
        log("Mode: Fallback. Mengambil dari localStorage 'checkoutItems'");
        itemsToCheckout = JSON.parse(storedCheckoutItems);
      } else {
        log("Tidak ada data produk atau keranjang valid untuk checkout.");
        setError("Tidak ada item untuk di-checkout. Silakan kembali ke toko.");
      }
    }
    setCartItems(itemsToCheckout);
    localStorage.setItem("checkoutItems", JSON.stringify(itemsToCheckout));
    log("Items to checkout (cartItems) set:", itemsToCheckout);
  }, [productDataFromState, cartDataFromState, log]); // Tambahkan log ke dependency array

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
          headers: { Authorization: `Bearer ${token}` },
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
  }, [navigate, log]); // Tambahkan log ke dependency array

  // useEffect untuk mengupdate ongkos kirim berdasarkan metode pembayaran
  // useEffect(() => {
  //   if (paymentMethod === "cod") {
  //     setShippingCost(0);
  //     log("Payment method COD, shipping cost set to 0");
  //   } else {
  //     setShippingCost(DEFAULT_SHIPPING_COST);
  //     log(
  //       `Payment method ${paymentMethod}, shipping cost set to ${DEFAULT_SHIPPING_COST}`
  //     );
  //   }
  // }, [paymentMethod, log]); // Tambahkan log ke dependency array
  useEffect(() => {
  setShippingCost(DEFAULT_SHIPPING_COST);
}, [paymentMethod]);


  const getPriceDetails = (item) => {
    log("Getting price details for item:", item);
    if (item.price && typeof item.price === "number" && item.satuan) {
      return {
        price: item.price,
        discount: item.discount || 0,
        satuan: item.satuan,
      };
    } else if (item.product?.stocks && item.size && item.jenis && item.satuan) {
      const sanitizedSize = item.size?.trim().toLowerCase() || "";
      const sanitizedJenis = item.jenis?.trim().toLowerCase() || "";
      const sanitizedSatuan = item.satuan?.trim() || "";
      const stockEntry = item.product.stocks.find(
        (stock) =>
          stock.size?.trim().toLowerCase() === sanitizedSize &&
          stock.jenis?.trim().toLowerCase() === sanitizedJenis &&
          stock.satuan?.trim() === sanitizedSatuan
      );
      if (stockEntry) {
        return {
          price: stockEntry.price || 0,
          discount: stockEntry.discount || 0,
          satuan: stockEntry.satuan || "kg",
        };
      }
    }
    log("No valid price details found for item:", item);
    return { price: 0, discount: 0, satuan: "kg" };
  };

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

  // Grand total sekarang menggunakan state shippingCost
  const grandTotal = finalTotal + shippingCost;

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    log("Selected File:", file);
    if (file) {
      if (file.size > 0.5 * 1024 * 1024) {
        setError("Ukuran file bukti pembayaran terlalu besar. Maksimum 0.5MB.");
        setProofPayment(null);
        setProofPreview(null);
        event.target.value = null;
        return;
      }
      setProofPayment(file);
      setProofPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handlePayment = async () => {
    // ... (validasi awal tetap sama) ...
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }
    if (!paymentMethod) {
      setError("Silakan pilih metode pembayaran.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Tidak ada item untuk di-checkout.");
      return;
    }
    // if (paymentMethod !== "cod" && !proofPayment) {
    //   setError("Silakan unggah bukti pembayaran.");
    //   return;
    // }
    if (!proofPayment) {
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
      // if (paymentMethod !== "cod" && proofPayment) {
      //   formData.append("proofOfPayment", proofPayment);
      // }
      if (proofPayment) {
        formData.append("proofOfPayment", proofPayment);
      }


      const orderSource = cartDataFromState ? "cart" : "buyNow";
      formData.append("source", orderSource);
      log("Order source being sent:", orderSource);

      const orderItemsPayload = cartItems.map((item) => {
        const { price, discount, satuan } = getPriceDetails(item);
        const itemDiscount = typeof discount === "number" ? discount : 0;
        const itemPrice = typeof price === "number" ? price : 0;
        return {
          product: item.product?._id || item._id,
          quantity: item.quantity || 1,
          price: itemPrice,
          discount: itemDiscount,
          discountedPrice: itemPrice * (1 - itemDiscount / 100),
          size: item.size || "N/A",
          jenis: item.jenis || "N/A",
          satuan: satuan, // Ambil satuan dari getPriceDetails
        };
      });

      if (orderItemsPayload.length === 0) {
        throw new Error("Tidak ada item valid untuk dipesan.");
      }

      formData.append("items", JSON.stringify(orderItemsPayload));
      // Kirim totalAmount yang sudah termasuk ongkir yang sudah disesuaikan
      formData.append("totalAmount", grandTotal);
      // Kirim shippingCost yang sudah disesuaikan
      formData.append("shippingCost", shippingCost);

      log("Mengirim FormData:", Object.fromEntries(formData.entries()));

      const response = await axios.post(`${API_URL}/api/orders`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      log("Order creation response:", response.data);
      localStorage.removeItem("checkoutItems");
      setCartItems([]);

      setSuccessMessage(
        "Pembayaran berhasil diproses! Menunggu verifikasi oleh admin. \nBeralih ke Dashboard dalam 30 detik..."
      );

      setTimeout(() => {
        navigate("/customer-dashboard", {
          state: { orderPlaced: true, source: orderSource },
        });
        window.scrollTo(0, 0);
      }, 30000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors && Array.isArray(err.response.data.errors)
          ? err.response.data.errors.map((e) => e.msg).join(", ")
          : err.message) ||
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
            <p className="whitespace-pre-line">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p className="whitespace-pre-line">{successMessage}</p>
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
                  Memuat alamat atau tidak ada alamat tersedia.
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
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => {
                  const { price, discount, satuan } = getPriceDetails(item);
                  const itemPrice = typeof price === "number" ? price : 0;
                  const itemDiscount =
                    typeof discount === "number" ? discount : 0;
                  const discountedPricePerUnit =
                    itemPrice * (1 - itemDiscount / 100);
                  const quantity = item.quantity || 1;

                  return (
                    <div
                      key={`${
                        item.product?._id || item._id || `item-${index}`
                      }-${item.size}-${item.jenis}`}
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
                })
              ) : (
                <p className="text-gray-500 text-center">
                  Tidak ada item untuk di-checkout.
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Metode Pembayaran</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      // Logika untuk reset bukti bayar jika COD sudah ada di useEffect
                    }}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="bank_jateng">Bank Jateng</option>
                    {/* <option value="cod">COD (Bayar di Tempat)</option> */}
                    <option value="qris">QRIS</option>
                  </select>

                  {paymentMethod === "bank_jateng" && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-700 font-semibold">
                        {" "}
                        Nomor Rekening Bank Jateng:{" "}
                      </p>
                      <p className="text-lg text-blue-800 font-bold">
                        {" "}
                        123-456-7890{" "}
                      </p>
                      <p className="text-sm text-blue-700">a/n IWAK Store</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {" "}
                        Pastikan untuk mengunggah bukti transfer.{" "}
                      </p>
                    </div>
                  )}
                  {paymentMethod === "qris" && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700 font-semibold">
                        {" "}
                        Silakan scan QRIS di bawah ini:{" "}
                      </p>
                      <img
                        src="/images/qris-example.png"
                        alt="QRIS Code"
                        className="w-48 mt-2 border rounded"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {" "}
                        Pastikan untuk mengunggah bukti pembayaran.{" "}
                      </p>
                    </div>
                  )}
                </div>

                {paymentMethod && paymentMethod !== "cod" && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      {" "}
                      Unggah Bukti Pembayaran{" "}
                    </h3>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {" "}
                      Maksimum ukuran file: 0.5MB (JPEG, PNG, GIF, WEBP).{" "}
                    </p>
                    {proofPreview && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm">
                          {" "}
                          Preview Bukti Pembayaran:{" "}
                        </h4>
                        <img
                          src={proofPreview}
                          alt="Bukti Pembayaran"
                          className="w-full max-w-xs h-auto mt-2 border rounded-md object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-xl mb-3">Ringkasan Pembayaran</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span>
                      {" "}
                      Rp {totalPriceBeforeDiscount.toLocaleString("id-ID")}{" "}
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
                    {/* Tampilkan "Gratis" jika shippingCost adalah 0 */}
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
                  className={`mt-6 w-full font-semibold py-3 rounded-lg transition-colors text-white
                    ${
                      loading ||
                      cartItems.length === 0 ||
                      !selectedAddress ||
                      !paymentMethod ||
                      (!proofPayment)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  onClick={handlePayment}
                  disabled={
                    loading ||
                    cartItems.length === 0 ||
                    !selectedAddress ||
                    !paymentMethod ||
                    (paymentMethod !== "cod" && !proofPayment)
                  }
                >
                  {loading ? "Memproses..." : `Bayar Sekarang`}
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
