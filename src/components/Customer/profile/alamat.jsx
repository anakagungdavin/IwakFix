// alamat.jsx
import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
// Hapus useNavigate jika tidak digunakan langsung di sini
import EditAddressModal from "../../modal/modalEditAlamat";
import AddressModal from "../../modal/modalTambahAlamat";
import DeleteModal from "../../modal/modalDelete";

const Alamat = ({ userData, onDataUpdate }) => {
  // Terima onDataUpdate
  // const navigate = useNavigate(); // Hapus jika tidak digunakan
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState(userData?.addresses || []);

  useEffect(() => {
    // Update local addresses state hanya jika userData.addresses benar-benar berubah
    // Ini penting untuk menghindari loop re-render yang tidak perlu jika onDataUpdate dipanggil
    if (
      userData?.addresses &&
      JSON.stringify(userData.addresses) !== JSON.stringify(addresses)
    ) {
      setAddresses(userData.addresses);
    }
  }, [userData]); // Hanya re-run jika userData berubah

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (address) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAddress?._id) return; // Pastikan selectedAddress ada
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(
        `${apiUrl}/api/users/address/${selectedAddress._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      // Panggil onDataUpdate untuk me-refresh data user dari parent
      if (onDataUpdate) {
        await onDataUpdate(); // Tunggu hingga data di-fetch ulang
      }
      setIsDeleteOpen(false);
      setSelectedAddress(null); // Reset selected address
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert(`Gagal menghapus alamat: ${err.message}`);
    }
  };

  const handleAddressAdded = async () => {
    if (onDataUpdate) {
      await onDataUpdate();
    }
  };

  const handleAddressEdited = async () => {
    if (onDataUpdate) {
      await onDataUpdate();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsAddOpen(true)}
        className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-[#003D47] dark:bg-[#FFBC00] text-white dark:text-black hover:bg-[#4a6265] dark:hover:bg-[#e6a800] transition rounded-md text-sm md:text-base"
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Tambah Alamat
      </button>
      <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address._id}
              className="flex flex-col md:flex-row md:justify-between md:items-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-2 md:mb-0">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                  {address.recipientName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                  {address.streetAddress}, {address.city}, {address.province},{" "}
                  {address.postalCode}
                </p>
              </div>
              <div className="flex gap-2 justify-end md:justify-start">
                <button
                  onClick={() => handleEditClick(address)}
                  className="flex items-center gap-1 bg-[#fdfbe7] dark:bg-yellow-900/30 text-[#ff9d00] dark:text-yellow-400 px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-md hover:bg-yellow-400 dark:hover:bg-yellow-800/50 transition text-xs md:text-sm"
                >
                  <Pencil size={12} className="md:w-4 md:h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(address)}
                  className="flex items-center gap-1 bg-[#FEECEE] dark:bg-red-900/30 text-[#EB3D4D] dark:text-red-400 px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-md hover:bg-red-300 dark:hover:bg-red-800/50 transition text-xs md:text-sm"
                >
                  <Trash2 size={12} className="md:w-4 md:h-4" /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-900 dark:text-white">
            Tidak ada alamat yang tersedia.
          </p>
        )}
      </div>
      {isEditOpen && ( // Render modal hanya jika isEditOpen true
        <EditAddressModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          address={selectedAddress}
          onAddressUpdated={handleAddressEdited} // Prop baru untuk callback
        />
      )}
      {isAddOpen && ( // Render modal hanya jika isAddOpen true
        <AddressModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAddressAdded={handleAddressAdded} // Prop baru untuk callback
        />
      )}
      {isDeleteOpen &&
        selectedAddress && ( // Render modal hanya jika isDeleteOpen dan selectedAddress ada
          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedAddress(null); // Reset selected address on close
            }}
            onConfirm={confirmDelete}
            item={{ name: selectedAddress.recipientName, type: "Alamat" }} // Sesuaikan dengan item prop
            message={`Apakah Anda yakin ingin menghapus alamat untuk "${selectedAddress.recipientName}"?`}
          />
        )}
    </div>
  );
};

export default Alamat;
