import React from "react";
import { useNavigate } from "react-router-dom";

const UploadModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose();
    navigate("/product-management"); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="bg-[#003D47] text-[#ffff] rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">📤</div>
        <h2 className="text-2xl font-bold">Upload Berhasil!</h2>
        <p className="mt-2 text-sm">
          Produk Anda telah berhasil diunggah.
        </p>
        <button
          onClick={handleOkClick}
          className="mt-4 px-4 py-2 bg-[#E9FAF7] text-[#1A9882] font-semibold rounded-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
