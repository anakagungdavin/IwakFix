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
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-6">User tidak ditemukan</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-3xl font-semibold">
          {user.name?.[0] || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name || "Unknown User"}</h1>
          <p className="text-sm text-gray-500">{user.email || "No Email"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
        <div>
          <h2 className="font-medium text-lg mb-2">Personal Information</h2>
          <p>
            <span className="font-semibold">Contact Number:</span>{" "}
            {user.phoneNumber || "Not Provided"}
          </p>
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {user.gender || "Not Specified"}
          </p>
        </div>
        <div>
          <h2 className="font-medium text-lg mb-2">Address Details</h2>
          {user.address ? (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Recipient:</span>{" "}
                {user.address.recipientName}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user.address.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">Street Address:</span>{" "}
                {user.address.streetAddress}
              </p>
              <p>
                <span className="font-semibold">City:</span> {user.address.city}
              </p>
              <p>
                <span className="font-semibold">Province:</span>{" "}
                {user.address.province}
              </p>
              <p>
                <span className="font-semibold">Postal Code:</span>{" "}
                {user.address.postalCode}
              </p>
            </div>
          ) : (
            <p>No Address Provided</p>
          )}
        </div>
        <div>
          <h2 className="font-medium text-lg mb-2">Order Summary</h2>
          <p>
            <span className="font-semibold">Total Orders:</span>{" "}
            {user.orderSummary.totalOrders}
          </p>
          <p>
            <span className="font-semibold">Completed:</span>{" "}
            {user.orderSummary.completed}
          </p>
          <p>
            <span className="font-semibold">In Progress:</span>{" "}
            {user.orderSummary.processing}
          </p>
          <p>
            <span className="font-semibold">Canceled:</span>{" "}
            {user.orderSummary.canceled}
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">Transaction History</h2>
        <CustomerTransactionHistory customerId={id} />
      </div>
    </div>
  );
};

export default UserProfile;
