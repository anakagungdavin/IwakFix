import React from "react";
import { useNavigate } from "react-router-dom";

const InformasiCust = ({ userData }) => {
  const navigate = useNavigate();

  if (!userData) {
    return <div className="text-center py-4 text-gray-900 dark:text-white">No data available</div>;
  }

  return (
    <div className="w-full">
      {/* Avatar */}
      <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto md:mx-0">
        <img
          src={userData.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Form */}
      <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">Nama</label>
          <input
            type="text"
            value={userData.name || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">
            No Telephone
          </label>
          <input
            type="text"
            value={userData.phoneNumber || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">Email</label>
          <input
            type="email"
            value={userData.email || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">Gender</label>
          <input
            type="text"
            value={userData.gender || "Lainnya"}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default"
          />
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-4 md:mt-6 text-center md:text-right">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-[#003D47] dark:bg-[#FFBC00] text-white dark:text-black hover:bg-[#4a6265] dark:hover:bg-[#e6a800] transition px-4 md:px-6 py-2 text-sm md:text-base rounded-lg flex items-center gap-2 mx-auto md:ml-auto"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default InformasiCust;