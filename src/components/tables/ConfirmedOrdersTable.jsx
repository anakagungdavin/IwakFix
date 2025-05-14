import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TransactionDetailModal from "../modal/modalDetailTransaksi";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ConfirmedOrdersTable = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resiNumbers, setResiNumbers] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState({}); // "resi" or "COD"
  const [codImages, setCodImages] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  const fetchConfirmedOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredOrders = response.data.filter(
        (order) => order.status === "Paid"
      );

      // Initialize shipping method state for each order
      const initialShippingMethods = {};
      filteredOrders.forEach((order) => {
        initialShippingMethods[order._id] = "resi";
      });

      setShippingMethod(initialShippingMethods);
      setConfirmedOrders(filteredOrders);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch confirmed orders"
      );
      setLoading(false);
    }
  };

  const handleResiChange = (orderId, value) => {
    setResiNumbers((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleShippingMethodChange = (orderId, method) => {
    setShippingMethod((prev) => ({
      ...prev,
      [orderId]: method,
    }));
  };

  const handleCodImageUpload = (orderId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCodImages((prev) => ({
          ...prev,
          [orderId]: {
            file: file,
            preview: reader.result,
          },
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
  };

  const handleShipOrder = async (orderId) => {
    const method = shippingMethod[orderId];

    // Validate based on shipping method
    if (method === "resi") {
      const resiNumber = resiNumbers[orderId];
      if (!resiNumber) {
        alert("Harap masukkan nomor resi sebelum mengirim pesanan.");
        return;
      }

      try {
        // Send update request for tracking number
        await axios.put(
          `${API_URL}/api/orders/${orderId}/status`,
          {
            status: "Shipped",
            trackingNumber: resiNumber,
            shippingMethod: "courier",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update orders after success
        updateOrdersAfterShipping(orderId, "Shipped", resiNumber);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to ship order");
      }
    } else if (method === "COD") {
      const codImage = codImages[orderId];
      if (!codImage) {
        alert("Harap unggah bukti COD sebelum mengirim pesanan.");
        return;
      }

      try {
        // Create form data to send image
        const formData = new FormData();
        formData.append("status", "Shipped");
        formData.append("shippingMethod", "COD");
        formData.append("codProof", codImage.file);

        // Send update request with COD proof
        await axios.put(`${API_URL}/api/orders/${orderId}/status`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Update orders after success
        updateOrdersAfterShipping(orderId, "Shipped", null, "COD");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to confirm COD order");
      }
    }
    console.log("Mengirim request:", {
      orderId,
      method: shippingMethod[orderId],
      codImage: codImages[orderId] ? "Ada" : "Tidak ada",
    });
  };

  const updateOrdersAfterShipping = (
    orderId,
    status,
    trackingNumber = null,
    shippingMethodValue = null
  ) => {
    // Update orders list
    const updatedOrders = confirmedOrders.map((order) =>
      order._id === orderId
        ? {
            ...order,
            status: status,
            trackingNumber: trackingNumber,
            shippingMethod: shippingMethodValue,
          }
        : order
    );

    setConfirmedOrders(
      updatedOrders.filter((order) => order.status === "Paid")
    );

    // Reset states
    setResiNumbers((prev) => ({ ...prev, [orderId]: "" }));

    if (codImages[orderId]) {
      removeCodImage(orderId);
    }

    // Find updated order for modal
    const updatedOrder = updatedOrders.find((order) => order._id === orderId);
    setSelectedOrder(updatedOrder);
    setIsModalOpen(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to safely get product names
  const getProductNames = (items) => {
    if (!items || !Array.isArray(items)) return "No products";

    return items
      .map((item) => {
        // Safely check if product exists and has a name
        if (item && item.product && item.product.name) {
          return item.product.name;
        }
        return "Unnamed product";
      })
      .join(", ");
  };

  // Helper function to safely get total quantity
  const getTotalQuantity = (items) => {
    if (!items || !Array.isArray(items)) return 0;

    return items.reduce((sum, item) => {
      // Safely add quantity if it exists
      return (
        sum + (item && typeof item.quantity === "number" ? item.quantity : 0)
      );
    }, 0);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-4">
        <p>Loading confirmed orders...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Pesanan yang Perlu Dikirim</h2>

      {confirmedOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Tidak ada pesanan yang menunggu pengiriman.
        </p>
      ) : (
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="rounded-lg overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full text-left text-gray-700 min-w-[640px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-xs sm:text-sm">
                  <th className="py-3 px-2 sm:p-4">ID</th>
                  <th className="py-3 px-2 sm:p-4">TANGGAL</th>
                  <th className="py-3 px-2 sm:p-4">PRODUK</th>
                  <th className="py-3 px-2 sm:p-4">JUMLAH</th>
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
                    <td className="py-3 px-2 sm:p-4">{order._id || "N/A"}</td>
                    <td className="py-3 px-2 sm:p-4">
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {getProductNames(order.items)}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
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
                            value="resi"
                            name={`shipping-method-${order._id}`}
                            checked={shippingMethod[order._id] === "resi"}
                            onChange={() =>
                              handleShippingMethodChange(order._id, "resi")
                            }
                            className="mr-2"
                          />
                          <span>Kurir</span>
                        </label>
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
                        />
                      ) : (
                        <div className="flex flex-col space-y-2">
                          {codImages[order._id] ? (
                            <div className="relative">
                              <div className="relative h-16 w-24 overflow-hidden rounded-md border border-gray-300">
                                <img
                                  src={codImages[order._id].preview}
                                  alt="Bukti COD"
                                  className="h-full w-full object-cover cursor-pointer"
                                  onClick={() =>
                                    openImagePreview(
                                      codImages[order._id].preview
                                    )
                                  }
                                />
                                <button
                                  onClick={() => removeCodImage(order._id)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
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
                              />
                              <label
                                htmlFor={`cod-image-${order._id}`}
                                className="flex flex-col items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                              >
                                <span className="text-xs">
                                  Unggah Bukti COD
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      <button
                        onClick={() => handleShipOrder(order._id)}
                        className="bg-[#1A9882] text-[#E9FAF7] px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
                      >
                        Kirim
                      </button>
                    </td>
                    <td className="py-3 px-2 sm:p-4 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        title="Lihat Detail Transaksi"
                        aria-label="Lihat Detail Transaksi"
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

      {/* Modal untuk menampilkan detail transaksi */}
      {isModalOpen && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedOrder}
        />
      )}

      {/* Modal for image preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-2xl max-h-[80vh]">
            <button
              className="absolute -top-10 right-0 text-white bg-red-500 rounded-full p-2"
              onClick={closeImagePreview}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedOrdersTable;
