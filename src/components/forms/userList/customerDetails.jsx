import React from "react";

const customerDetails = ({ customer }) => {
  return (
    <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
          {customer.name[0]}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{customer.name}</h2>
          <p className="text-gray-500">{customer.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">Contact Number</p>
          <p className="text-gray-700 font-medium">{customer.phone}</p>
        </div>
        <div>
          <p className="text-gray-500">Gender</p>
          <p className="text-gray-700 font-medium">{customer.gender}</p>
        </div>
        <div>
          <p className="text-gray-500">Address</p>
          <p className="text-gray-700 font-medium">{customer.address}</p>
        </div>
        <div>
          <p className="text-gray-500">Orders Summary</p>
          <p className="text-gray-700 font-medium">
            Total: {customer.totalOrders}, Completed: {customer.completed}, Canceled: {customer.canceled}
          </p>
        </div>
      </div>
    </div>
  );
};

export default customerDetails;
