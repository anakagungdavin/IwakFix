import React from "react";
import { useNavigate } from "react-router-dom";

const InformasiCust = () => {
  const navigate = useNavigate();
    return (
        <div>
            {/* Avatar */}
            <div className="relative w-24 h-24">
                <img
                    src="/path-to-your-image.png"
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                />
                
                {/* <label
                    htmlFor="avatarUpload"
                    className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full border border-white cursor-pointer hover:bg-gray-600 transition"
                >
                    <Pencil size={16} color="white" />
                </label> */}
            </div>

            {/* Form */}
            <div className="mt-6 space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Nama</label>
                    <input
                        type="text"
                        value="Jimin Park"
                        readOnly
                        className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">No Telephone</label>
                    <input
                        type="text"
                        value="000000000000000"
                        readOnly
                        className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        value="robertfox@example.com"
                        readOnly
                        className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Kata Sandi</label>
                    <input
                        type="password"
                        value="password"
                        readOnly
                        className="w-full p-3 border rounded-lg bg-gray-100 cursor-default"
                    />
                </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 text-right">
                <button 
                onClick={() => navigate("/profile/edit")}
                className="bg-[#003D47] text-white hover:bg-[#4a6265] transition  px-6 py-2 rounded-lg flex items-center gap-2">
                   Edit Profile
                </button>
            </div>
        </div>
    );
}

export default InformasiCust;
