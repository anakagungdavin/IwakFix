import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomerTransactionHistory from "../../components/tables/CustomerTransactionHistory";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        setError("ID customer tidak valid");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
        const response = await axios.get(
          `${apiUrl}/api/users/customers/${id}/summary`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data profil");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Perubahan: Styling untuk state loading, error, dan not found
  if (loading)
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  if (!user)
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        User tidak ditemukan
      </div>
    );

  return (
    // Perubahan: Latar belakang utama halaman
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* User header */}
      <div className="flex flex-col sm:flex-row sm:space-x-6 items-center sm:items-start text-center sm:text-left">
        {/* Perubahan: Warna avatar */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl md:text-3xl font-semibold mb-3 sm:mb-0">
          {user.name?.[0] || "?"}
        </div>
        <div>
          {/* Perubahan: Warna teks nama dan email */}
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white">
            {user.name || "Unknown User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email || "No Email"}
          </p>
        </div>
      </div>

      {/* User details */}
      {/* Perubahan: Warna background dan teks pada kartu detail */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
          <div className="space-y-2">
            <h2 className="font-medium text-lg mb-2 text-black dark:text-white">
              Personal Information
            </h2>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Contact Number:
              </span>{" "}
              {user.phoneNumber || "Not Provided"}
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Gender:
              </span>{" "}
              {user.gender || "Not Specified"}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-lg mb-2 text-black dark:text-white">
              Address Details
            </h2>
            {user.address ? (
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Recipient:
                  </span>{" "}
                  {user.address.recipientName}
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Phone:
                  </span>{" "}
                  {user.address.phoneNumber}
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Street Address:
                  </span>{" "}
                  {user.address.streetAddress}
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    City:
                  </span>{" "}
                  {user.address.city}
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Province:
                  </span>{" "}
                  {user.address.province}
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Postal Code:
                  </span>{" "}
                  {user.address.postalCode}
                </p>
              </div>
            ) : (
              <p>No Address Provided</p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-lg mb-2 text-black dark:text-white">
              Order Summary
            </h2>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Total Orders:
              </span>{" "}
              {user.orderSummary.totalOrders}
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Completed:
              </span>{" "}
              {user.orderSummary.completed}
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                In Progress:
              </span>{" "}
              {user.orderSummary.processing}
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Canceled:
              </span>{" "}
              {user.orderSummary.canceled}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-lg font-bold mb-2 md:mb-4 text-black dark:text-white">
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <CustomerTransactionHistory customerId={id} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
