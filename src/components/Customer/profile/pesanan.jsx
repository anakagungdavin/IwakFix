import React, { useState, useEffect, useCallback } from "react";

// =====================================================================================
// Komponen TransactionCard
// =====================================================================================
const TransactionCard = ({
  date,
  status,
  code,
  name = "N/A",
  quantity = 1,
  originalPrice = 0,
  totalAmount = 0,
  onViewDetail,
  productImages = [],
  transaction, // <-- TERIMA PROP INI
}) => {
  const imageSrc =
    productImages.length > 0 ? productImages[0] : "/images/placeholder.png";

  // Pastikan transaction dan transaction.items ada sebelum diakses
  const items = transaction?.items || [];
  const itemCount = items.length;

  return (
    <div className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
          onError={(e) => (e.target.src = "/images/placeholder.png")}
        />
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <span className="px-1 py-0.5 md:px-2 md:py-1 bg-yellow-100 dark:bg-yellow-900/30 text-[#d9a002] dark:text-yellow-400 text-xs rounded-md">
              {status || "N/A"}
            </span>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              {code || "N/A"}
            </p>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
            {name} {/* Gunakan itemCount yang sudah dicek */}
            {name === "N/A" &&
              itemCount === 0 &&
              "(Data produk tidak tersedia)"}
            {itemCount > 1 && ` (+${itemCount - 1} produk lainnya)`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            {quantity} x Rp{(originalPrice || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      <div className="text-right flex flex-row justify-between md:flex-col md:justify-center items-center md:items-end">
        <p className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white order-2 md:order-1">
          Rp{(totalAmount || 0).toLocaleString("id-ID")}
        </p>
        <div className="mt-0 md:mt-2 order-1 md:order-2">
          <button
            className="text-[#FFBC00] dark:text-yellow-400 text-xs md:text-sm font-bold cursor-pointer hover:underline"
            onClick={onViewDetail}
          >
            Lihat Detail Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// Komponen TransactionList (Komponen Utama)
// =====================================================================================
const TransactionList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Semua");

  const mapStatusToLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Menunggu Konfirmasi";
      case "Paid":
        return "Dibayar";
      case "Processing":
        return "Diproses";
      case "Shipped":
        return "Dikirim";
      case "Delivered":
        return "Selesai";
      case "Cancelled":
        return "Dibatalkan";
      default:
        return "N/A";
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalReport = () => setIsReportModalOpen(!isReportModalOpen);

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Data dari API untuk user:", data); // <-- Ini sudah ada

      const formattedTransactions = data.map((transaction) => ({
        createdAt: transaction.createdAt || new Date().toISOString(),
        status: mapStatusToLabel(transaction.status),
        rawStatus: transaction.status,
        _id:
          transaction._id ||
          `temp-id-${Math.random().toString(36).substr(2, 9)}`,
        totalAmount: transaction.totalAmount || 0,
        items:
          Array.isArray(transaction.items) && transaction.items.length > 0
            ? transaction.items.map((item) => ({
                _id:
                  item._id ||
                  `item-temp-id-${Math.random().toString(36).substr(2, 9)}`,
                product: item.product || { name: "N/A", images: [] },
                quantity: item.quantity || 1,
                price: item.price || 0,
                discount: item.discount || 0,
                discountedPrice: item.discountedPrice || item.price || 0,
                productImages: item.product?.images || [], // Ambil dari item.product.images
                jenis: item.jenis || "N/A",
                size: item.size || "N/A",
                satuan: item.satuan || "kg",
              }))
            : [
                {
                  // Default item jika items kosong, agar struktur konsisten
                  _id: `item-empty-temp-id-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                  product: { name: "N/A", images: [] },
                  quantity: 1,
                  price: 0,
                  discount: 0,
                  discountedPrice: 0,
                  productImages: [],
                  jenis: "N/A",
                  size: "N/A",
                  satuan: "kg",
                },
              ],
        shippingAddress: transaction.shippingAddress || {},
        shippingCost: transaction.shippingCost || 0,
        paymentMethod: transaction.paymentMethod || "N/A",
        trackingNumber: transaction.trackingNumber || "N/A",
        orderDate: transaction.orderDate || transaction.createdAt,
      }));
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "Semua") return true;
    if (filter === "Menunggu Konfirmasi")
      return transaction.rawStatus === "Pending";
    if (filter === "Berlangsung")
      return ["Paid", "Processing", "Shipped"].includes(transaction.rawStatus);
    if (filter === "Selesai") return transaction.rawStatus === "Delivered";
    if (filter === "Dibatalkan") return transaction.rawStatus === "Cancelled";
    return false;
  });

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-900 dark:text-white">
        Memuat riwayat transaksi...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
        {[
          "Semua",
          "Berlangsung",
          "Selesai",
          "Dibatalkan",
          "Menunggu Konfirmasi",
        ].map((filterName) => (
          <button
            key={filterName}
            className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm transition-colors duration-150
              ${
                filter === filterName
                  ? "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
              }`}
            onClick={() => setFilter(filterName)}
          >
            {filterName}
          </button>
        ))}
      </div>
      {/* <button
        className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-[#003D47] dark:bg-[#FFBC00] text-white dark:text-black hover:bg-[#005f73] dark:hover:bg-[#e6a800] transition rounded-md text-xs md:text-sm shadow"
        onClick={toggleModalReport}
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 17H3V3H17V17ZM15 5H5V15H15V5Z" />
          <path d="M10 13L6 9H9V6H11V9H14L10 13Z" />
        </svg>
        Download Riwayat Transaksi
      </button> */}
      {isReportModalOpen && (
        <CustReportModal
          isOpen={isReportModalOpen}
          onClose={toggleModalReport}
          transactions={transactions}
        />
      )}
      <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(
            (
              transactionItem // Ganti nama variabel agar tidak konflik
            ) => (
              <TransactionCard
                key={transactionItem._id}
                date={transactionItem.orderDate || transactionItem.createdAt}
                status={transactionItem.status}
                code={transactionItem._id}
                name={transactionItem.items[0]?.product?.name || "N/A"}
                quantity={transactionItem.items[0]?.quantity || 1}
                originalPrice={transactionItem.items[0]?.price || 0}
                totalAmount={transactionItem.totalAmount || 0}
                onViewDetail={() => handleViewDetail(transactionItem)}
                productImages={transactionItem.items[0]?.product?.images || []}
                transaction={transactionItem} // <-- KIRIM SELURUH OBJEK SEBAGAI PROP 'transaction'
              />
            )
          )
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Tidak ada transaksi yang ditemukan untuk filter "{filter}".
          </p>
        )}
      </div>
      {isModalOpen && selectedTransaction && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

// =====================================================================================
// Komponen TransactionDetailModal (Modal Detail)
// =====================================================================================
const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const {
    _id,
    status,
    items = [],
    totalAmount = 0,
    shippingAddress = {},
    shippingCost = 0,
    paymentMethod,
    trackingNumber = "Belum tersedia",
    orderDate,
    createdAt, // Tambahkan createdAt jika ingin digunakan sebagai fallback
  } = transaction;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = items.reduce((sum, item) => {
    const originalItemTotal = (item.price || 0) * (item.quantity || 1);
    const discountedItemTotal =
      (item.discountedPrice || item.price || 0) * (item.quantity || 1);
    return sum + (originalItemTotal - discountedItemTotal);
  }, 0);

  const formatPaymentMethod = (method) => {
    switch (method?.toLowerCase()) {
      case "bank_jateng":
        return "Bank Jateng";
      case "cod":
        return "Bayar di Tempat (COD)";
      case "qris":
        return "QRIS";
      default:
        return method || "N/A";
    }
  };

  const formatDate = (dateInput) => {
    const dateToUse = dateInput || createdAt; // Gunakan orderDate atau fallback ke createdAt
    if (!dateToUse) return "Tanggal tidak tersedia";
    const date = new Date(dateToUse);
    return isNaN(date.getTime())
      ? "Tanggal tidak tersedia"
      : date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 bg-gray-900 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light"
            aria-label="Close modal"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Detail Transaksi
          </h2>
          <div></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full
            ${
              status === "Selesai"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : status === "Dibatalkan"
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : status === "Menunggu Konfirmasi"
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
            }`}
          >
            {status || "N/A"}
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {_id || "N/A"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(orderDate)}
            </p>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Item Pesanan
          </h3>
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-3 mb-3 last:mb-0"
              >
                <img
                  src={item.product?.images?.[0] || "/images/placeholder.png"}
                  alt={item.product?.name || "Produk"}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
                <div className="flex-grow">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {item.product?.name || "Produk Tidak Tersedia"}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.quantity
                      ? `${item.quantity.toLocaleString("id-ID")} ${
                          item.satuan || "kg"
                        }`
                      : `1 ${item.satuan || "kg"}`}
                    {" x "}
                    Rp{(item.price || 0).toLocaleString("id-ID")}
                    {item.discount > 0 && (
                      <span className="text-red-500 dark:text-red-400 text-xs ml-1">
                        (-{item.discount}%)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Jenis:{" "}
                    <span className="font-medium">{item.jenis || "N/A"}</span>,
                    Ukuran:{" "}
                    <span className="font-medium">{item.size || "N/A"}</span>
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    Subtotal Item: Rp
                    {(
                      (item.discountedPrice || item.price || 0) *
                      (item.quantity || 1)
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tidak ada item dalam transaksi ini.
            </p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Info Pengiriman
          </h3>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {shippingAddress.recipientName || "N/A"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {shippingAddress.phoneNumber || "N/A"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {shippingAddress.streetAddress
              ? `${shippingAddress.streetAddress}, ${
                  shippingAddress.city || ""
                }, ${shippingAddress.province || ""}, ${
                  shippingAddress.postalCode || ""
                }`
                  .replace(/, ,/g, ",")
                  .replace(/,$/, "")
              : "Alamat tidak tersedia"}
          </p>
          {trackingNumber &&
            trackingNumber !== "N/A" &&
            trackingNumber !== "Belum tersedia" && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                <strong>No. Resi:</strong> {trackingNumber}
              </p>
            )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Rincian Pembayaran
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Metode Pembayaran
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatPaymentMethod(paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Subtotal Item ({items.length})
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Rp{subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Total Diskon</span>
                <span>-Rp{totalDiscount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Ongkos Kirim
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Rp{(shippingCost || 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 dark:text-white text-sm mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>TOTAL PEMBAYARAN</span>
              <span>Rp{(totalAmount || 0).toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// Komponen CustReportModal (Placeholder)
// =====================================================================================
const CustReportModal = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    console.log("Downloading report for transactions:", transactions);
    alert("Fungsi download laporan belum diimplementasikan.");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 bg-gray-900 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Download Riwayat Transaksi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Apakah Anda yakin ingin men-download riwayat semua transaksi?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
          >
            Batal
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-[#003D47] dark:bg-[#FFBC00] hover:bg-[#005f73] dark:hover:bg-[#e6a800] rounded-md"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
