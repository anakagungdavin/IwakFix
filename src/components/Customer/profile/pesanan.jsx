import React, { useState, useEffect } from "react";
import TransactionDetailModal from "../../modal/modalDetailTransaksi";
import CustReportModal from "../../modal/modalInvoiceCust";
// Komponen TransactionCard
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
    <div className="p-4 bg-white rounded-lg shadow-md border flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img
          src={imageSrc}
          alt={name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <p className="text-gray-500 text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-[#d9a002] text-xs rounded-md">
              {status || "N/A"}
            </span>
            <p className="text-gray-400 text-xs">{code || "N/A"}</p>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {name} {name === "N/A" && "(Data produk tidak tersedia)"}
          </h3>
          <p className="text-gray-500 text-sm">
            {quantity} x Rp{originalPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-semibold text-gray-800">
          Rp{totalAmount.toLocaleString()}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            className="text-[#FFBC00] text-sm font-bold cursor-pointer"
            onClick={onViewDetail}
          >
            Lihat Detail Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen TransactionList
const TransactionList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("Semua");
  // Fungsi untuk memetakan status backend ke label frontend
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

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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
      console.log("Data dari API untuk user:", data);

      const formattedTransactions = data.map((transaction) => {
        console.log(
          "Processing transaction for user:",
          transaction._id,
          transaction.user?._id
        );
        return {
          createdAt: transaction.createdAt || new Date().toISOString(),
          status: mapStatusToLabel(transaction.status), // Petakan status ke label
          rawStatus: transaction.status, // Simpan status asli untuk filter
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

  // Filter berdasarkan label yang ditampilkan
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

  const currentUserId = localStorage.getItem("userId");
  console.log("Current User ID:", currentUserId);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 border rounded-md ${
            filter === "Semua"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Semua")}
        >
          Semua
        </button>
        <button
          className={`px-6 py-2 border rounded-md ${
            filter === "Berlangsung"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Berlangsung")}
        >
          Berlangsung
        </button>
        <button
          className={`px-6 py-2 border rounded-md ${
            filter === "Selesai"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Selesai")}
        >
          Selesai
        </button>
        <button
          className={`px-6 py-2 border rounded-md ${
            filter === "Gagal"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Gagal")}
        >
          Gagal
        </button>
        <button
          className={`px-6 py-2 border rounded-md ${
            filter === "Menunggu Konfirmasi"
              ? "text-yellow-600 bg-yellow-100"
              : "text-gray-600"
          }`}
          onClick={() => setFilter("Menunggu Konfirmasi")}
        >
          Menunggu Konfirmasi
        </button>
      </div>
      <button
        className="flex items-center px-4 py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md"
        onClick={toggleModalReport}
      >
        <svg
          className="w-5 h-5 mr-2"
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
      <div className="mt-6 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={index}
              date={transaction.createdAt}
              status={transaction.status} // Gunakan status yang sudah dipetakan
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
          <p>Tidak ada transaksi yang ditemukan untuk filter ini.</p>
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
