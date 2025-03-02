import React from "react";
import { useLocation } from "react-router-dom";
import TableHistory from "../../components/tables/TableTransaksiHistory";

const UserProfile = () => {
  const location = useLocation();
  const { user } = location.state;

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-3xl font-semibold">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
        <div>
          <h2 className="font-medium">Personal Information</h2>
          <p>Contact Number: {user.phone}</p>
          <p>Gender: {user.gender || "Not Specified"}</p>
        </div>
        <div>
          <h2 className="font-medium">Address</h2>
          <p>{user.address || "No Address Provided"}</p>
        </div>
        <div>
          <h2 className="font-medium">Order Summary</h2>
          <p>Total Orders: 150</p>
          <p>Completed: 140</p>
          <p>Canceled: 10</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold">Transaction History</h2>
        <TableHistory/>
      </div>
    </div>
  );
};

export default UserProfile;