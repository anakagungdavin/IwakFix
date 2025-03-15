import React, { useState, useEffect } from "react";
import TransactionDetailModal from "../../modal/modalDetailTransaksi";
import CustReportModal from "../../modal/modalInvoiceCust";

// Responsive TransactionCard component
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
}) => {
  const imageSrc = productImages.length > 0 ? productImages[0] : "/fish.png";

  return (
    <div className="p-3 md:p-4 bg-white rounded-lg shadow-md border flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
        />
        <div>
          <p className="text-gray-500 text-xs md:text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <span className="px-1 py-0.5 md:px-2 md:py-1 bg-yellow-100 text-[#d9a002] text-xs rounded-md">
              {status || "N/A"}
            </span>
            <p className="text-gray-400 text-xs">{code || "N/A"}</p>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            {name} {name === "N/A" && "(Data produk tidak tersedia)"}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm">
            {quantity} x Rp{originalPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right flex flex-row justify-between md:flex-col md:justify-center items-center md:items-end">
        <p className="text-lg md:text-xl font-semibold text-gray-800 order-2 md:order-1">
          Rp{totalAmount.toLocaleString()}
        </p>
        <div className="mt-0 md:mt-2 order-1 md:order-2">
          <button
            className="text-[#FFBC00] text-xs md:text-sm font-bold cursor-pointer"
            onClick={onViewDetail}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

// Responsive TransactionList component
const TransactionList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("Semua");

  // Status mapping function remains the same
  const mapStatusToLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Menunggu Konfirmasi";
      case "Paid":
      case "Processing":
      case "Shipped":
        return "Berlangsung";
      case "Delivered":
        return "Selesai";
      case "Cancelled":
        return "Gagal";
      default:
        return "N/A";
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalReport = () => {
    setIsReportModalOpen(!isReportModalOpen);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // fetchTransactions function remains the same
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedTransactions = data.map((transaction) => {
        return {
          createdAt: transaction.createdAt || new Date().toISOString(),
          status: mapStatusToLabel(transaction.status),
          rawStatus: transaction.status,
          _id: transaction._id || "N/A",
          totalAmount: transaction.totalAmount || 0,
          items:
            Array.isArray(transaction.items) && transaction.items.length > 0
              ? transaction.items.map((item) => ({
                  ...item,
                  product: item.product || { name: "N/A", images: [] },
                  originalPrice: item.price || 0,
                  productImages: item.product?.images || [],
                }))
              : [
                  {
                    product: { name: "N/A", images: [] },
                    quantity: 1,
                    originalPrice: 0,
                    productImages: [],
                  },
                ],
          userId: transaction.user?._id,
        };
      });
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter logic remains the same
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "Semua") return true;
    if (filter === "Menunggu Konfirmasi")
      return transaction.rawStatus === "Pending";
    if (filter === "Berlangsung")
      return ["Paid", "Processing", "Shipped"].includes(transaction.rawStatus);
    if (filter === "Selesai") return transaction.rawStatus === "Delivered";
    if (filter === "Gagal") return transaction.rawStatus === "Cancelled";
    return false;
  });

  return (
    <div className="p-2 md:p-6 min-h-screen">
      {/* Responsive filter buttons */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm ${
            filter === "Semua"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Semua")}
        >
          Semua
        </button>
        <button
          className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm ${
            filter === "Berlangsung"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Berlangsung")}
        >
          Berlangsung
        </button>
        <button
          className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm ${
            filter === "Selesai"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Selesai")}
        >
          Selesai
        </button>
        <button
          className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm ${
            filter === "Gagal"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Gagal")}
        >
          Gagal
        </button>
        <button
          className={`px-3 py-1 md:px-6 md:py-2 border rounded-md text-xs md:text-sm ${
            filter === "Menunggu Konfirmasi"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Menunggu Konfirmasi")}
        >
          Menunggu
        </button>
      </div>

      {/* Download Report Button */}
      <button
        className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md text-xs md:text-sm"
        onClick={toggleModalReport}
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 15V7H11V15H14L10 19L6 15H9Z" />
          <path
            fillRule="evenodd"
            d="M3 3H17V13H15V5H5V13H3V3Z"
            clipRule="evenodd"
          />
        </svg>
        Download Sejarah Transaksi
      </button>

      {isReportModalOpen && (
        <CustReportModal isOpen={isReportModalOpen} onClose={toggleModal} />
      )}

      {/* Transaction cards list */}
      <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={index}
              date={transaction.createdAt}
              status={transaction.status}
              code={transaction._id}
              name={transaction.items[0]?.product?.name || "N/A"}
              quantity={transaction.items[0]?.quantity || 1}
              originalPrice={transaction.items[0]?.originalPrice || 0}
              totalAmount={transaction.totalAmount || 0}
              onViewDetail={() => handleViewDetail(transaction)}
              productImages={transaction.items[0]?.productImages || []}
            />
          ))
        ) : (
          <p className="text-sm md:text-base text-center py-4">
            Tidak ada transaksi yang ditemukan untuk filter ini.
          </p>
        )}
      </div>

      {isModalOpen && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList;
