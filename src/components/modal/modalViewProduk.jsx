import React from "react";
const ModalView = ({isOpen, onClose, item}) => {
    if (!isOpen || !item ) return null;

    const {
        id,
        name,
        description,
        media,
        price,
        discount,
        stok,
        type: {
            warna,
            ukuran,
            jenis_ikan,
        },
        weight,
        dimensions,
        isPublished,
    } = item;

    return (
        <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-xs"
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
          <h2 className="text-lg font-semibold">Product Details</h2>
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-4">
              {media ? (
                <img
                  src={media}
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
          <div>
            <h3 className="font-semibold">Product Information</h3>
            {/* <p className="text-sm">Tipe: <span className="font-medium">{type}</span></p> */}
            <p className="text-sm">Warna: <span className="font-medium">{warna.join(", ")}</span></p>
            <p className="text-sm">Ukuran: <span className="font-medium">{ukuran.join(", ")}</span></p>
            <p className="text-sm">Jenis Ikan: <span className="font-medium">{jenis_ikan.join(", ")}</span></p>
            <p className="text-sm">Weight: <span className="font-medium">{weight} kg</span></p>
            <p className="text-sm">Dimensions: <span className="font-medium">{dimensions.length} x {dimensions.width} x {dimensions.height} cm</span></p>
            <p className="text-sm">Stock: <span className="font-medium">{stok}</span></p>
            <p className="text-sm">Status: <span className={isPublished ? "text-green-500" : "text-red-500"}>{isPublished ? "Published" : "Unpublished"}</span></p>
          </div>
          <div>
            <h3 className="font-semibold">Pricing</h3>
            <p className="text-sm">Price: <span className="font-medium">Rp {price}</span></p>
            <p className="text-sm text-red-500">Discount: <span className="font-medium">Rp {discount}</span></p>
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
    )
}

export default ModalView;