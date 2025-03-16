import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ModalImage = ({ isOpen, onClose, orderData, onApprove, onReject }) => {
  if (!isOpen || !orderData) return null;

  const {
    _id,
    createdAt,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    proofOfPayment,
  } = orderData;

  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const productNames = items
    .map((item) => item.product?.name || "Unknown Product")
    .join(", ");
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Konversi shippingAddress menjadi string
  const shippingAddressString = shippingAddress
    ? `${shippingAddress.recipientName}, ${shippingAddress.phoneNumber}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}`
    : "Alamat tidak tersedia";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bukti Pembayaran</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Detail Pembayaran */}
        <div className="mb-4 text-sm text-gray-700">
          <h4 className="font-semibold text-gray-900 mb-2">Detail Pesanan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <p>
                <strong>ID Pesanan:</strong> {_id}
              </p>
              <p>
                <strong>Tanggal:</strong> {formatDate(createdAt)}
              </p>
              <p>
                <strong>Produk:</strong> {productNames}
              </p>
              <p>
                <strong>Jumlah:</strong> {totalQuantity}
              </p>
            </div>
            <div>
              <p>
                <strong>Total Harga:</strong> Rp{" "}
                {totalAmount.toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Alamat Pengiriman:</strong> {shippingAddressString}
              </p>
              <p>
                <strong>Metode Pembayaran:</strong> {paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Bukti Pembayaran */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Gambar Bukti Pembayaran
          </h4>
          {proofOfPayment ? (
            <img
              src={proofOfPayment}
              alt="Bukti Pembayaran"
              className="w-full h-auto max-h-96 object-contain rounded-md border"
            />
          ) : (
            <p className="text-center text-gray-500 py-10">
              Tidak ada bukti pembayaran tersedia
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onApprove(_id)}
            className="bg-[#1A9882] text-[#E9FAF7] hover:bg-green-600 px-3 py-1 rounded text-xs flex items-center"
            title="Setujui Pesanan"
          >
            <CheckIcon className="h-4 w-4 inline mr-1" />
            Setujui
          </button>
          <button
            onClick={() => onReject(_id)}
            className="bg-[#EB3D4D] text-[#FEECEE] hover:bg-red-600 px-3 py-1 rounded text-xs flex items-center"
            title="Tolak Pesanan"
          >
            <XMarkIcon className="h-4 w-4 inline mr-1" />
            Tolak
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;
