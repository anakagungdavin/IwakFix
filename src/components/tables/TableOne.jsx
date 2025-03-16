// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import TableProcessor from "./TableProcessor";
// import ModalConfig from "../modal/ModalConfig";

// const TableOne = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//         console.log("Fetching from:", `${apiUrl}/api/orders/all`);
//         console.log("Token:", token);
//         const response = await axios.get(`${apiUrl}/api/orders/all`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const orders = response.data;
//         console.log("Orders from API:", orders);

//         // Tentukan rentang 7 hari terakhir
//         const today = new Date();
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - 6);
//         console.log("Today:", today.toISOString());
//         console.log("Week Start:", weekStart.toISOString());

//         // Filter pesanan untuk 7 hari terakhir
//         const recentOrders = orders.filter((order) => {
//           const orderDate = new Date(order.createdAt);
//           const isRecent = orderDate >= weekStart && orderDate <= today;
//           console.log(
//             `Order ID: ${order._id}, Created At: ${
//               order.createdAt
//             }, Parsed: ${orderDate.toISOString()}, Is Recent: ${isRecent}`
//           );
//           return isRecent;
//         });
//         console.log("Recent Orders (7 days):", recentOrders);

//         // Log semua pesanan jika tidak ada yang recent
//         if (recentOrders.length === 0) {
//           console.log("All Order Dates for Reference:");
//           orders.forEach((order) =>
//             console.log(
//               `${order._id}: ${new Date(order.createdAt).toISOString()}`
//             )
//           );
//         }

//         // Memetakan data ke format tabel
//         const mappedData = recentOrders.map((order) => {
//           const firstItem = order.items && order.items[0] ? order.items[0] : {};
//           const product = firstItem.product || {};

//           return {
//             id: order._id || "N/A",
//             date: order.createdAt
//               ? new Date(order.createdAt).toLocaleDateString("en-US", {
//                   day: "2-digit",
//                   month: "long",
//                   year: "numeric",
//                 })
//               : "N/A",
//             total: order.totalAmount
//               ? `Rp ${order.totalAmount.toLocaleString("id-ID")}`
//               : "Rp 0",
//             orderDetails: {
//               orderId: order._id || "N/A",
//               orderDate: order.createdAt
//                 ? new Date(order.createdAt).toLocaleDateString("en-US", {
//                     day: "2-digit",
//                     month: "long",
//                     year: "numeric",
//                   })
//                 : "N/A",
//               productImage: product.images?.[0] || "/path/to/default/image.jpg",
//               productName: product.name || "Unknown Product",
//               quantity:
//                 order.items
//                   ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
//                   .toString() || "0",
//               pricePerUnit: firstItem.price
//                 ? `Rp ${firstItem.price.toLocaleString("id-ID")}`
//                 : "Rp 0",
//               recipient: order.user?.name || "Unknown",
//               phone: order.user?.phoneNumber || "N/A",
//               address: order.shippingAddress || "N/A",
//               paymentMethod: order.paymentMethod || "N/A",
//               itemsTotal: order.items
//                 ? `Rp ${order.items
//                     .reduce(
//                       (sum, item) =>
//                         sum + (item.quantity || 0) * (item.price || 0),
//                       0
//                     )
//                     .toLocaleString("id-ID")}`
//                 : "Rp 0",
//               shippingCost: "Rp 0",
//               discount: order.discount
//                 ? `Rp ${order.discount.toLocaleString("id-ID")}`
//                 : "Rp 0",
//               totalAmount: order.totalAmount
//                 ? `Rp ${order.totalAmount.toLocaleString("id-ID")}`
//                 : "Rp 0",
//             },
//           };
//         });

//         console.log("Mapped Table Data:", mappedData);
//         setTableData(mappedData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError(err.response?.data?.message || "Failed to fetch orders");
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchOrders();
//     } else {
//       setError("No authentication token found");
//       setLoading(false);
//     }
//   }, [token]);

