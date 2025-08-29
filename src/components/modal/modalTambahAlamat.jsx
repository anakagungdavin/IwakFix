// modalTambahAlamat.jsx
import { useState, useEffect } from "react";
import CancelModal from "./modalCancel";
import SimpanModal from "./modalBerhasilSimpan";

export default function AddressModal({ isOpen, onClose, onAddressAdded }) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isSimpanOpen, setIsSimpanOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const resetForm = () => {
    setRecipientName("");
    setPhoneNumber("");
    setStreetAddress("");
    setPostalCode("");
    setProvince("");
    setCity("");
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handlePostalCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPostalCode(value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(`${apiUrl}/api/users/address`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientName,
          phoneNumber,
          streetAddress,
          postalCode,
          province,
          city,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to add address");
      }
      setIsSimpanOpen(true);
    } catch (err) {
      console.error("Failed to add address:", err);
      alert(`Gagal menambah alamat: ${err.message}`);
    }
  };

  const handleConfirmSimpan = async () => {
    setIsSimpanOpen(false);
    if (onAddressAdded) {
      await onAddressAdded();
    }
    onClose();
  };

  const handleCancelAndClose = () => {
    setIsCancelOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      {/* Perubahan: Latar belakang modal, dan warna teks utama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Alamat Baru
        </h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            {/* Perubahan: Warna teks label */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Penerima <span className="text-red-500">*</span>
            </label>
            {/* Perubahan: Warna input, border, dan teks di dalamnya */}
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Nama Lengkap Penerima"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              No Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="No Telepon Penerima"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Jalan, Gedung, No. Rumah{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Detail Alamat Lengkap"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kode Pos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 appearance-none placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Kode Pos"
              value={postalCode}
              onChange={handlePostalCodeChange}
              maxLength="6"
              pattern="\d{5,6}"
              title="Kode pos harus terdiri dari 5 atau 6 digit angka."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Provinsi"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Kota/Kabupaten"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between pt-4">
            {/* Perubahan: Warna tombol Batal */}
            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#003D47] text-white hover:bg-[#4a6265] transition px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelAndClose}
        title="Konfirmasi Batal"
        message="Apakah Anda yakin ingin membatalkan penambahan alamat baru?"
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
      />

      <SimpanModal
        isOpen={isSimpanOpen}
        onClose={handleConfirmSimpan}
        title="Berhasil"
        message="Alamat baru berhasil disimpan!"
        confirmText="OK"
      />
    </div>
  );
}
