import React from "react";

const ModalConfig = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null;

  const {
    orderId,
    orderDate,
    productImage,
    productName,
    quantity,
    pricePerUnit,
    recipient,
    phone,
    address,
    paymentMethod,
    itemsTotal,
    shippingCost,
    discount,
    totalAmount,
  } = orderDetails;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 bg-black/15 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-11/12 max-w-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="text-sm text-gray-500">{orderDate}</span>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-4">
              {productImage ? (
                <img
                  src={productImage} // Local image or database source
                  alt={productName}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md" />
              )}
              <div>
                <p className="font-medium">{productName}</p>
                <p className="text-sm text-gray-500">
                  {quantity} x {pricePerUnit}
                </p>
              </div>
            </div>
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
          <button
            className="bg-yellow-500 text-white rounded-md px-4 py-2 w-full hover:bg-yellow-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfig;