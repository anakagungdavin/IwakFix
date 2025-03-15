import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ModalImage = ({
  isOpen,
  onClose,
  image,
  orderId,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment Proof</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        {image ? (
          <img
            src={image}
            alt="Bukti Bayar"
            className="w-full h-auto max-h-96 object-contain"
          />
        ) : (
          <p className="text-center text-gray-500 py-10">
            No payment proof image available
          </p>
        )}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => onApprove(orderId)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
            title="Approve Order"
          >
            <CheckIcon className="h-4 w-4 inline mr-1" />
            Approve
          </button>
          <button
            onClick={() => onReject(orderId)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
            title="Reject Order"
          >
            <XMarkIcon className="h-4 w-4 inline mr-1" />
            Reject
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;
