import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";

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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Pilih Alamat
        </h2>
        {loading && (
          <p
            key="loading"
            className="text-center text-gray-900 dark:text-white"
          >
            Memuat...
          </p>
        )}
        {error && (
          <p key="error" className="text-center text-red-500 dark:text-red-400">
            {error}
          </p>
        )}

        <div key="address-list" className="max-h-60 overflow-auto">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                onClick={() => onSelectAddress(address)}
              >
                <p className="font-bold text-gray-900 dark:text-white">
                  {address.recipientName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {address.phoneNumber}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {address.streetAddress}, {address.city}, {address.province},{" "}
                  {address.postalCode}
                </p>
              </div>
            ))
          ) : (
            <p
              key="no-address"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Tidak ada alamat tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeAddress;
