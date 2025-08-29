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
    addressPhoneNumber: "",
    streetAddress: "",
    postalCode: "",
    province: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

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
        const userData = response.data.data;

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
    setFormChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const token = localStorage.getItem("token");

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

      await axios.put(`${apiUrl}/api/users/profile/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate(`/customers/view/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui data");
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      if (
        window.confirm("Perubahan belum disimpan. Yakin ingin membatalkan?")
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // Perubahan: Styling untuk state loading di dark mode
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
        <div className="animate-pulse text-lg text-black dark:text-white">
          Loading...
        </div>
      </div>
    );

  // Perubahan: Styling untuk state error di dark mode
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-500/30">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Error: {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );

  return (
    // Perubahan: Latar belakang utama halaman
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section with Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-6">
          {/* Perubahan: Warna avatar */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl md:text-3xl font-semibold mb-4 sm:mb-0">
            {formData.name[0] || "?"}
          </div>
          <div className="text-center sm:text-left">
            {/* Perubahan: Warna teks judul dan subjudul */}
            <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white">
              Edit User Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.email}
            </p>
          </div>
        </div>

        {error && (
          // Perubahan: Styling untuk pesan error inline
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Perubahan: Warna background form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
        >
          {/* Personal Information Section */}
          {/* Perubahan: Warna border */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Perubahan: Warna background header section */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h2 className="font-medium text-lg text-gray-700 dark:text-gray-200">
                Personal Information
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Field: Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                {/* Field: Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                {/* Field: Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h2 className="font-medium text-lg text-gray-700 dark:text-gray-200">
                Address Information
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* All address fields share the same dark mode styling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required={formData.streetAddress}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address Phone Number
                  </label>
                  <input
                    type="text"
                    name="addressPhoneNumber"
                    value={formData.addressPhoneNumber}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required={formData.streetAddress}
                  />
                </div>
                <div className="lg:col-span-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required={formData.streetAddress}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required={formData.streetAddress}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required={formData.streetAddress}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 shadow-sm transition-colors"
              disabled={submitLoading}
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md hover:bg-green-200 shadow-sm transition-colors dark:bg-green-900/40 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-700 dark:hover:text-white"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan..
                </span>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfile;
