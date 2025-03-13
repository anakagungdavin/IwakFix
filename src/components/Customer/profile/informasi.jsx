import React from "react";
import { useNavigate } from "react-router-dom";

const InformasiCust = ({ userData }) => {
  const navigate = useNavigate();

  if (!userData) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div>
      {/* Avatar */}
      <div className="relative w-24 h-24">
        <img
          src={userData.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Nama</label>
          <input
            type="text"
            value={userData.name || ""}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            No Telephone
          </label>
          <input
            type="text"
            value={userData.phoneNumber || ""}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={userData.email || ""}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Gender</label>
          <input
            type="text"
            value={userData.gender || "Lainnya"}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 text-right">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-[#003D47] text-white hover:bg-[#4a6265] transition px-6 py-2 rounded-lg flex items-center gap-2"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default InformasiCust;
