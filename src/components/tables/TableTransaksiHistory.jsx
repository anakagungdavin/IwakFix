import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ModalConfig from "../modal/ModalConfig"; // Pastikan path ini benar

const TableHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const token = localStorage.getItem("token");

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await axios.get(`${apiUrl}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil riwayat pesanan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    } else {
      setError("Token autentikasi tidak ditemukan.");
      setLoading(false);
    }
  }, [token]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  const sortedOrders = useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        let valueA, valueB;
        const getValue = (obj, path) => {
          const keys = path.split(".");
          let current = obj;
          for (let key of keys) {
            if (current === null || typeof current === "undefined")
              return undefined;
            current = current[key];
          }
          return current;
        };
        switch (sortConfig.key) {
          case "id":
            valueA = a._id;
            valueB = b._id;
            break;
          case "customer":
            valueA = getValue(a, "user.name") || "Unknown";
            valueB = getValue(b, "user.name") || "Unknown";
            break;
          // PERUBAHAN: Menambahkan case sorting untuk produk
          case "products":
            valueA = a.items?.[0]?.product?.name || ""; // Sort berdasarkan produk pertama
            valueB = b.items?.[0]?.product?.name || "";
            break;
          case "date":
            valueA = new Date(a.createdAt || 0);
            valueB = new Date(b.createdAt || 0);
            break;
          case "total":
            valueA = a.totalAmount || 0;
            valueB = b.totalAmount || 0;
            break;
          case "paymentMethod":
            valueA = a.paymentMethod || "N/A";
            valueB = b.paymentMethod || "N/A";
            break;
          case "status":
            valueA = a.status || "Pending";
            valueB = b.status || "Pending";
            break;
          default:
            return 0;
        }
        if (typeof valueA === "string" && typeof valueB === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="ml-1 text-gray-600 dark:text-gray-300">↑</span>
    ) : (
      <span className="ml-1 text-gray-600 dark:text-gray-300">↓</span>
    );
  };

  const getStatusColorClass = (status) => {
    if (!status) return "text-gray-500 dark:text-gray-400";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "delivered" || lowerStatus === "paid")
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    if (lowerStatus === "pending" || lowerStatus === "processing")
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    if (lowerStatus === "shipped")
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    if (lowerStatus === "cancelled")
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    return "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700";
  };

  if (loading)
    return (
      <div className="p-6 text-center bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">
        Memuat riwayat transaksi...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center bg-gray-100 dark:bg-gray-900 min-h-screen text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Riwayat Semua Transaksi
      </h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
        <table className="w-full min-w-[1000px] border-collapse text-left text-gray-700 dark:text-gray-300">
          {" "}
          {/* Menambah min-w */}
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              {/* PERUBAHAN: Menambahkan kolom 'Produk' di header */}
              {[
                { label: "ID", key: "id" },
                { label: "Customer", key: "customer" },
                { label: "Produk", key: "products" }, // <-- Kolom baru
                { label: "Tanggal", key: "date" },
                { label: "Total", key: "total" },
                { label: "Metode Bayar", key: "paymentMethod" },
                { label: "Status", key: "status" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="p-3 sm:p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                  onClick={() => requestSort(col.key)}
                >
                  {col.label}
                  <SortIcon columnKey={col.key} />
                </th>
              ))}
              <th className="p-3 sm:p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 ? (
              <tr>
                {/* PERUBAHAN: Menyesuaikan colSpan menjadi 8 */}
                <td
                  colSpan="8" // <-- Diubah dari 7 menjadi 8
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada riwayat transaksi ditemukan.
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="p-3 sm:p-4 whitespace-nowrap font-mono text-xs">
                    ...{order._id.slice(-8)}
                  </td>
                  <td className="p-3 sm:p-4 font-medium text-black dark:text-white">
                    {order.user?.name || "Tidak diketahui"}
                  </td>

                  {/* PERUBAHAN: Menambahkan cell untuk menampilkan produk */}
                  <td className="p-3 sm:p-4 max-w-[250px] whitespace-normal">
                    {order.items && order.items.length > 0
                      ? order.items
                          .map(
                            (item) =>
                              `${item.product?.name || "Produk Dihapus"} (x${
                                item.quantity
                              })`
                          )
                          .join(", ")
                      : "Tidak ada produk"}
                  </td>

                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap font-medium text-black dark:text-white">
                    Rp {(order.totalAmount || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 sm:p-4">{order.paymentMethod || "N/A"}</td>
                  <td className="p-3 sm:p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                        order.status
                      )}`}
                    >
                      {order.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
                      onClick={() => openModal(order)}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalConfig
        isOpen={isOpen}
        onClose={closeModal}
        transaction={selectedOrder}
      />
    </div>
  );
};

export default TableHistory;
