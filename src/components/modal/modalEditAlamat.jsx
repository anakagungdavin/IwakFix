// modalEditAlamat.jsx
import { useState, useEffect } from "react";
// Hapus useNavigate jika tidak digunakan langsung di sini
import CancelModal from "./modalCancel";
import SimpanModal from "./modalBerhasilSimpan";

export default function EditAddressModal({
  isOpen,
  onClose,
  address,
  // Hapus setAddresses dan addresses jika tidak digunakan lagi secara langsung
  // setAddresses,
  // addresses,
  onAddressUpdated, // Prop baru dari Alamat.jsx
}) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  // const navigate = useNavigate(); // Hapus jika tidak digunakan
  const [isSimpanOpen, setIsSimpanOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (isOpen && address) {
      // Pastikan modal terbuka dan address ada
      setRecipientName(address.recipientName || "");
      setPhoneNumber(address.phoneNumber || "");
      setStreetAddress(address.streetAddress || "");
      setPostalCode(address.postalCode || "");
      setProvince(address.province || "");
      setCity(address.city || "");
    } else if (!isOpen) {
      // Reset jika modal ditutup
      setRecipientName("");
      setPhoneNumber("");
      setStreetAddress("");
      setPostalCode("");
      setProvince("");
      setCity("");
    }
  }, [isOpen, address]); // Re-run jika isOpen atau address berubah

  const handlePostalCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPostalCode(value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!address?._id) {
      alert("Error: Alamat tidak valid untuk diedit.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiUrl}/api/users/address/${address._id}`,
        {
          method: "PUT",
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
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update address");
      }

      // Tidak perlu update state 'addresses' di sini lagi
      // setAddresses(
      //   addresses.map((addr) => (addr._id === address._id ? result.data : addr))
      // );
      setIsSimpanOpen(true);
    } catch (err) {
      console.error("Failed to update address:", err);
      alert(`Gagal memperbarui alamat: ${err.message}`);
    }
  };

  const handleConfirmSimpan = async () => {
    setIsSimpanOpen(false);
    if (onAddressUpdated) {
      await onAddressUpdated(); // Panggil callback untuk refresh data di parent
    }
    onClose(); // Tutup modal edit alamat
    // navigate("/profile?tab=address"); // Navigasi sudah ditangani oleh onClose di parent jika perlu
  };

  const handleCancelAndClose = () => {
    setIsCancelOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Alamat</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium">
              Nama Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Nama Lengkap Penerima"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              No Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              placeholder="No Telepon Penerima"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Nama Jalan, Gedung, No. Rumah{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Detail Alamat Lengkap"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Kode Pos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded p-2 appearance-none"
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
            <label className="block text-sm font-medium">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Provinsi"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Kota/Kabupaten"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              className="bg-gray-300 text-black hover:bg-gray-400 transition px-4 py-2 rounded"
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
        message="Apakah Anda yakin ingin membatalkan perubahan alamat?"
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
      />

      <SimpanModal
        isOpen={isSimpanOpen}
        onClose={handleConfirmSimpan}
        title="Berhasil"
        message="Alamat berhasil diperbarui!"
        confirmText="OK"
      />
    </div>
  );
}
