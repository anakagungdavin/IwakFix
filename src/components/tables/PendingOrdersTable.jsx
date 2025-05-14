import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon } from "@heroicons/react/24/solid";
import ModalImage from "../modal/modalImage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PendingOrdersTable = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Ganti menjadi seluruh order
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered = response.data.filter(
        (order) => order.status === "Pending"
      );
      setPendingOrders(filtered);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pending orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleApprove = async (orderId) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Paid" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageModalOpen(false);
      fetchPendingOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve order");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageModalOpen(false);
      fetchPendingOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject order");
    }
  };

  const viewPaymentProof = (order) => {
    console.log("Order Data:", order);
    console.log("Proof of Payment:", order.proofOfPayment);
    setSelectedOrder(order); // Simpan seluruh data order
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
    const length = windowWidth < 640 ? Math.min(maxLength, 20) : maxLength;
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const formatOrderId = (id) => {
    if (windowWidth < 640) {
      return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
    }
    return id;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-4">
        <p>Loading pending orders...</p>
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
      <h2 className="text-lg font-semibold mb-4">Order untuk dikonfirmasi</h2>

      {pendingOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Tidak ada order terpending
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
                  <th className="py-3 px-2 sm:p-4">JUMLAH</th>
                  <th className="py-3 px-2 sm:p-4">TOTAL HARGA</th>
                  <th className="py-3 px-2 sm:p-4 text-center">KONFIRMASI</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => {
                  const totalQuantity = order.items.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  );
                  const productNames = order.items
                    .map((item) => item.product?.name || "Unknown Product")
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
                      <td className="py-3 px-2 sm:p-4">{totalQuantity}</td>
                      <td className="py-3 px-2 sm:p-4 whitespace-nowrap">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-2 sm:p-4 text-center">
                        <button
                          onClick={() => viewPaymentProof(order)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                          title="View Payment Proof"
                          aria-label="View Payment Proof"
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

      <ModalImage
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        orderData={selectedOrder} // Kirim seluruh data order
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default PendingOrdersTable;
