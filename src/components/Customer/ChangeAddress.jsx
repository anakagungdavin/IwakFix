// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const ChangeAddress = ({ onClose, onSelectAddress }) => {
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Silakan login terlebih dahulu!");
//           return;
//         }

//         const response = await axios.get(`${API_URL}/api/users/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setAddresses(response.data.data.addresses || []);
//       } catch (err) {
//         setError("Gagal mengambil alamat. Silakan coba lagi.");
//         console.error("Error fetching addresses:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAddresses();
//   }, []);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-xl font-bold mb-4">Pilih Alamat</h2>
//         {loading && <p className="text-center">Memuat...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}
//         <div className="max-h-60 overflow-auto">
//           {addresses.length > 0 ? (
//             addresses.map((address) => (
//               <div
//                 key={address.id}
//                 className="p-4 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => onSelectAddress(address)}
//               >
//                 <p className="font-bold">{address.recipientName}</p>
//                 <p className="text-sm">{address.phoneNumber}</p>
//                 <p className="text-sm">{address.streetAddress}, {address.city}, {address.province}, {address.postalCode}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-sm">Tidak ada alamat tersedia.</p>
//           )}
//         </div>
//         <div className="mt-4 flex justify-end">
//           <button
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
//             onClick={onClose}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangeAddress;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Menggunakan ikon X dari Lucide React

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChangeAddress = ({ onClose, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Silakan login terlebih dahulu!");
          return;
        }

        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAddresses(response.data.data.addresses || []);
      } catch (err) {
        setError("Gagal mengambil alamat. Silakan coba lagi.");
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Tombol "X" di pojok kanan atas */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Pilih Alamat</h2>
        {loading && <p className="text-center">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="max-h-60 overflow-auto">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectAddress(address)}
              >
                <p className="font-bold">{address.recipientName}</p>
                <p className="text-sm">{address.phoneNumber}</p>
                <p className="text-sm">
                  {address.streetAddress}, {address.city}, {address.province},{" "}
                  {address.postalCode}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Tidak ada alamat tersedia.</p>
          )}
        </div>

        {/* <div className="mt-4 flex justify-end">
          <button
            className="bg-[#003D47] text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Save
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ChangeAddress;
