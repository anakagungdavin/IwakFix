import React from "react";
import { useNavigate } from "react-router-dom";

const InformasiCust = ({ userData }) => {
  const navigate = useNavigate();

  if (!userData) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="w-full">
      {/* Avatar - responsive sizing */}
      <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto md:mx-0">
        <img
          src={userData.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />
      </div>

      {/* Form - responsive padding and layout */}
      <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
        <div>
          <label className="block text-gray-700 text-sm md:text-base font-medium">
            Nama
          </label>
          <input
            type="text"
            value={userData.name || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm md:text-base font-medium">
            No Telephone
          </label>
          <input
            type="text"
            value={userData.phoneNumber || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm md:text-base font-medium">
            Email
          </label>
          <input
            type="email"
            value={userData.email || ""}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm md:text-base font-medium">
            Gender
          </label>
          <input
            type="text"
            value={userData.gender || "Lainnya"}
            readOnly
            className="w-full p-2 md:p-3 text-sm md:text-base border rounded-lg bg-gray-100 cursor-default"
          />
        </div>
      </div>

      {/* Edit Profile Button - responsive positioning and sizing */}
      <div className="mt-4 md:mt-6 text-center md:text-right">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-[#003D47] text-white hover:bg-[#4a6265] transition px-4 md:px-6 py-2 text-sm md:text-base rounded-lg flex items-center gap-2 mx-auto md:ml-auto"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default InformasiCust;
