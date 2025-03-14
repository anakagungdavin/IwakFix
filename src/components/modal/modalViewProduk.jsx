// import React from "react";
// const ModalView = ({isOpen, onClose, item}) => {
//     if (!isOpen || !item ) return null;

//     const {
//         id,
//         name,
//         description,
//         media,
//         price,
//         discount,
//         stok,
//         type: {
//             warna,
//             ukuran,
//             jenis_ikan,
//         },
//         weight,
//         dimensions,
//         isPublished,
//     } = item;

//     return (
//         <div
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-xs"
//         onClick={onClose}
//         >
//             <div
//                     className="bg-white rounded-2xl shadow-lg w-11/12 max-w-xl p-6 relative"
//                     onClick={(e) => e.stopPropagation()}
//             >
//                 <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                     onClick={onClose}
//                 >
//                     &times;
//                 </button>
//                 <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Product Details</h2>
//           <div className="border rounded-lg p-4 space-y-2">
//             <div className="flex items-center space-x-4">
//               {media ? (
//                 <img
//                   src={media}
//                   alt={name}
//                   className="w-16 h-16 object-cover rounded-md"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gray-200 rounded-md" />
//               )}
//               <div>
//                 <p className="font-medium">{name}</p>
//                 <p className="text-sm text-gray-500">{description}</p>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold">Product Information</h3>
//             {/* <p className="text-sm">Tipe: <span className="font-medium">{type}</span></p> */}
//             <p className="text-sm">Warna: <span className="font-medium">{warna.join(", ")}</span></p>
//             <p className="text-sm">Ukuran: <span className="font-medium">{ukuran.join(", ")}</span></p>
//             <p className="text-sm">Jenis Ikan: <span className="font-medium">{jenis_ikan.join(", ")}</span></p>
//             <p className="text-sm">Weight: <span className="font-medium">{weight} kg</span></p>
//             <p className="text-sm">Dimensions: <span className="font-medium">{dimensions.length} x {dimensions.width} x {dimensions.height} cm</span></p>
//             <p className="text-sm">Stock: <span className="font-medium">{stok}</span></p>
//             <p className="text-sm">Status: <span className={isPublished ? "text-green-500" : "text-red-500"}>{isPublished ? "Published" : "Unpublished"}</span></p>
//           </div>
//           <div>
//             <h3 className="font-semibold">Pricing</h3>
//             <p className="text-sm">Price: <span className="font-medium">Rp {price}</span></p>
//             <p className="text-sm text-red-500">Discount: <span className="font-medium">Rp {discount}</span></p>
//           </div>
//           <button
//             className="bg-yellow-500 text-white rounded-md px-4 py-2 w-full hover:bg-yellow-600"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//             </div>
//         </div>
//     )
// }

// export default ModalView;

// import React from "react";

// const ModalView = ({ isOpen, onClose, item }) => {
//   if (!isOpen || !item) return null;

//   const {
//     _id,
//     name,
//     description,
//     images, // Assuming 'images' is an array of image URLs
//     price,
//     discount,
//     stock, // Assuming 'stock' is the correct field name
//     type, // Assuming 'type' contains 'warna', 'ukuran', 'jenis_ikan'
//     weight,
//     dimensions, // Assuming 'dimensions' contains 'length', 'width', 'height'
//     isPublished,
//   } = item;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-xs"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-lg w-11/12 max-w-xl p-6 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           &times;
//         </button>
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Product Details</h2>
//           <div className="border rounded-lg p-4 space-y-2">
//             <div className="flex items-center space-x-4">
//               {images && images.length > 0 ? (
//                 <img
//                   src={images[0]} // Display the first image
//                   alt={name}
//                   className="w-16 h-16 object-cover rounded-md"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gray-200 rounded-md" />
//               )}
//               <div>
//                 <p className="font-medium">{name}</p>
//                 <p className="text-sm text-gray-500">{description}</p>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold">Product Information</h3>
//             <p className="text-sm">
//               Warna: <span className="font-medium">{type?.warna?.join(", ")}</span>
//             </p>
//             <p className="text-sm">
//               Ukuran: <span className="font-medium">{type?.ukuran?.join(", ")}</span>
//             </p>
//             <p className="text-sm">
//               Weight: <span className="font-medium">{weight} kg</span>
//             </p>
//             <p className="text-sm">
//               Dimensions:{" "}
//               <span className="font-medium">
//                 {dimensions?.length} x {dimensions?.width} x {dimensions?.height} cm
//               </span>
//             </p>
//             <p className="text-sm">
//               Stock: <span className="font-medium">{stock}</span>
//             </p>
//             <p className="text-sm">
//               Status:{" "}
//               <span className={isPublished ? "text-green-500" : "text-red-500"}>
//                 {isPublished ? "Published" : "Unpublished"}
//               </span>
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold">Pricing</h3>
//             <p className="text-sm">
//               Price: <span className="font-medium">Rp {price}</span>
//             </p>
//             <p className="text-sm text-red-500">
//               Discount: <span className="font-medium">Rp {discount}</span>
//             </p>
//           </div>
//           <button
//             className="bg-yellow-500 text-white rounded-md px-4 py-2 w-full hover:bg-yellow-600"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalView;

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
    type,
    weight,
    dimensions,
    isPublished,
  } = item;

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
                    &larr;
                  </button>
                  <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#F0F1F3] text-[#667085] rounded-full p-2 hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                  >
                    &rarr;
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
              Warna: <span className="font-medium">{type?.color?.join(", ")}</span>
            </p>
            <p className="text-sm">
              Ukuran: <span className="font-medium">{type?.size?.join(", ")}</span>
            </p>
            <p className="text-sm">
              Berat: <span className="font-medium">{weight} kg</span>
            </p>
            <p className="text-sm">
              Dimensi (Panjang x Lebar x Tinggi):{" "}
              <span className="font-medium">
                {dimensions?.length} x {dimensions?.width} x {dimensions?.height} cm
              </span>
            </p>
            <p className="text-sm">
              Stock: <span className="font-medium">{stock}</span>
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
            <p className="text-sm">
              Price: <span className="font-medium">Rp {price}</span>
            </p>
            <p className="text-sm text-red-500">
              Discount: <span className="font-medium">{discount}%</span>
            </p>
            <p className="text-sm">
              Total Price:{" "}
              <span className="font-medium">
                Rp {price - (price * discount / 100)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalView;