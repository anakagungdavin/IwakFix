import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TransactionDetailModal from "../modal/modalDetailTransaksi"; // Pastikan path ini benar

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

  const token = localStorage.getItem("token");

  const confirmedOrders = useMemo(
    () => ordersData.filter((order) => order.status === "Paid"),
    [ordersData]
  );

  const shippedOrders = useMemo(
    () => ordersData.filter((order) => order.status === "Shipped"),
    [ordersData]
  );

  useEffect(() => {
    const initialShippingMethods = {};
    confirmedOrders.forEach((order) => {
      if (!shippingMethod[order._id]) {
        // Always set to COD since Kurir is disabled
        initialShippingMethods[order._id] = "COD";
      }
    });
    if (Object.keys(initialShippingMethods).length > 0) {
      setShippingMethod((prev) => ({ ...prev, ...initialShippingMethods }));
    }
  }, [confirmedOrders, shippingMethod]); // Tambahkan shippingMethod agar tidak overwrite state yang sudah diubah user

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
        return;
      }
      payload = {
        status: "Shipped",
        trackingNumber: resiNumber,
        shippingMethod: "courier",
      };
    } else if (method === "COD") {
      const codImageFile = codImages[orderId]?.file;
      if (!codImageFile) {
        alert("Harap unggah bukti COD sebelum mengirim pesanan.");
        return;
      }
      formData.append("status", "Shipped");
      formData.append("shippingMethod", "COD");
      formData.append("codProof", codImageFile);
      payload = formData;
      requestConfig.headers["Content-Type"] = "multipart/form-data";
    } else {
      alert("Metode pengiriman tidak valid.");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        payload,
        requestConfig
      );
      alert("Status pesanan berhasil diperbarui menjadi 'Shipped'.");

      // Reset state lokal untuk order yang baru dikirim
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
      // Tidak perlu menghapus shippingMethod[orderId] karena akan hilang dari daftar "Perlu Dikirim"

      if (onOrderStatusChange) {
        onOrderStatusChange(); // Panggil callback untuk refresh data di Dashboard
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal mengirim pesanan";
      setActionError(errorMsg);
      alert(`Error: ${errorMsg}`);
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
        });
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
      <div className="flex justify-center items-center p-4">
        <p>Memuat pesanan...</p>
      </div>
    );
  }
  if (actionError) {
    // Anda bisa menampilkan error ini di UI jika diinginkan
    console.error("Action Error:", actionError);
  }

  return (
    <div className="w-full">
      {/* Judul "Pesanan yang Perlu Dikirim" dipindahkan ke Dashboard.jsx */}
      <h2 className="text-lg font-semibold mb-4">Pesanan yang Perlu Dikirim</h2>
      {confirmedOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Tidak ada pesanan yang menunggu pengiriman.
        </p>
      ) : (
        <div className="relative bg-white rounded-lg shadow-sm mb-8">
          <div className="rounded-lg overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full text-left text-gray-700 min-w-[640px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-xs sm:text-sm">
                  <th className="py-3 px-2 sm:p-4">ID</th>
                  <th className="py-3 px-2 sm:p-4">TANGGAL</th>
                  <th className="py-3 px-2 sm:p-4">PRODUK</th>
                  <th className="py-3 px-2 sm:p-4 text-center">JUMLAH</th>
                  <th className="py-3 px-2 sm:p-4">TOTAL HARGA</th>
                  <th className="py-3 px-2 sm:p-4">METODE</th>
                  <th className="py-3 px-2 sm:p-4">DETAIL PENGIRIMAN</th>
                  <th className="py-3 px-2 sm:p-4 text-center">KIRIM</th>
                  <th className="py-3 px-2 sm:p-4 text-center">DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-xs sm:text-sm hover:bg-gray-100 border-b border-gray-100"
                  >
                    <td className="py-3 px-2 sm:p-4">
                      {order._id?.slice(-6) || "N/A"}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {getProductNames(order.items)}
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      {getTotalQuantity(order.items)}
                    </td>
                    <td className="py-3 px-2 sm:p-4 whitespace-nowrap">
                      Rp {(order.totalAmount || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      <div className="flex flex-col space-y-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="COD"
                            name={`shipping-method-${order._id}`}
                            checked={shippingMethod[order._id] === "COD"}
                            onChange={() =>
                              handleShippingMethodChange(order._id, "COD")
                            }
                            className="mr-2"
                          />
                          <span>COD</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {shippingMethod[order._id] === "resi" ? (
                        <input
                          type="text"
                          placeholder="Masukkan nomor resi"
                          value={resiNumbers[order._id] || ""}
                          onChange={(e) =>
                            handleResiChange(order._id, e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded w-full text-xs sm:text-sm"
                          disabled={
                            order.paymentMethod?.toLowerCase() === "cod"
                          }
                        />
                      ) : shippingMethod[order._id] === "COD" ? (
                        <div className="flex flex-col space-y-2">
                          {codImages[order._id]?.preview ? (
                            <div className="relative">
                              <div className="relative h-16 w-24 overflow-hidden rounded-md border border-gray-300">
                                <img
                                  src={codImages[order._id].preview}
                                  alt="Bukti COD"
                                  className="h-full w-full object-cover cursor-pointer"
                                  onClick={() =>
                                    openImageProof(codImages[order._id].preview)
                                  }
                                />
                                <button
                                  onClick={() => removeCodImage(order._id)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 shadow-md"
                                  aria-label="Hapus gambar"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </div>
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
                                  order.paymentMethod?.toLowerCase() !== "cod"
                                }
                              />
                              <label
                                htmlFor={`cod-image-${order._id}`}
                                className={`flex flex-col items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
                                  order.paymentMethod?.toLowerCase() !== "cod"
                                    ? "cursor-not-allowed bg-gray-100"
                                    : "cursor-pointer"
                                }`}
                              >
                                <span className="text-xs">
                                  Unggah Bukti COD
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Pilih metode</span>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      <button
                        onClick={() => handleShipOrder(order._id)}
                        className="bg-[#1A9882] text-[#E9FAF7] px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm disabled:opacity-50"
                        disabled={
                          (shippingMethod[order._id] === "resi" &&
                            !resiNumbers[order._id]) ||
                          (shippingMethod[order._id] === "COD" &&
                            !codImages[order._id]?.file) ||
                          !shippingMethod[order._id]
                        }
                      >
                        Kirim
                      </button>
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        title="Lihat Detail Transaksi"
                      >
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#003D47]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold my-4">Pesanan yang Sudah Dikirim</h2>
      {shippedOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Tidak ada pesanan yang sudah dikirim.
        </p>
      ) : (
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="rounded-lg overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full text-left text-gray-700 min-w-[640px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-xs sm:text-sm">
                  <th className="py-3 px-2 sm:p-4">ID</th>
                  <th className="py-3 px-2 sm:p-4">TANGGAL KIRIM</th>
                  <th className="py-3 px-2 sm:p-4">PRODUK</th>
                  <th className="py-3 px-2 sm:p-4">TOTAL HARGA</th>
                  <th className="py-3 px-2 sm:p-4">METODE PENGIRIMAN</th>
                  <th className="py-3 px-2 sm:p-4">NOMOR RESI/BUKTI</th>
                  <th className="py-3 px-2 sm:p-4 text-center">DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {shippedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-xs sm:text-sm hover:bg-gray-100 border-b border-gray-100"
                  >
                    <td className="py-3 px-2 sm:p-4">
                      {order._id?.slice(-6) || "N/A"}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {formatDate(order.updatedAt)}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {getProductNames(order.items)}
                    </td>
                    <td className="py-3 px-2 sm:p-4 whitespace-nowrap">
                      Rp {(order.totalAmount || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {order.shippingMethod || "N/A"}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {order.shippingMethod?.toLowerCase() === "cod" ? (
                        order.codProof ? (
                          <button
                            onClick={() => openImageProof(order.codProof)}
                            className="text-blue-500 hover:underline text-xs"
                          >
                            Lihat Bukti
                          </button>
                        ) : (
                          "N/A"
                        )
                      ) : (
                        order.trackingNumber || "N/A"
                      )}
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        title="Lihat Detail Transaksi"
                      >
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#003D47]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageProof}
        >
          <div className="relative max-w-2xl max-h-[80vh] p-4">
            <img
              src={previewImage}
              alt="Preview Bukti"
              className="max-h-[calc(80vh-2rem)] max-w-full object-contain rounded"
            />
            <button
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-1.5 hover:bg-red-700"
              onClick={closeImageProof}
              aria-label="Tutup preview"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedOrdersTable;
