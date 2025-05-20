import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditAddressModal from "../../modal/modalEditAlamat";
import AddressModal from "../../modal/modalTambahAlamat";
import DeleteModal from "../../modal/modalDelete";

const Alamat = ({ userData }) => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState(userData?.addresses || []);

  // Debugging
  console.log("userData in Alamat:", userData);
  console.log("addresses in Alamat:", addresses);

  useEffect(() => {
    setAddresses(userData?.addresses || []);
  }, [userData]);

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (address) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

      setAddresses(
        addresses.filter((addr) => addr._id !== selectedAddress._id)
      );
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsAddOpen(true)}
        className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md text-sm md:text-base"
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
              className="flex flex-col md:flex-row md:justify-between md:items-center p-3 md:p-4 bg-white rounded-lg shadow-md border"
            >
              <div className="mb-2 md:mb-0">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  {address.recipientName}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  {address.streetAddress}
                </p>
              </div>
              <div className="flex gap-2 justify-end md:justify-start">
                <button
                  onClick={() => handleEditClick(address)}
                  className="flex items-center gap-1 bg-[#fdfbe7] text-[#ff9d00] px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-md hover:bg-yellow-400 transition text-xs md:text-sm"
                >
                  <Pencil size={12} className="md:w-4 md:h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(address)}
                  className="flex items-center gap-1 bg-[#FEECEE] text-[#EB3D4D] px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-md hover:bg-red-300 transition text-xs md:text-sm"
                >
                  <Trash2 size={12} className="md:w-4 md:h-4" /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Tidak ada alamat yang tersedia.</p>
        )}
      </div>
      <EditAddressModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        address={selectedAddress}
        setAddresses={setAddresses}
        addresses={addresses}
      />
      <AddressModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        setAddresses={setAddresses}
        addresses={addresses}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        item={selectedAddress}
      />
    </div>
  );
};

export default Alamat;
