import React from "react";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  // GANTI 'products' menjadi 'items' agar sesuai dengan struktur data dari backend
  const {
    _id,
    createdAt,
    status,
    items = [], // <<< GANTI DI SINI
    totalAmount = 0,
    shippingAddress = {},
    shippingCost = 0,
    paymentMethod,
    trackingNumber = "Belum tersedia",
    orderDate,
  } = transaction;

  // GANTI 'products' menjadi 'items'
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  // GANTI 'products' menjadi 'items'
  const discount = items.reduce(
    (sum, item) =>
      sum + (item.price - (item.discountedPrice || item.price)) * item.quantity,
    0
  );

  const formatPaymentMethod = (method) => {
    switch (
      method?.toLowerCase() // Tambahkan toLowerCase() untuk fleksibilitas
    ) {
      case "bank_jateng":
        return "Bank Jateng";
      case "cod":
        return "Bayar di Tempat (COD)";
      case "qris":
        return "QRIS";
      default:
        return method || "N/A";
    }
  };

  const formatDate = () => {
    // Hapus argumen, gunakan variabel dari scope
    const dateToUse = createdAt || orderDate; // Prioritaskan createdAt dari transaksi
    if (!dateToUse) return "Tanggal tidak tersedia";

    const date = new Date(dateToUse);
    return isNaN(date.getTime())
      ? "Tanggal tidak tersedia"
      : date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-50 bg-gray-900 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
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

        <div className="flex items-center justify-between mt-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-md">
            {status || "N/A"}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-600">{_id || "N/A"}</p>
            <p className="text-sm text-gray-600">{formatDate()}</p>
          </div>
        </div>

        <div className="mt-4 border-b pb-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center gap-4 mb-2 last:mb-0"
              >
                <img
                  src={item.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product?.name || "Produk"}
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.product?.name || "Produk Tidak Tersedia"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity
                      ? `${item.quantity.toLocaleString("id-ID")} ${
                          item.satuan || "kg"
                        }`
                      : "1 kg"}{" "}
                    x Rp{(item.price || 0).toLocaleString("id-ID")}/
                    {item.satuan || "kg"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Jenis: {item.jenis || "N/A"}, Ukuran: {item.size || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-red-600">
              Tidak ada item dalam transaksi ini. Silakan periksa data pesanan.
            </p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-800">
            Info Pengiriman
          </h3>
          <p className="text-sm font-semibold">
            {shippingAddress.recipientName || transaction.recipient || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.phoneNumber || transaction.phone || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.streetAddress
              ? [
                  shippingAddress.streetAddress,
                  shippingAddress.city,
                  shippingAddress.province,
                  shippingAddress.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")
              : transaction.address || "Alamat tidak tersedia"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Nomor Resi:</strong>{" "}
            {trackingNumber &&
            trackingNumber !== "N/A" &&
            trackingNumber !== "Belum tersedia"
              ? trackingNumber
              : "Belum tersedia"}
          </p>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-md font-semibold text-gray-800">
            Rincian Pembayaran
          </h3>
          <div className="dark:text-gray-800 flex justify-between text-sm">
            <span>Metode Pembayaran</span>
            <span className="font-semibold">
              {formatPaymentMethod(paymentMethod)}
            </span>
          </div>
          <div className="dark:text-gray-800 flex justify-between text-sm mt-2">
            <span>Items ({items.length})</span>
            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>
          {discount > 0 && (
            <div className="dark:text-gray-800 flex justify-between text-sm text-red-500 mt-2">
              <span>Discounts</span>
              <span>-Rp{discount.toLocaleString("id-ID")}</span>
            </div>
          )}
          <div className="dark:text-gray-800 flex justify-between text-sm mt-2">
            <span>Ongkir</span>
            <span>Rp{(shippingCost || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="dark:text-gray-800 flex justify-between font-semibold text-lg mt-2">
            <span>Total</span>
            <span>Rp{(totalAmount || 0).toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
