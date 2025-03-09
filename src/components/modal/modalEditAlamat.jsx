import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CancelModal from "./modalCancel";
import SimpanModal from "./modalBerhasilSimpan";

export default function EditAddressModal({ isOpen, onClose, address }) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const navigate = useNavigate();
  const [isSimpanOpen, setIsSimpanOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const handlePostalCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPostalCode(value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSimpanOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Alamat</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input type="text" className="w-full border rounded p-2" defaultValue={address?.name} />
          </div>
          <div>
            <label className="block text-sm font-medium">No Telepon</label>
            <input type="tel" className="w-full border rounded p-2" defaultValue={address?.phone} />
          </div>
          <div>
            <label className="block text-sm font-medium">Nama Jalan, Gedung, No. Rumah</label>
            <input type="text" className="w-full border rounded p-2" defaultValue={address?.street} />
          </div>
          <div>
            <label className="block text-sm font-medium">Kode Pos</label>
            <input 
              type="text"
              className="w-full border rounded p-2 appearance-none"
              onChange={handlePostalCodeChange}
              maxLength="6" 
              defaultValue={address?.postalCode} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Provinsi</label>
            <input type="text" className="w-full border rounded p-2" defaultValue={address?.province} />
          </div>
          <div>
            <label className="block text-sm font-medium">Kota</label>
            <input type="text" className="w-full border rounded p-2" defaultValue={address?.city} />
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked={address?.isPrimary} />
            <label className="text-sm">Atur sebagai Alamat Utama</label>
          </div>
          <div className="flex justify-between mt-4">
            <button 
              type="button" 
              onClick={() => setIsCancelOpen(true)} 
              className="bg-gray-300 text-black hover:bg-[#F0F1F3] transition px-4 py-2 rounded">
              Batal
            </button>
            <button 
              type="submit" 
              className="bg-[#003D47] text-white hover:bg-[#4a6265] transition px-4 py-2 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
      
      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => {
            setIsCancelOpen(false); 
            onClose(); 
        }}
      />

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
