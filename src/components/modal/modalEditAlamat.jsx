import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelModal from "./modalCancel";
import SimpanModal from "./modalBerhasilSimpan";

export default function EditAddressModal({
  isOpen,
  onClose,
  address,
  setAddresses,
  addresses,
}) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const navigate = useNavigate();
  const [isSimpanOpen, setIsSimpanOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (address) {
      setRecipientName(address.recipientName || "");
      setPhoneNumber(address.phoneNumber || "");
      setStreetAddress(address.streetAddress || "");
      setPostalCode(address.postalCode || "");
      setProvince(address.province || "");
      setCity(address.city || "");
      setIsPrimary(address.isPrimary || false);
    }
  }, [address]);

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
            isPrimary,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update address");
      }

      // Update the addresses state with the updated address
      setAddresses(
        addresses.map((addr) => (addr._id === address._id ? result.data : addr))
      );
      setIsSimpanOpen(true);
    } catch (err) {
      console.error("Failed to update address:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Alamat</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">No Telepon</label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Nama Jalan, Gedung, No. Rumah
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kode Pos</label>
            <input
              type="text"
              className="w-full border rounded p-2 appearance-none"
              value={postalCode}
              onChange={handlePostalCodeChange}
              maxLength="6"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Provinsi</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kota</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
            <label className="text-sm">Atur sebagai Alamat Utama</label>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              className="bg-gray-300 text-black hover:bg-[#F0F1F3] transition px-4 py-2 rounded"
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

      {/* Modal Batal */}
      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => {
          setIsCancelOpen(false);
          onClose();
        }}
      />

      {/* Modal Simpan */}
      <SimpanModal
        isOpen={isSimpanOpen}
        onClose={() => {
          setIsSimpanOpen(false);
          onClose();
          navigate("/profile?tab=address");
        }}
      />
    </div>
  );
}
