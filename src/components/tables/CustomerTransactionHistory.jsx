import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalConfig from "../modal/ModalConfig";

const CustomerTransactionHistory = ({ customerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCustomerOrders = async () => {
    if (!customerId) {
      setError("Customer ID tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await axios.get(
        `${apiUrl}/api/users/customers/${customerId}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.data); // Sesuaikan dengan struktur respons dari endpoint
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [customerId]);

  const openModal = (order) => {
    const originalTotal = order.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );

    const totalDiscount = originalTotal - order.totalAmount;

    const products = order.items.map((item) => ({
      id: item.product?._id || item._id,
      name: item.product?.name || "Unknown Product",
      image: item.product?.images?.[0] || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      discountedPrice: item.discountedPrice || item.price,
      formattedPrice: `Rp ${(item.discountedPrice || item.price).toLocaleString(
        "id-ID"
      )}`,
    }));

    const orderDetails = {
      orderId: order._id,
      orderDate: new Date(order.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      products: products,
      totalQuantity: order.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
      recipient: order.user?.name || "Unknown",
      phone: order.user?.phoneNumber || "N/A",
      address: order.shippingAddress || "N/A",
      paymentMethod: order.paymentMethod || "Belum Ditentukan",
      itemsTotal: `Rp ${originalTotal.toLocaleString("id-ID")}`,
      shippingCost: "Rp 0",
      discount: `Rp ${totalDiscount.toLocaleString("id-ID")}`,
      totalAmount: `Rp ${order.totalAmount.toLocaleString("id-ID")}`,
      status: order.status || "Pending",
    };

    setSelectedOrder(orderDetails);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-gray-700">
        <thead>
          <tr className="border-b border-gray-300 text-gray-500 text-sm">
            <th className="p-4">ID</th>
            <th className="p-4">TANGGAL</th>
            <th className="p-4">TOTAL</th>
            <th className="p-4">METODE BAYAR</th>
            <th className="p-4">STATUS</th>
            <th className="p-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                Tidak ada riwayat transaksi untuk customer ini
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-200 text-sm">
                <td className="p-4">{order._id}</td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  Rp {order.totalAmount.toLocaleString("id-ID")}
                </td>
                <td className="p-4">{order.paymentMethod || "N/A"}</td>
                <td className="p-4">
                  <span
                    className={
                      order.status === "Delivered" || order.status === "Paid"
                        ? "text-[#1A9882]"
                        : order.status === "Pending" ||
                          order.status === "Processing"
                        ? "text-[#F86624]"
                        : order.status === "Cancelled"
                        ? "text-[#EB3D4D]"
                        : ""
                    }
                  >
                    {order.status}
                  </span>
                </td>
                <td
                  className="p-4 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => openModal(order)}
                >
                  Lihat Details
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ModalConfig
        isOpen={isOpen}
        onClose={closeModal}
        orderDetails={selectedOrder}
      />
    </div>
  );
};

export default CustomerTransactionHistory;