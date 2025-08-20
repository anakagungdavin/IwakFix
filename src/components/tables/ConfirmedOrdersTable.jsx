import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  EyeIcon,
  XMarkIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CameraIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PaperClipIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import TransactionDetailModal from "../modal/modalDetailTransaksi";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ConfirmedOrdersTable = ({
  ordersData,
  onOrderStatusChange,
  isLoading,
}) => {
  const [actionError, setActionError] = useState(null);
  const [resiNumbers, setResiNumbers] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState({});
  const [codImages, setCodImages] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [processingOrders, setProcessingOrders] = useState(new Set());

  const token = localStorage.getItem("token");

  const confirmedOrders = useMemo(
    () => ordersData.filter((order) => order.status === "Paid"),
    [ordersData]
  );

  const shippedOrders = useMemo(
    () => ordersData.filter((order) => order.status === "Delivered"),
    [ordersData]
  );

  useEffect(() => {
    const initialShippingMethods = {};
    confirmedOrders.forEach((order) => {
      if (!shippingMethod[order._id]) {
        initialShippingMethods[order._id] = "COD";
      }
    });
    if (Object.keys(initialShippingMethods).length > 0) {
      setShippingMethod((prev) => ({ ...prev, ...initialShippingMethods }));
    }
  }, [confirmedOrders, shippingMethod]);

  const handleResiChange = (orderId, value) => {
    setResiNumbers((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleShippingMethodChange = (orderId, method) => {
    setShippingMethod((prev) => ({ ...prev, [orderId]: method }));
    if (method === "COD") {
      setResiNumbers((prev) => ({ ...prev, [orderId]: "" }));
    } else if (method === "resi") {
      removeCodImage(orderId);
    }
  };

  const handleCodImageUpload = (orderId, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 0.5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimum 0.5MB.");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCodImages((prev) => ({
          ...prev,
          [orderId]: { file: file, preview: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCodImage = (orderId) => {
    setCodImages((prev) => {
      const newImages = { ...prev };
      delete newImages[orderId];
      return newImages;
    });
    const fileInput = document.getElementById(`cod-image-${orderId}`);
    if (fileInput) fileInput.value = null;
  };

  const handleShipOrder = async (orderId) => {
    setActionError(null);
    setProcessingOrders((prev) => new Set([...prev, orderId]));

    const currentOrder = confirmedOrders.find((o) => o._id === orderId);
    if (!currentOrder) return;

    const method = shippingMethod[orderId];
    let payload;
    let requestConfig = { headers: { Authorization: `Bearer ${token}` } };
    const formData = new FormData();

    if (method === "resi") {
      const resiNumber = resiNumbers[orderId];
      if (!resiNumber) {
        alert("Harap masukkan nomor resi sebelum mengirim pesanan.");
        setProcessingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
        return;
      }
      payload = {
        status: "Delivered",
        trackingNumber: resiNumber,
        shippingMethod: "courier",
      };
    } else if (method === "COD") {
      const codImageFile = codImages[orderId]?.file;
      if (!codImageFile) {
        alert("Harap unggah bukti COD sebelum mengirim pesanan.");
        setProcessingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
        return;
      }
      formData.append("status", "Delivered");
      formData.append("shippingMethod", "COD");
      formData.append("codProof", codImageFile);
      payload = formData;
      requestConfig.headers["Content-Type"] = "multipart/form-data";
    } else {
      alert("Metode pengiriman tidak valid.");
      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        payload,
        requestConfig
      );
      alert("Status pesanan berhasil diperbarui menjadi 'Delivered'.");

      setResiNumbers((prev) => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      setCodImages((prev) => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });

      if (onOrderStatusChange) {
        onOrderStatusChange();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal mengirim pesanan";
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const openImageProof = (imageUrl) => setPreviewImage(imageUrl);
  const closeImageProof = () => setPreviewImage(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Tanggal tidak valid"
      : date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
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

  const getProductNames = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0)
      return "Tidak ada produk";
    return items
      .map(
        (item) => item?.product?.name || item?.name || "Produk tidak bernama"
      )
      .join(", ");
  };

  const getTotalQuantity = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  if (isLoading && confirmedOrders.length === 0 && shippedOrders.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (actionError) {
    console.error("Action Error:", actionError);
  }

  return (
    <div className="w-full space-y-8">
      {/* Orders to Ship Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pesanan yang Perlu Dikirim
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {confirmedOrders.length} pesanan menunggu pengiriman
              </p>
            </div>
          </div>
          {confirmedOrders.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
              {confirmedOrders.length} pesanan
            </span>
          )}
        </div>

        {confirmedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <TruckIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Tidak ada pesanan yang menunggu pengiriman
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Semua pesanan sudah dikirim atau belum dikonfirmasi
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal
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
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Metode
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Detail Pengiriman
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {confirmedOrders.map((order) => {
                    const isProcessing = processingOrders.has(order._id);
                    const canShip =
                      (shippingMethod[order._id] === "resi" &&
                        resiNumbers[order._id]) ||
                      (shippingMethod[order._id] === "COD" &&
                        codImages[order._id]?.file);

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                              #{order._id?.slice(-8) || "N/A"}
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
                              {getProductNames(order.items)}
                            </p>
                            {order.items.length > 1 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {order.items.length} items
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {getTotalQuantity(order.items)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Rp{" "}
                              {(order.totalAmount || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                value="COD"
                                name={`shipping-method-${order._id}`}
                                checked={shippingMethod[order._id] === "COD"}
                                onChange={() =>
                                  handleShippingMethodChange(order._id, "COD")
                                }
                                className="mr-2 text-blue-600"
                                disabled={isProcessing}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                COD
                              </span>
                            </label>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {shippingMethod[order._id] === "resi" ? (
                            <input
                              type="text"
                              placeholder="Masukkan nomor resi"
                              value={resiNumbers[order._id] || ""}
                              onChange={(e) =>
                                handleResiChange(order._id, e.target.value)
                              }
                              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={
                                isProcessing ||
                                order.paymentMethod?.toLowerCase() === "cod"
                              }
                            />
                          ) : shippingMethod[order._id] === "COD" ? (
                            <div className="space-y-2">
                              {codImages[order._id]?.preview ? (
                                <div className="relative inline-block">
                                  <div className="relative w-20 h-16 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                                    <img
                                      src={codImages[order._id].preview}
                                      alt="Bukti COD"
                                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() =>
                                        openImageProof(
                                          codImages[order._id].preview
                                        )
                                      }
                                    />
                                    <button
                                      onClick={() => removeCodImage(order._id)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                      aria-label="Hapus gambar"
                                      disabled={isProcessing}
                                    >
                                      <XMarkIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Bukti COD
                                  </p>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="file"
                                    id={`cod-image-${order._id}`}
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleCodImageUpload(order._id, e)
                                    }
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={
                                      isProcessing ||
                                      order.paymentMethod?.toLowerCase() !==
                                        "cod"
                                    }
                                  />
                                  <label
                                    htmlFor={`cod-image-${order._id}`}
                                    className={`flex flex-col items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                                      isProcessing ||
                                      order.paymentMethod?.toLowerCase() !==
                                        "cod"
                                        ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    <PhotoIcon className="h-6 w-6 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                      Upload Bukti COD
                                    </span>
                                  </label>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <DocumentTextIcon className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                              <span className="text-xs text-gray-400">
                                Pilih metode
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShipOrder(order._id)}
                              disabled={!canShip || isProcessing}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                canShip && !isProcessing
                                  ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {isProcessing ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Mengirim...</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <TruckIcon className="h-4 w-4" />
                                  <span>Kirim</span>
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Shipped Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pesanan yang Sudah Dikirim
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shippedOrders.length} pesanan telah dikirim
              </p>
            </div>
          </div>
          {shippedOrders.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              {shippedOrders.length} pesanan
            </span>
          )}
        </div>

        {shippedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Belum ada pesanan yang dikirim
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Pesanan yang sudah dikirim akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal Kirim
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Metode
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Tracking/Bukti
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {shippedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                            #{order._id?.slice(-8) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(order.updatedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {getProductNames(order.items)}
                          </p>
                          {order.items.length > 1 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.items.length} items
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Rp{" "}
                            {(order.totalAmount || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.shippingMethod?.toLowerCase() === "cod"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          }`}
                        >
                          {order.shippingMethod || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {order.shippingMethod?.toLowerCase() === "cod" ? (
                          order.codProof ? (
                            <button
                              onClick={() => openImageProof(order.codProof)}
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                            >
                              <PhotoIcon className="h-4 w-4" />
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )
                        ) : (
                          <div className="flex items-center gap-1">
                            <PaperClipIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {order.trackingNumber || "N/A"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && selectedOrder && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          transaction={selectedOrder}
        />
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeImageProof}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bukti COD
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={closeImageProof}
                aria-label="Tutup preview"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewImage}
                alt="Preview Bukti COD"
                className="max-w-full max-h-[70vh] object-contain rounded-lg mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedOrdersTable;
