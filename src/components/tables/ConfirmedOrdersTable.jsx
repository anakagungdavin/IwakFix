import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon } from "@heroicons/react/24/solid"; // Tambahkan ikon untuk melihat detail
import TransactionDetailModal from "../modal/modalDetailTransaksi"; // Impor modal

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

const ConfirmedOrdersTable = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resiNumbers, setResiNumbers] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null); // State untuk menyimpan pesanan yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal

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

  const handleShipOrder = async (orderId) => {
    const resiNumber = resiNumbers[orderId];
    if (!resiNumber) {
      alert("Harap masukkan nomor resi sebelum mengirim pesanan.");
      return;
    }

    try {
      // Kirim request untuk memperbarui status dan nomor resi
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Shipped", trackingNumber: resiNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Perbarui data pesanan setelah berhasil
      const updatedOrders = confirmedOrders.map((order) =>
        order._id === orderId
          ? { ...order, status: "Shipped", trackingNumber: resiNumber }
          : order
      );
      setConfirmedOrders(
        updatedOrders.filter((order) => order.status === "Paid")
      ); // Hanya tampilkan status "Paid"
      setResiNumbers((prev) => ({ ...prev, [orderId]: "" }));

      // Cari pesanan yang diperbarui untuk ditampilkan di modal
      const updatedOrder = updatedOrders.find((order) => order._id === orderId);
      setSelectedOrder(updatedOrder);
      setIsModalOpen(true); // Buka modal setelah berhasil
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ship order");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
                  <th className="py-3 px-2 sm:p-4">NOMOR RESI</th>
                  <th className="py-3 px-2 sm:p-4 text-center">KIRIM</th>
                  <th className="py-3 px-2 sm:p-4 text-center">DETAIL</th>{" "}
                  {/* Kolom baru untuk detail */}
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-xs sm:text-sm hover:bg-gray-100 border-b border-gray-100"
                  >
                    <td className="py-3 px-2 sm:p-4">{order._id}</td>
                    <td className="py-3 px-2 sm:p-4">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {order.items.map((item) => item.product.name).join(", ")}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </td>
                    <td className="py-3 px-2 sm:p-4 whitespace-nowrap">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-2 sm:p-4">
                      <input
                        type="text"
                        placeholder="Masukkan nomor resi"
                        value={resiNumbers[order._id] || ""}
                        onChange={(e) =>
                          handleResiChange(order._id, e.target.value)
                        }
                        className="border border-gray-300 p-2 rounded w-full text-xs sm:text-sm"
                      />
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
    </div>
  );
};

export default ConfirmedOrdersTable;