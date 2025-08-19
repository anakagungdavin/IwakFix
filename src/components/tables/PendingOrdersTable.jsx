import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import ModalImage from "../modal/modalImage";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const PendingOrdersTable = ({
  pendingOrdersData,
  onOrderStatusChange,
  isLoading,
}) => {
  const [actionError, setActionError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [processingOrders, setProcessingOrders] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApprove = async (orderId) => {
    setActionError(null);
    setProcessingOrders((prev) => new Set([...prev, orderId]));

    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageModalOpen(false);
      setSelectedOrder(null);
      if (onOrderStatusChange) {
        onOrderStatusChange();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal menyetujui pesanan";
      setActionError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleReject = async (orderId) => {
    setActionError(null);
    setProcessingOrders((prev) => new Set([...prev, orderId]));

    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageModalOpen(false);
      setSelectedOrder(null);
      if (onOrderStatusChange) {
        onOrderStatusChange();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal menolak pesanan";
      setActionError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const length = windowWidth < 640 ? Math.min(maxLength, 20) : maxLength;
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    if (windowWidth < 640) {
      return `#${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
    }
    return `#${id}`;
  };

  const getUrgencyLevel = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours > 48) return "high";
    if (diffInHours > 24) return "medium";
    return "low";
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <ExclamationTriangleIcon className="h-3 w-3" />
            Mendesak
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            <ClockIcon className="h-3 w-3" />
            Perlu Segera
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <CheckCircleIcon className="h-3 w-3" />
            Normal
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Memuat pesanan tertunda...
          </p>
        </div>
      </div>
    );
  }

  if (actionError) {
    console.error("Action Error:", actionError);
  }

  return (
    <div className="w-full">
      {pendingOrdersData.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircleIcon className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Tidak ada pesanan tertunda
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Semua pesanan telah diproses dengan baik
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Alert */}
          <div className="md:hidden mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-xs">
                <DocumentTextIcon className="h-4 w-4" />
                <span>← Geser tabel untuk melihat semua kolom →</span>
              </div>
            </div>
          </div>

          {/* Summary Cards for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 md:hidden">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Total Tertunda
                  </p>
                  <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                    {pendingOrdersData.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Mendesak
                  </p>
                  <p className="text-lg font-bold text-red-800 dark:text-red-200">
                    {
                      pendingOrdersData.filter(
                        (order) => getUrgencyLevel(order.createdAt) === "high"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Total Nilai
                  </p>
                  <p className="text-sm font-bold text-green-800 dark:text-green-200">
                    Rp
                    {pendingOrdersData
                      .reduce((sum, order) => sum + order.totalAmount, 0)
                      .toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal & Waktu
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                      Qty
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {pendingOrdersData.map((order) => {
                    const totalQuantity = order.items.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    );
                    const productNames = order.items
                      .map(
                        (item) => item.product?.name || "Produk Tidak Dikenal"
                      )
                      .join(", ");
                    const urgency = getUrgencyLevel(order.createdAt);
                    const isProcessing = processingOrders.has(order._id);

                    return (
                      <tr
                        key={order._id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          urgency === "high"
                            ? "bg-red-50/30 dark:bg-red-900/10"
                            : urgency === "medium"
                            ? "bg-amber-50/30 dark:bg-amber-900/10"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                              {formatOrderId(order._id)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getTimeAgo(order.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {truncateText(productNames, 40)}
                            </p>
                            {order.items.length > 1 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                +{order.items.length - 1} item lainnya
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {totalQuantity}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Rp {order.totalAmount.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => viewPaymentProof(order)}
                            disabled={isProcessing}
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                              isProcessing
                                ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                : "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300"
                            }`}
                            title="Lihat Bukti Pembayaran"
                            aria-label="Lihat Bukti Pembayaran"
                          >
                            {isProcessing ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Total: {pendingOrdersData.length} pesanan tertunda</span>
                <span>
                  Nilai: Rp{" "}
                  {pendingOrdersData
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </>
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