//   const columns = [
//     { header: "ID", key: "id" },
//     { header: "Tanggal", key: "date" },
//     { header: "Total", key: "total" },
//     {
//       header: "Actions",
//       key: "actions",
//       renderAction: (row, onActionClick) => (
//         <button
//           className="text-blue-500 hover:underline"
//           onClick={() => onActionClick(row)}
//         >
//           Lihat Detail
//         </button>
//       ),
//     },
//   ];

//   const handleActionClick = (row) => {
//     setSelectedOrder(row.orderDetails);
//     setModalOpen(true);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (tableData.length === 0) return <p>No transactions in the last 7 days.</p>;

//   return (
//     <div>
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold text-gray-800 text-left">
//           Transaksi Terakhir
//         </h2>
//       </div>
//       <TableProcessor
//         columns={columns}
//         data={tableData}
//         onActionClick={handleActionClick}
//       />
//       <ModalConfig
//         isOpen={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         orderDetails={selectedOrder}
//       />
//     </div>
//   );
// };

// export default TableOne;

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        console.log("Fetching from:", `${apiUrl}/api/orders/all`);
        console.log("Token:", token);
        const response = await axios.get(`${apiUrl}/api/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orders = response.data;
        console.log("Orders from API:", orders);

        // Tentukan rentang 7 hari terakhir
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        console.log("Today:", today.toISOString());
        console.log("Week Start:", weekStart.toISOString());

        // Filter pesanan untuk 7 hari terakhir
        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const isRecent = orderDate >= weekStart && orderDate <= today;
          console.log(
            `Order ID: ${order._id}, Created At: ${
              order.createdAt
            }, Parsed: ${orderDate.toISOString()}, Is Recent: ${isRecent}`
          );
          return isRecent;
        });
        console.log("Recent Orders (7 days):", recentOrders);

        // Log semua pesanan jika tidak ada yang recent
        if (recentOrders.length === 0) {
          console.log("All Order Dates for Reference:");
          orders.forEach((order) =>
            console.log(
              `${order._id}: ${new Date(order.createdAt).toISOString()}`
            )
          );
        }

        // Memetakan data ke format tabel
        const mappedData = recentOrders.map((order) => {
          const firstItem = order.items && order.items[0] ? order.items[0] : {};
          const product = firstItem.product || {};

          return {
            id: order._id || "N/A",
            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            total: order.totalAmount
              ? `Rp ${order.totalAmount.toLocaleString("id-ID")}`
              : "Rp 0",
            orderDetails: {
              orderId: order._id || "N/A",
              orderDate: order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A",
              productImage: product.images?.[0] || "/path/to/default/image.jpg",
              productName: product.name || "Unknown Product",
              quantity:
                order.items
                  ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
                  .toString() || "0",
              pricePerUnit: firstItem.price
                ? `Rp ${firstItem.price.toLocaleString("id-ID")}`
                : "Rp 0",
              recipient: order.user?.name || "Unknown",
              phone: order.user?.phoneNumber || "N/A",
              address: order.shippingAddress || "N/A",
              paymentMethod: order.paymentMethod || "N/A",
              itemsTotal: order.items
                ? `Rp ${order.items
                    .reduce(
                      (sum, item) =>
                        sum + (item.quantity || 0) * (item.price || 0),
                      0
                    )
                    .toLocaleString("id-ID")}`
                : "Rp 0",
              shippingCost: "Rp 0",
              discount: order.discount
                ? `Rp ${order.discount.toLocaleString("id-ID")}`
                : "Rp 0",
              totalAmount: order.totalAmount
                ? `Rp ${order.totalAmount.toLocaleString("id-ID")}`
                : "Rp 0",
            },
          };
        });

        console.log("Mapped Table Data:", mappedData);
        setTableData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
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
  if (tableData.length === 0) return <p>No transactions in the last 7 days.</p>;

  return (
    <div>
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
