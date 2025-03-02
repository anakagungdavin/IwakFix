import React, { useState, useEffect } from "react";
import axios from "axios";
import TableProcessor from "./TableProcessor";
import ModalConfig from "../modal/ModalConfig";

const TableOne = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch data transaksi dari API untuk 7 hari terakhir
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://iwak.onrender.com/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orders = response.data;

        // Tentukan rentang 7 hari terakhir
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6); // Mulai dari 6 hari sebelum hari ini

        // Filter pesanan untuk 7 hari terakhir
        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= weekStart && orderDate <= today;
        });

        // Memetakan data API ke format tabel
        const mappedData = recentOrders.map((order) => ({
          id: order._id,
          date: new Date(order.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          total: `Rp ${order.totalAmount.toLocaleString("id-ID")}`,
          orderDetails: {
            orderId: order._id,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            productImage:
              order.items[0]?.product?.images?.[0] ||
              "/path/to/default/image.jpg",
            productName: order.items[0]?.product?.name || "Unknown Product",
            quantity: order.items
              .reduce((sum, item) => sum + item.quantity, 0)
              .toString(),
            pricePerUnit: `Rp ${
              order.items[0]?.price.toLocaleString("id-ID") || "0"
            }`,
            recipient: order.user?.name || "Unknown",
            phone: order.user?.phoneNumber || "N/A",
            address: order.shippingAddress || "N/A",
            paymentMethod: order.paymentMethod || "N/A",
            itemsTotal: `Rp ${order.items
              .reduce((sum, item) => sum + item.quantity * item.price, 0)
              .toLocaleString("id-ID")}`,
            shippingCost: "Rp 0", // Ganti jika ada data shippingCost di API
            discount: "Rp 0", // Ganti jika ada data discount di API
            totalAmount: `Rp ${order.totalAmount.toLocaleString("id-ID")}`,
          },
        }));

        setTableData(mappedData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const columns = [
    { header: "ID", key: "id" },
    { header: "Tanggal", key: "date" },
    { header: "Total", key: "total" },
    {
      header: "Actions",
      key: "actions",
      renderAction: (row, onActionClick) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => onActionClick(row)}
        >
          Lihat Detail
        </button>
      ),
    },
  ];

  const handleActionClick = (row) => {
    setSelectedOrder(row.orderDetails);
    setModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Teks "Transaksi Terakhir" di kiri */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 text-left">
          Transaksi Terakhir
        </h2>
      </div>
      <TableProcessor
        columns={columns}
        data={tableData}
        onActionClick={handleActionClick}
      />
      <ModalConfig
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        orderDetails={selectedOrder}
      />
    </div>
  );
};

export default TableOne;