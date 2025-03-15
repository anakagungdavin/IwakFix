import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderCust from "../../components/Customer/headerCust";
import FooterCust from "../../components/Customer/footerCust";
import ChangeAddress from "../../components/Customer/ChangeAddress";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state || null;
  const cartData = location.state?.cart || null;
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    navigate("/checkout")
  }

  const handleFileChange = (event) => {
    // setProofPayment(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setProofPayment(file);
      setProofPreview(URL.createObjectURL(file));
    }
  }


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
  // const handlePayment = async () => {
  //   if (!selectedAddress) {
  //     setError("Silakan pilih alamat pengiriman.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const shippingAddressString = `${selectedAddress.recipientName}, ${selectedAddress.phoneNumber}, ${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postalCode}`;

  //     const response = await axios.post(
  //       `${API_URL}/api/orders`,
  //       {
  //         shippingAddress: shippingAddressString,
  //         paymentMethod,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert("Pembayaran berhasil!");
  //     localStorage.removeItem("checkoutCart");
  //     navigate("/customer-dashboard");
  //     window.scrollTo(0, 0);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Gagal memproses pembayaran");
  //     console.error("Payment error:", err.response ? err.response.data : err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Silakan pilih alamat pengiriman.");
      return;
    }
    if (!proofPayment) {
      setError("Silakan unggah bukti pembayaran.");
      return;
    }
    if (!paymentMethod){
      setError("Silahkan pilih metode pembayaran")
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("shippingAddress", JSON.stringify(selectedAddress));
      formData.append("paymentMethod", paymentMethod);
      formData.append("proofOfPayment", proofPayment);

      const response = await axios.post(`${API_URL}/api/orders`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pembayaran berhasil!");
      localStorage.removeItem("checkoutCart");
      navigate("/customer-dashboard");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses pembayaran");
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
              {showAddressModal && (
                <ChangeAddress
                onClose={() => setShowAddressModal(false)}
                onSelectAddress={handleSelectAddress}
                />
              )}
              <button className="mt-2 text-blue-600" onClick={() => setShowAddressModal(true)}>Ganti Alamat</button>
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
              <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
          {/* Kolom Kiri: Pilihan Metode Pembayaran */}
          <div>
            <h3 className="font-bold text-lg mb-2">Metode Pembayaran</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Metode Pembayaran</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="BCA">BCA</option>
              <option value="QRIS">QRIS</option>
            </select>

            {/* Informasi Nomor Rekening atau QRIS */}
            {paymentMethod === "Mandiri" && (
              <p className="mt-3 text-blue-600 font-semibold">
                Nomor Rekening Mandiri: 123-456-7890 a/n IWAK Store
              </p>
            )}
            {paymentMethod === "BCA" && (
              <p className="mt-3 text-blue-600 font-semibold">
                Nomor Rekening BCA: 098-765-4321 a/n IWAK Store
              </p>
            )}
            {paymentMethod === "QRIS" && (
              <div className="mt-3">
                <p className="text-blue-600 font-semibold">Silakan scan QRIS:</p>
                <img
                  src="/assets/qris-example.png"
                  alt="QRIS Code"
                  className="w-48 mt-2"
                />
              </div>
            )}
          </div>

          {/* Kolom Kanan: Upload Bukti Pembayaran */}
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
                <h4 className="font-semibold">Preview Bukti Pembayaran:</h4>
                <img
                  src={proofPreview}
                  alt="Bukti Pembayaran"
                  className="w-48 h-auto mt-2 border rounded-md"
                />
              </div>
            )}
          </div>
        </div>
              {/* <div className="flex flex-col space-y-2 border-b pb-4">
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
              </div> */}
              {error && <p className="text-red-500 text-center">{error}</p>}
              
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