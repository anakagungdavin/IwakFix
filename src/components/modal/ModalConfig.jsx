import React from "react";

const ModalConfig = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null;

  console.log("Modal Order Details:", orderDetails);

  const {
    orderId,
    orderDate,
    products,
    recipient,
    phone,
    address,
    paymentMethod,
    itemsTotal,
    shippingCost,
    discount,
    totalAmount,
    status,
    proofOfPayment,
  } = orderDetails;

  const getStatusColorClass = (status) => {
    if (status === "Delivered" || status === "Paid") return "text-[#1A9882]";
    if (status === "Pending" || status === "Processing")
      return "text-[#F86624]";
    if (status === "Cancelled") return "text-[#EB3D4D]";
    return "";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 bg-black/15 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-11/12 max-w-xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10"
          onClick={onClose}
        >
          ×
        </button>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="text-sm text-gray-500">{orderDate}</span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-gray-100">
            <span
              className={`text-sm font-medium ${getStatusColorClass(status)}`}
            >
              {status}
            </span>
          </div>

          <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
            <h3 className="font-medium text-gray-700">Produk</h3>
            {products &&
              products.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex items-center space-x-4 py-2 border-b border-gray-100 last:border-0"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.quantity} x {product.formattedPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Rp{" "}
                      {(
                        product.quantity * product.discountedPrice
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div>
            <h3 className="font-semibold">Shipping Information</h3>
            <p className="text-sm">
              <span className="font-medium">{recipient}</span>{" "}
              <span className="text-gray-500">({phone})</span>
            </p>
            <p className="text-sm text-gray-500">{address}</p>
          </div>

          <div>
            <h3 className="font-semibold">Payment Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Payment Method:</span>
                <span className="text-sm font-medium">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Items Total:</span>
                <span className="text-sm font-medium">{itemsTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping Cost:</span>
                <span className="text-sm font-medium">{shippingCost}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span className="text-sm">Discount:</span>
                <span className="text-sm font-medium">{discount}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{totalAmount}</span>
              </div>
            </div>
          </div>

          {proofOfPayment ? (
            <div className="mt-4">
              <h3 className="font-semibold">Bukti Pembayaran</h3>
              <div className="relative mt-2">
                <img
                  src={proofOfPayment}
                  alt="Bukti Pembayaran"
                  className="w-full h-auto max-h-64 object-contain rounded-md border"
                  onError={(e) => console.log("Image load error:", e)}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="font-semibold">Bukti Pembayaran</h3>
              <p className="text-sm text-gray-500">
                Tidak ada bukti pembayaran.
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500">Order ID: {orderId}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfig;
