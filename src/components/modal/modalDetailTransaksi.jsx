// modalDetailTransaksi.jsx
import React from "react";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  // Ambil data dari transaction
  const {
    _id,
    createdAt,
    status,
    items = [],
    totalAmount = 0,
    shippingAddress = {},
    shippingCost = 0,
    paymentMethod = "N/A",
    trackingNumber = "Belum tersedia", // Default jika tidak ada
  } = transaction;

  // Hitung total item dan subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = items.reduce(
    (sum, item) =>
      sum + (item.price - (item.discountedPrice || item.price)) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-50 bg-gray-900 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-lg"
          >
            ← Kembali
          </button>
          <h2 className="text-lg font-semibold text-yellow-600">
            Detail Transaksi
          </h2>
        </div>

        {/* Status Pesanan */}
        <div className="flex items-center justify-between mt-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-md">
            {status || "N/A"}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-600">{_id || "N/A"}</p>
            <p className="text-sm text-gray-600">
              {new Date(createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Detail Produk */}
        <div className="mt-4 border-b pb-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-2 last:mb-0"
              >
                <img
                  src={item.product?.images?.[0] || "/fish.png"}
                  alt={item.product?.name || "Produk"}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.product?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity || 1} x Rp
                    {(item.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">
              Tidak ada item dalam transaksi ini.
            </p>
          )}
        </div>

        {/* Info Pengiriman */}
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-800">
            Info Pengiriman
          </h3>
          <p className="text-sm font-semibold">
            {shippingAddress.recipientName || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.phoneNumber || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {[
              shippingAddress.streetAddress,
              shippingAddress.city,
              shippingAddress.province,
              shippingAddress.postalCode,
            ]
              .filter(Boolean)
              .join(", ") || "Alamat tidak tersedia"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Nomor Resi:</strong>{" "}
            {trackingNumber !== "N/A" && trackingNumber !== null
              ? trackingNumber
              : "Belum tersedia"}
          </p>
        </div>

        {/* Rincian Pembayaran */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-md font-semibold text-gray-800">
            Rincian Pembayaran
          </h3>
          <div className="flex justify-between text-sm">
            <span>Metode Pembayaran</span>
            <span className="font-semibold">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Items ({items.length})</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-red-500 mt-2">
              <span>Discounts</span>
              <span>-Rp{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-2">
            <span>Ongkir</span>
            <span>Rp{(shippingCost || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Total</span>
            <span>Rp{(totalAmount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
