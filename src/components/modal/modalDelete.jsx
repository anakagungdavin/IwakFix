import { AiOutlineExclamationCircle } from "react-icons/ai";

const DeleteModal = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <AiOutlineExclamationCircle className="text-red-500 text-5xl mb-2" />
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Apakah Anda yakin ingin menghapus produk? <strong>{item?.name}</strong>
          </h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Produk yang Anda buat akan hilang dan tidak dapat dikembalikan.
          </p>
        </div>
        
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onClose}
          >
            Tidak
          </button>
          <button
            className="px-4 py-2 bg-[#FEECEE] text-[#EB3D4D] rounded-md"
            onClick={onConfirm}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
