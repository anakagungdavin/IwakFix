import React from "react";

const ModalConfig = ({ isOpen, onClose, transaction }) => {
  // Menggunakan 'transaction' sebagai prop
  if (!isOpen || !transaction) return null;

  // Destrukturisasi dari 'transaction'
  const {
    _id, // Menggunakan _id dari backend
    createdAt, // Menggunakan createdAt untuk tanggal
    items, // Menggunakan 'items' bukan 'products'
    recipientName, // Diambil dari transaction.shippingAddress.recipientName atau transaction.recipientName
    phoneNumber, // Diambil dari transaction.shippingAddress.phoneNumber atau transaction.phoneNumber
    fullAddress, // Diambil dari transaction.fullAddress (yang kita buat di TableOne)
    paymentMethod,
    subtotalDisplay, // Menggunakan field yang sudah diformat dari TableOne
    shippingCostDisplay,
    discountDisplay,
    totalAmountDisplay,
    status,
    proofOfPayment, // Bisa juga transaction.codProof jika ada
    codProof,
  } = transaction;

  // Fallback jika field dari TableOne.jsx tidak ada, ambil dari transaction langsung
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

  const getStatusColorClass = (currentStatus) => {
    if (!currentStatus) return "text-gray-500"; // Default color
    const lowerStatus = currentStatus.toLowerCase();
    if (lowerStatus === "delivered" || lowerStatus === "paid")
      return "text-[#1A9882]";
    if (lowerStatus === "pending" || lowerStatus === "processing")
      return "text-[#F86624]";
    if (lowerStatus === "shipped") return "text-blue-500"; // Tambah status shipped
    if (lowerStatus === "cancelled") return "text-[#EB3D4D]";
    return "text-gray-700";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" // sedikit blur
      onClick={onClose} // Tutup jika klik di luar modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-11/12 max-w-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        onClick={(e) => e.stopPropagation()} // Jangan tutup jika klik di dalam modal
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl z-10"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          ×
        </button>

        <div className="space-y-5">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-800">
              Detail Pesanan
            </h2>
            <span className="text-sm text-gray-500">{orderDateToDisplay}</span>
          </div>

          <div className="flex justify-center sm:justify-start">
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColorClass(
                status
              )} ${
                status?.toLowerCase() === "delivered" ||
                status?.toLowerCase() === "paid"
                  ? "bg-green-100"
                  : status?.toLowerCase() === "pending" ||
                    status?.toLowerCase() === "processing"
                  ? "bg-yellow-100"
                  : status?.toLowerCase() === "shipped"
                  ? "bg-blue-100"
                  : status?.toLowerCase() === "cancelled"
                  ? "bg-red-100"
                  : "bg-gray-100"
              }`}
            >
              {status || "N/A"}
            </span>
          </div>

          {/* Bagian Produk */}
          <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">Produk Dipesan</h3>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.product?._id || item.name || index} // Gunakan ID produk jika ada
                  className="flex items-start sm:items-center space-x-3 py-2.5 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={
                      item.image ||
                      item.product?.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.name || item.product?.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.onerror = null; // Mencegah loop error
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Tambah min-w-0 untuk text ellipsis */}
                    <p className="font-medium text-sm sm:text-base text-gray-800 truncate">
                      {item.name ||
                        item.product?.name ||
                        "Produk Tidak Diketahui"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {/* MENAMPILKAN SATUAN DI SINI */}
                      {item.quantity} {item.satuan || "unit"}{" "}
                      {/* Fallback ke 'unit' jika satuan N/A */}x Rp{" "}
                      {(item.price || 0).toLocaleString("id-ID")}
                      {item.discount > 0 && (
                        <span className="ml-1 text-xs text-red-500 line-through">
                          (Normal Rp{" "}
                          {(
                            item.price / (1 - item.discount / 100) || 0
                          ).toLocaleString("id-ID")}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Jenis: {item.jenis || "N/A"}, Ukuran: {item.size || "N/A"}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base text-gray-800">
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
              <p className="text-sm text-gray-500 text-center py-4">
                Tidak ada produk dalam pesanan ini.
              </p>
            )}
          </div>

          {/* Informasi Pengiriman */}
          <div>
            <h3 className="text-base font-semibold text-gray-700">
              Informasi Pengiriman
            </h3>
            <div className="mt-1 text-sm text-gray-600 space-y-0.5">
              <p>
                <span className="font-medium">{recipientToDisplay}</span> (
                {phoneToDisplay})
              </p>
              <p>{addressToDisplay}</p>
            </div>
          </div>

          {/* Detail Pembayaran */}
          <div>
            <h3 className="text-base font-semibold text-gray-700">
              Rincian Pembayaran
            </h3>
            <div className="mt-1 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>
                <span className="font-medium text-gray-800">
                  {paymentMethod || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal Item:</span>
                <span className="font-medium text-gray-800">
                  {itemsTotalToDisplay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ongkos Kirim:</span>
                <span className="font-medium text-gray-800">
                  {shippingCostToDisplay}
                </span>
              </div>
              {parseFloat(
                discountToDisplay.replace(/[^0-9,-]+/g, "").replace(",", ".")
              ) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="text-gray-600">Diskon:</span>
                  <span className="font-medium">{discountToDisplay}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-gray-200 mt-2">
                <span className="text-gray-800">Total Pembayaran:</span>
                <span className="text-gray-800">{totalAmountToDisplay}</span>
              </div>
            </div>
          </div>

          {/* Bukti Pembayaran */}
          {proofToDisplay && (
            <div className="mt-3">
              <h3 className="text-base font-semibold text-gray-700">
                {codProof && transaction.paymentMethod?.toLowerCase() === "cod"
                  ? "Bukti Serah Terima (COD)"
                  : "Bukti Pembayaran"}
              </h3>
              <div className="relative mt-2 border rounded-md overflow-hidden">
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

          <div className="text-xs text-gray-400 pt-3 text-center border-t border-gray-200">
            ID Pesanan: {orderIdToDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfig;
