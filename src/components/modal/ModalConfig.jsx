import React from "react";

const ModalConfig = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const {
    _id,
    createdAt,
    items,
    recipientName,
    phoneNumber,
    fullAddress,
    paymentMethod,
    subtotalDisplay,
    shippingCostDisplay,
    discountDisplay,
    totalAmountDisplay,
    status,
    proofOfPayment,
    codProof,
  } = transaction;

  const orderIdToDisplay = _id || "N/A";
  const orderDateToDisplay = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tanggal tidak tersedia";

  const recipientToDisplay =
    recipientName || transaction.shippingAddress?.recipientName || "N/A";
  const phoneToDisplay =
    phoneNumber || transaction.shippingAddress?.phoneNumber || "N/A";
  const addressToDisplay =
    fullAddress ||
    (transaction.shippingAddress
      ? [
          transaction.shippingAddress.streetAddress,
          transaction.shippingAddress.city,
          transaction.shippingAddress.province,
          transaction.shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : "Alamat tidak tersedia");

  const itemsTotalToDisplay =
    subtotalDisplay ||
    `Rp ${(
      (transaction.totalAmount || 0) -
      (transaction.shippingCost || 0) +
      (transaction.items?.reduce(
        (sum, item) =>
          sum +
          (item.price - (item.discountedPrice || item.price)) * item.quantity,
        0
      ) || 0)
    ).toLocaleString("id-ID")}`;

  const shippingCostToDisplay =
    shippingCostDisplay ||
    `Rp ${(transaction.shippingCost || 0).toLocaleString("id-ID")}`;

  const totalDiscountFromItems =
    transaction.items?.reduce(
      (sum, item) =>
        sum +
        (item.price - (item.discountedPrice || item.price)) * item.quantity,
      0
    ) || 0;
  const discountToDisplay =
    discountDisplay ||
    (totalDiscountFromItems > 0
      ? `Rp ${totalDiscountFromItems.toLocaleString("id-ID")}`
      : "Rp 0");

  const totalAmountToDisplay =
    totalAmountDisplay ||
    `Rp ${(transaction.totalAmount || 0).toLocaleString("id-ID")}`;

  const proofToDisplay = proofOfPayment || codProof;

  // Perubahan: Fungsi ini sekarang mengembalikan kelas background dan teks untuk kedua mode
  const getStatusPillClass = (currentStatus) => {
    if (!currentStatus)
      return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
    const lowerStatus = currentStatus.toLowerCase();
    if (lowerStatus === "delivered" || lowerStatus === "paid")
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (lowerStatus === "pending" || lowerStatus === "processing")
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    if (lowerStatus === "shipped")
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (lowerStatus === "cancelled")
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Perubahan: Styling untuk kontainer modal di dark mode */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-11/12 max-w-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl z-10"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          ×
        </button>

        <div className="space-y-5">
          <div className="text-center sm:text-left">
            {/* Perubahan: Warna teks judul */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detail Pesanan
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {orderDateToDisplay}
            </span>
          </div>

          <div className="flex justify-center sm:justify-start">
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusPillClass(
                status
              )}`}
            >
              {status || "N/A"}
            </span>
          </div>

          {/* Bagian Produk */}
          <div className="border dark:border-gray-700 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-50 dark:scrollbar-track-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Produk Dipesan
            </h3>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.product?._id || item.name || index}
                  className="flex items-start sm:items-center space-x-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <img
                    src={
                      item.image ||
                      item.product?.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.name || item.product?.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border dark:border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white truncate">
                      {item.name ||
                        item.product?.name ||
                        "Produk Tidak Diketahui"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} {item.satuan || "unit"} x Rp{" "}
                      {(item.price || 0).toLocaleString("id-ID")}
                      {item.discount > 0 && (
                        <span className="ml-1 text-xs text-red-500 dark:text-red-400 line-through">
                          (Normal Rp{" "}
                          {(
                            item.price / (1 - item.discount / 100) || 0
                          ).toLocaleString("id-ID")}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Jenis: {item.jenis || "N/A"}, Ukuran: {item.size || "N/A"}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
                      Rp{" "}
                      {(
                        (item.quantity || 0) *
                        (item.discountedPrice || item.price || 0)
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Tidak ada produk dalam pesanan ini.
              </p>
            )}
          </div>

          {/* Informasi Pengiriman */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              Informasi Pengiriman
            </h3>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
              <p>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {recipientToDisplay}
                </span>{" "}
                ({phoneToDisplay})
              </p>
              <p>{addressToDisplay}</p>
            </div>
          </div>

          {/* Detail Pembayaran */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              Rincian Pembayaran
            </h3>
            <div className="mt-1 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Metode Pembayaran:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {paymentMethod || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal Item:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {itemsTotalToDisplay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Ongkos Kirim:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {shippingCostToDisplay}
                </span>
              </div>
              {parseFloat(
                discountToDisplay.replace(/[^0-9,-]+/g, "").replace(",", ".")
              ) > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span className="text-gray-600 dark:text-gray-400">
                    Diskon:
                  </span>
                  <span className="font-medium">{discountToDisplay}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-gray-200 dark:border-gray-700 mt-2">
                <span className="text-gray-800 dark:text-white">
                  Total Pembayaran:
                </span>
                <span className="text-gray-800 dark:text-white">
                  {totalAmountToDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Bukti Pembayaran */}
          {proofToDisplay && (
            <div className="mt-3">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                {codProof && transaction.paymentMethod?.toLowerCase() === "cod"
                  ? "Bukti Serah Terima (COD)"
                  : "Bukti Pembayaran"}
              </h3>
              <div className="relative mt-2 border dark:border-gray-600 rounded-md overflow-hidden">
                <img
                  src={proofToDisplay}
                  alt={
                    codProof &&
                    transaction.paymentMethod?.toLowerCase() === "cod"
                      ? "Bukti COD"
                      : "Bukti Pembayaran"
                  }
                  className="w-full h-auto max-h-72 object-contain"
                />
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400 dark:text-gray-500 pt-3 text-center border-t border-gray-200 dark:border-gray-700">
            ID Pesanan: {orderIdToDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfig;
