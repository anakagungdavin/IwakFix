import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    recipientName: "",
    addressPhoneNumber: "", // Untuk phoneNumber di addresses
    streetAddress: "",
    postalCode: "",
    province: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch data user saat komponen dimount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        setError("ID customer tidak valid");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
        const response = await axios.get(
          `${apiUrl}/api/users/customers/${id}/summary`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = response.data.data;
        console.log("Data dari server:", userData);

        // Isi formData dengan data dari server
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          recipientName: userData.address?.recipientName || "",
          addressPhoneNumber: userData.address?.phoneNumber || "",
          streetAddress: userData.address?.streetAddress || "",
          postalCode: userData.address?.postalCode || "",
          province: userData.address?.province || "",
          city: userData.address?.city || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data profil");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const token = localStorage.getItem("token");

      // Format data untuk dikirim ke server
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        addresses:
          formData.streetAddress ||
          formData.recipientName ||
          formData.addressPhoneNumber
            ? [
                {
                  recipientName: formData.recipientName,
                  phoneNumber: formData.addressPhoneNumber,
                  streetAddress: formData.streetAddress,
                  postalCode: formData.postalCode,
                  province: formData.province,
                  city: formData.city,
                  isPrimary: true,
                },
              ]
            : [],
      };

      console.log(
        "Data yang akan dikirim:",
        JSON.stringify(updatedData, null, 2)
      );

      const response = await axios.put(
        `${apiUrl}/api/users/profile/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response dari server:", response.data);
      navigate(`/customers/view/${id}`); // Kembali ke UserProfile
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui data");
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-3xl font-semibold">
          {formData.name[0] || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit User Profile</h1>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg"
      >
        <div className="col-span-3">
          <h2 className="font-medium text-lg mb-2">Personal Information</h2>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="col-span-3">
          <h2 className="font-medium text-lg mb-2 mt-4">Address Information</h2>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={formData.streetAddress} // Wajib jika ada streetAddress
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Address Phone Number
          </label>
          <input
            type="text"
            name="addressPhoneNumber"
            value={formData.addressPhoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={formData.streetAddress} // Wajib jika ada streetAddress
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={formData.streetAddress} // Wajib jika ada streetAddress
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Province
          </label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={formData.streetAddress} // Wajib jika ada streetAddress
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={formData.streetAddress} // Wajib jika ada streetAddress
          />
        </div>

        <div className="col-span-3 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
            disabled={submitLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#E9FAF7] text-[#1A9882] rounded-md hover:bg-blue-600"
            disabled={submitLoading}
          >
            {submitLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
