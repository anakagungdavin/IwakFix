import React, { useState } from "react";

const ModalView = ({ isOpen, onClose, item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const {
    _id,
    name,
    description,
    images = [],
    price,
    discount,
    stock,
    type = { jenis: [], size: [] },
    weight,
    dimensions = { length: 0, height: 0 },
    isPublished,
    stocks = [],
  } = item;

  // Calculate total stock from stocks array if available
  const totalStock = Array.isArray(stocks)
    ? stocks.reduce((sum, stock) => sum + (stock.stock || 0), 0)
    : stock || 0;

  // Function to handle next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to handle previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-11/12 max-w-xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          ×
        </button>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Details</h2>

          {/* Image Carousel */}
          {images.length > 0 && (
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-md"
              />
              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#F0F1F3] text-[#667085] rounded-full p-2 hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousImage();
                    }}
                  >
                    ←
                  </button>
                  <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#F0F1F3] text-[#667085] rounded-full p-2 hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                  >
                    →
                  </button>
                </>
              )}
              {/* Image Counter */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white rounded-full px-3 py-1 text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          )}

          {/* Product Information */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-4">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md" />
              )}
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="font-semibold">Product Information</h3>
            <p className="text-sm">
              Jenis:{" "}
              <span className="font-medium">{type.jenis.join(", ")}</span>
            </p>
            <p className="text-sm">
              Ukuran:{" "}
              <span className="font-medium">{type.size.join(", ")}</span>
            </p>
            <p className="text-sm">
              Berat: <span className="font-medium">{weight} kg</span>
            </p>
            <p className="text-sm">
              Dimensi (Panjang x Tinggi):{" "}
              <span className="font-medium">
                {dimensions.length} x {dimensions.height} cm
              </span>
            </p>
            <p className="text-sm">
              Stock: <span className="font-medium">{totalStock}</span>
            </p>
            <p className="text-sm">
              Status:{" "}
              <span className={isPublished ? "text-green-500" : "text-red-500"}>
                {isPublished ? "Published" : "Unpublished"}
              </span>
            </p>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold">Pricing</h3>
            {Array.isArray(stocks) && stocks.length > 0 ? (
              <div className="space-y-2">
                {stocks.map((stock, index) => (
                  <div key={index} className="text-sm">
                    <p>
                      Jenis: {stock.jenis}, Ukuran: {stock.size}
                    </p>
                    <p>
                      Price:{" "}
                      <span className="font-medium">Rp {stock.price}</span>
                    </p>
                    <p className="text-red-500">
                      Discount:{" "}
                      <span className="font-medium">{stock.discount}%</span>
                    </p>
                    <p>
                      Total Price:{" "}
                      <span className="font-medium">
                        Rp {stock.price - (stock.price * stock.discount) / 100}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">No pricing data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalView;
