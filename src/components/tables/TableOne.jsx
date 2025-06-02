import React, { useState, useEffect } from "react";
import axios from "axios";
import TableProcessor from "./TableProcessor"; // Pastikan path ini benar
import ModalConfig from "../modal/ModalConfig"; // Pastikan path ini benar

const TableOne = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${apiUrl}/api/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orders = response.data;

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6); // 7 hari termasuk hari ini
        weekStart.setHours(0, 0, 0, 0); // Set ke awal hari
        today.setHours(23, 59, 59, 999); // Set ke akhir hari

        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= weekStart && orderDate <= today;
        });

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

        const mappedData = recentOrders.map((order) => {
          const totalDiscount = order.items
            ? order.items.reduce(
                (sum, item) =>
                  sum +
                  (item.price - (item.discountedPrice || item.price)) *
                    (item.quantity || 1),
                0
              )
            : 0;

          // Subtotal sebelum diskon dan ongkir
          const subtotalItems = order.items
            ? order.items.reduce(
                (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
                0
              )
            : 0;

          return {
            id: order._id || "N/A", // Untuk tampilan di tabel utama
            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                  // Ubah ke format id-ID
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            total: order.totalAmount // totalAmount dari backend sudah termasuk ongkir dan diskon
              ? `Rp ${order.totalAmount.toLocaleString("id-ID")}`
              : "Rp 0",
            // orderDetails akan diteruskan ke ModalConfig
            orderDetails: {
              _id: order._id, // Kirim semua field dari order yang mungkin dibutuhkan modal
              createdAt: order.createdAt,
              status: order.status,
              items: order.items
                ? order.items.map((item) => ({
                    // Pastikan struktur item sesuai dengan yang diharapkan modal
                    // Jika ModalConfig menggunakan struktur yang sama dengan TransactionDetailModal
                    product: item.product, // Kirim objek produk terpopulate
                    name: item.product?.name || "Produk Tidak Dikenal", // Fallback jika product tidak ada
                    quantity: item.quantity || 1,
                    price: item.price || 0, // Harga satuan asli
                    discountedPrice: item.discountedPrice || item.price, // Harga satuan setelah diskon
                    jenis: item.jenis || "N/A", // Pastikan ini ada di item
                    size: item.size || "N/A", // Pastikan ini ada di item
                    satuan: item.satuan || "N/A", // <<< TAMBAHKAN SATUAN DI SINI
                    // Anda bisa menambahkan field lain yang dibutuhkan modal, misal image
                    image: item.product?.images?.[0] || "/placeholder.png",
                  }))
                : [],
              totalAmount: order.totalAmount || 0,
              shippingAddress: order.shippingAddress || {},
              shippingCost: order.shippingCost || 0,
              paymentMethod: order.paymentMethod || "N/A",
              trackingNumber: order.trackingNumber,
              proofOfPayment: order.proofOfPayment,
              codProof: order.codProof,
              // Data tambahan yang mungkin dibutuhkan oleh ModalConfig (sesuaikan dengan kebutuhan ModalConfig)
              recipientName:
                order.shippingAddress?.recipientName ||
                order.user?.name ||
                "Tidak diketahui",
              phoneNumber:
                order.shippingAddress?.phoneNumber ||
                order.user?.phoneNumber ||
                "N/A",
              fullAddress: formatShippingAddress(order.shippingAddress),
              subtotalDisplay: `Rp ${subtotalItems.toLocaleString("id-ID")}`, // Untuk tampilan
              discountDisplay: `Rp ${totalDiscount.toLocaleString("id-ID")}`, // Untuk tampilan
              shippingCostDisplay: `Rp ${(
                order.shippingCost || 0
              ).toLocaleString("id-ID")}`, // Untuk tampilan
              totalAmountDisplay: `Rp ${(order.totalAmount || 0).toLocaleString(
                "id-ID"
              )}`, // Untuk tampilan
            },
          };
        });
        setTableData(mappedData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Gagal mengambil data pesanan");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError("Token autentikasi tidak ditemukan");
      setLoading(false);
    }
  }, [token]);

  const columns = [
    {
      header: "ID Pesanan",
      key: "id",
      renderCell: (value) => value?.slice(-6) || "N/A",
    }, // Tampilkan 6 digit terakhir ID
    { header: "Tanggal", key: "date" },
    { header: "Total", key: "total" },
    {
      header: "Aksi",
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
    // Sekarang row.orderDetails memiliki struktur yang lebih mirip dengan objek 'transaction'
    // yang diharapkan oleh modal-modal sebelumnya.
    console.log("Order details for modal:", row.orderDetails);
    setSelectedOrder(row.orderDetails);
    setModalOpen(true);
  };

  if (loading)
    return <div className="text-center p-4">Memuat data transaksi...</div>;
  if (error)
    return <p className="text-red-500 text-center p-4">Error: {error}</p>;
  if (tableData.length === 0 && !loading)
    return (
      <p className="text-center p-4">
        Tidak ada transaksi dalam 7 hari terakhir.
      </p>
    );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 text-left">
          Transaksi Terakhir (7 Hari)
        </h2>
      </div>
      <TableProcessor
        columns={columns}
        data={tableData}
        onActionClick={handleActionClick}
      />
      {/* Pastikan ModalConfig menerima prop yang sesuai, misal 'transaction' atau 'order' */}
      {/* Jika ModalConfig mengharapkan prop 'orderDetails', maka sudah benar */}
      {/* Jika ModalConfig mengharapkan prop 'transaction', ubah nama prop di bawah */}
      <ModalConfig
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(null); // Reset selected order
        }}
        transaction={selectedOrder} // Menggunakan 'transaction' agar konsisten dengan modal lain
        // Jika ModalConfig secara spesifik menggunakan orderDetails:
        // orderDetails={selectedOrder}
      />
    </div>
  );
};

export default TableOne;
