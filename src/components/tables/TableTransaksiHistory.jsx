import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalConfig from "../modal/ModalConfig";

const TableHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const token = localStorage.getItem("token");

  const fetchAllOrders = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(`${apiUrl}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

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

    // Konversi shippingAddress menjadi string
    const formatShippingAddress = (address) => {
      if (!address) return "Alamat tidak tersedia";
      return (
        [
          address.streetAddress,
          address.city,
          address.province,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(", ") || "Alamat tidak tersedia"
      );
    };

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
      address: formatShippingAddress(order.shippingAddress), // Menggunakan string hasil konversi
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

  // Sorting function
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        let valueA, valueB;

        switch (sortConfig.key) {
          case "customer":
            valueA = a.user?.name || "Unknown";
            valueB = b.user?.name || "Unknown";
            break;
          case "date":
            valueA = new Date(a.createdAt);
            valueB = new Date(b.createdAt);
            break;
          case "total":
            valueA = a.totalAmount;
            valueB = b.totalAmount;
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

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  // Sort request handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort icon component
  const SortIcon = ({ isActive, direction }) => {
    if (!isActive) return <span className="ml-1 text-gray-300">↕</span>;
    return direction === "asc" ? (
      <span className="ml-1 text-gray-600">↑</span>
    ) : (
      <span className="ml-1 text-gray-600">↓</span>
    );
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto p-6">
      <table className="w-full border-collapse text-left text-gray-700">
        <thead>
          <tr className="border-b border-gray-300 text-gray-500 text-sm">
            <th className="p-4">ID</th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort("customer")}
            >
              CUSTOMER
              <SortIcon
                isActive={sortConfig.key === "customer"}
                direction={sortConfig.direction}
              />
            </th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort("date")}
            >
              TANGGAL
              <SortIcon
                isActive={sortConfig.key === "date"}
                direction={sortConfig.direction}
              />
            </th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort("total")}
            >
              TOTAL
              <SortIcon
                isActive={sortConfig.key === "total"}
                direction={sortConfig.direction}
              />
            </th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort("paymentMethod")}
            >
              METODE BAYAR
              <SortIcon
                isActive={sortConfig.key === "paymentMethod"}
                direction={sortConfig.direction}
              />
            </th>
            <th
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort("status")}
            >
              STATUS
              <SortIcon
                isActive={sortConfig.key === "status"}
                direction={sortConfig.direction}
              />
            </th>
            <th className="p-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                Tidak ada riwayat transaksi
              </td>
            </tr>
          ) : (
            sortedOrders.map((order) => (
              <tr key={order._id} className="border-b border-gray-200 text-sm">
                <td className="p-4">{order._id}</td>
                <td className="p-4">{order.user?.name || "Unknown"}</td>
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

export default TableHistory;
