// src/components/Modals/PasswordReminderModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, KeyRound, X } from "lucide-react"; // Menggunakan Lucide React Icons

const PasswordReminderModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToChangePassword = () => {
    onClose(); // Tutup modal dulu
    navigate("/profile?tab=change-password");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <ShieldAlert className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Peringatan Keamanan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Untuk menjaga keamanan akun Anda, kami menyarankan Anda untuk
          mengganti password secara berkala. Password Anda belum diubah dalam 6
          bulan terakhir.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoToChangePassword}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-[#003D47] text-white rounded-md hover:bg-[#002c33] focus:outline-none focus:ring-2 focus:ring-[#003D47] focus:ring-opacity-50 transition-colors font-medium"
          >
            <KeyRound className="w-5 h-5 mr-2" />
            Ganti Password Sekarang
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors font-medium"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReminderModal;
