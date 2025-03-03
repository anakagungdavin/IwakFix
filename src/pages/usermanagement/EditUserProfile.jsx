import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {};

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User Data:", formData);
    navigate("/customers");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-3xl font-semibold">
          {formData.name[0] || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
        <div className="col-span-3">
          <h2 className="font-medium text-lg mb-2">Personal Information</h2>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="col-span-3 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-[#E9FAF7] text-[#1A9882] rounded-md hover:bg-blue-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
