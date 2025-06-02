import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon } from "@heroicons/react/24/solid";
import ModalImage from "../modal/modalImage"; // Pastikan path ini benar

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PendingOrdersTable = ({
  pendingOrdersData,
  onOrderStatusChange,
  isLoading,
}) => {
  const [actionError, setActionError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApprove = async (orderId) => {
    setActionError(null);
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageModalOpen(false);
      setSelectedOrder(null);
      if (onOrderStatusChange) {
        onOrderStatusChange(); // Panggil callback untuk refresh data di Dashboard
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal menyetujui pesanan";
      setActionError(errorMsg);
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleReject = async (orderId) => {
    setActionError(null);
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageModalOpen(false);
      setSelectedOrder(null);
      if (onOrderStatusChange) {
        onOrderStatusChange(); // Panggil callback untuk refresh data di Dashboard
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal menolak pesanan";
      setActionError(errorMsg);
      alert(`Error: ${errorMsg}`);
    }
  };

  const viewPaymentProof = (order) => {
    setSelectedOrder(order);
    setImageModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (windowWidth < 640) {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      });
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const length = windowWidth < 640 ? Math.min(maxLength, 20) : maxLength;
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    if (windowWidth < 640) {
      return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
    }
    return id;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>Memuat pesanan tertunda...</p>
      </div>
    );
  }

  if (actionError) {
    // Anda bisa menampilkan error ini di UI jika diinginkan
    console.error("Action Error:", actionError);
  }

  return (
    <div className="w-full">
      {/* Judul dipindahkan ke Dashboard.jsx */}
      {pendingOrdersData.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Tidak ada order tertunda.
        </p>
      ) : (
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="md:hidden text-xs text-gray-500 italic text-right mb-2">
            ← Geser untuk melihat selengkapnya →
          </div>
          <div className="rounded-lg overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full text-left text-gray-700 min-w-[640px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-xs sm:text-sm">
                  <th className="py-3 px-2 sm:p-4">ID</th>
                  <th className="py-3 px-2 sm:p-4">TANGGAL</th>
                  <th className="py-3 px-2 sm:p-4">PRODUK</th>
                  <th className="py-3 px-2 sm:p-4 text-center">JUMLAH</th>
                  <th className="py-3 px-2 sm:p-4">TOTAL HARGA</th>
                  <th className="py-3 px-2 sm:p-4 text-center">KONFIRMASI</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrdersData.map((order) => {
                  const totalQuantity = order.items.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  );
                  const productNames = order.items
                    .map((item) => item.product?.name || "Produk Tidak Dikenal")
                    .join(", ");
                  return (
                    <tr
                      key={order._id}
                      className="text-xs sm:text-sm hover:bg-gray-100 border-b border-gray-100"
                    >
                      <td className="py-3 px-2 sm:p-4 font-medium">
                        {formatOrderId(order._id)}
                      </td>
                      <td className="py-3 px-2 sm:p-4">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-2 sm:p-4">
                        {truncateText(productNames, 50)}
                      </td>
                      <td className="py-3 px-2 sm:p-4 text-center">
                        {totalQuantity}
                      </td>
                      <td className="py-3 px-2 sm:p-4 whitespace-nowrap">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-2 sm:p-4 text-center">
                        <button
                          onClick={() => viewPaymentProof(order)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                          title="Lihat Bukti Pembayaran"
                          aria-label="Lihat Bukti Pembayaran"
                        >
                          <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#003D47]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedOrder && (
        <ModalImage
          isOpen={imageModalOpen}
          onClose={() => {
            setImageModalOpen(false);
            setSelectedOrder(null);
          }}
          orderData={selectedOrder}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default PendingOrdersTable;
