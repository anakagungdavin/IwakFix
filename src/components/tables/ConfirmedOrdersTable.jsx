// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const ConfirmedOrdersTable = () => {
//   const [confirmedOrders, setConfirmedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resiNumbers, setResiNumbers] = useState({}); // Menyimpan nomor resi tiap pesanan

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchConfirmedOrders();
//   }, []);

//   const fetchConfirmedOrders = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/orders/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const filteredOrders = response.data.filter((order) => order.status === "Paid");
//       setConfirmedOrders(filteredOrders);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch confirmed orders");
//       setLoading(false);
//     }
//   };

//   const handleResiChange = (orderId, value) => {
//     setResiNumbers((prev) => ({ ...prev, [orderId]: value }));
//   };

//   const handleShipOrder = async (orderId) => {
//     const resiNumber = resiNumbers[orderId];
//     if (!resiNumber) {
//       alert("Harap masukkan nomor resi sebelum mengirim pesanan.");
//       return;
//     }

//     try {
//       await axios.put(
//         `${API_URL}/api/orders/${orderId}/status`,
//         { status: "Shipped", trackingNumber: resiNumber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Reset nomor resi setelah sukses
//       setResiNumbers((prev) => ({ ...prev, [orderId]: "" }));
//       fetchConfirmedOrders();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to ship order");
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
//   };

//   return (
//     <div className="w-full">
//       <h2 className="text-lg font-semibold mb-4">Pesanan yang Perlu Dikirim</h2>

//       {confirmedOrders.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">Tidak ada pesanan yang menunggu pengiriman.</p>
//       ) : (
//         <div className="relative bg-white rounded-lg shadow-sm">
//           <div className="rounded-lg overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             <table className="w-full text-left text-gray-700 min-w-[640px]">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-600 text-xs sm:text-sm">
//                   <th className="py-3 px-2 sm:p-4">ID</th>
//                   <th className="py-3 px-2 sm:p-4">TANGGAL</th>
//                   <th className="py-3 px-2 sm:p-4">PRODUK</th>
//                   <th className="py-3 px-2 sm:p-4">JUMLAH</th>
//                   <th className="py-3 px-2 sm:p-4">TOTAL HARGA</th>
//                   <th className="py-3 px-2 sm:p-4">NOMOR RESI</th>
//                   <th className="py-3 px-2 sm:p-4 text-center">KIRIM</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {confirmedOrders.map((order) => (
//                   <tr key={order._id} className="text-xs sm:text-sm hover:bg-gray-100 border-b border-gray-100">
//                     <td className="py-3 px-2 sm:p-4">{order._id}</td>
//                     <td className="py-3 px-2 sm:p-4">{formatDate(order.createdAt)}</td>
//                     <td className="py-3 px-2 sm:p-4">{order.items.map((item) => item.product.name).join(", ")}</td>
//                     <td className="py-3 px-2 sm:p-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
//                     <td className="py-3 px-2 sm:p-4 whitespace-nowrap">Rp {order.totalAmount.toLocaleString("id-ID")}</td>
//                     <td className="py-3 px-2 sm:p-4">
//                       <input
//                         type="text"
//                         placeholder="Masukkan nomor resi"
//                         value={resiNumbers[order._id] || ""}
//                         onChange={(e) => handleResiChange(order._id, e.target.value)}
//                         className="border border-gray-300 p-2 rounded w-full text-xs sm:text-sm"
//                       />
//                     </td>
//                     <td className="py-3 px-2 sm:p-4 text-center">
//                       <button
//                         onClick={() => handleShipOrder(order._id)}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
//                       >
//                         Kirim
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConfirmedOrdersTable;
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ConfirmedOrdersTable = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resiNumbers, setResiNumbers] = useState({});
  const [showModal, setShowModal] = useState(false); // State untuk modal

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
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: "Shipped", trackingNumber: resiNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResiNumbers((prev) => ({ ...prev, [orderId]: "" }));
      fetchConfirmedOrders();
      setShowModal(true); // Tampilkan modal setelah berhasil
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ship order");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
                        className="bg-[#1A9882]  text-[#E9FAF7] px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
                      >
                        Kirim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal untuk konfirmasi pengiriman */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Pesanan Telah Dikirim
            </h3>
            <p className="text-gray-600">
              Pesanan telah berhasil dikirim dengan nomor resi.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedOrdersTable;
