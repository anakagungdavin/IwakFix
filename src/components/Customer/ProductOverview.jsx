// import React, { useState } from "react";
// import Breadcrumb from "../../breadcrumb/breadcrumb";
// import { useNavigate } from "react-router-dom";
// import defaultImage from "../../images/image1.png";

// const ProductOverview = ({ fish }) => {
//   const defaultProduct = {
//     sku: "IKN12345",
//     name: fish?.name || "Bibit Ikan",
//     description:
//       "Bibit ikan berkualitas unggul, cocok untuk budidaya air tawar.",
//     price: 10000,
//     stock: 50,
//     images: Array.isArray(fish?.image) ? fish.image : [fish?.image],
//     rating: 4.5,
//     reviews: 5,
//     type: { size: ["S", "M", "L", "XL"] },
//   };

//   const navigate = useNavigate();
//   const [selectedImage, setSelectedImage] = useState(defaultProduct.images[0]);
//   const [selectedSize, setSelectedSize] = useState(""); // State for selected size
//   const [quantity, setQuantity] = useState(1); // State for quantity

//   console.log("Default Product Images:", defaultProduct.images);
//   return (
//     <div className="max-w-6xl mx-auto px-16">
//       {/* Breadcrumb Positioned at the Top */}
//       <div className="pt-8">
//         <Breadcrumb pageName={defaultProduct.name} />
//       </div>
//       <div className="flex pb-10 gap-6 border-b justify-center">
//         {/* Left Side - Image Section */}
//         <div className="w-1/2">
//           <img
//             src={selectedImage}
//             alt={defaultProduct.name}
//             className="w-full h-80 object-cover rounded-lg"
//           />
//           {/* Scrollable Image Gallery */}
//           <div className="mt-4 flex gap-2 overflow-x-auto">
//             {defaultProduct.images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt="Thumbnail"
//                 className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
//                   selectedImage === img
//                     ? "border-grey-500"
//                     : "border-transparent"
//                 }`}
//                 onClick={() => setSelectedImage(img)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side - Product Details */}
//         <div className="w-1/2 pl-6">
//           <h2 className="text-3xl font-bold">{defaultProduct.name}</h2>
//           <p className="text-2xl text-green-600 font-semibold">
//             Rp{defaultProduct.price}/kg
//           </p>
//           <div className="mt-2 flex items-center">
//             <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
//             <span className="ml-2 text-gray-600">
//               {defaultProduct.reviews} Ulasan
//             </span>
//           </div>
//           <div className="mt-4">
//             <label className="block font-semibold">Ukuran</label>
//             <div className="flex gap-2 mt-2">
//               {defaultProduct.type.size.map((size) => (
//                 <button
//                   key={size}
//                   className={`px-4 py-2 border rounded-lg transition-all ${
//                     selectedSize === size
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100"
//                   }`}
//                   onClick={() => setSelectedSize(size)}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="mt-4 p-4 border rounded-lg w-fit">
//             <span className="block font-semibold mb-2">Atur Jumlah</span>
//             <div className="flex items-center gap-4">
//               <button
//                 className="px-3 py-1 border rounded"
//                 onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//               >
//                 -
//               </button>
//               <span>{quantity}</span>
//               <button
//                 className="px-3 py-1 border rounded"
//                 onClick={() => setQuantity((prev) => prev + 1)}
//               >
//                 +
//               </button>
//               <span className="ml-4 text-gray-600">
//                 Stok Total: <b>{defaultProduct.stock} Kg</b>
//               </span>
//             </div>
//           </div>
//           <div className="mt-4 flex flex-grow gap-4 w-[325px]">
//             <button
//               className="border-2 border-[#003D47] text-black px-6 py-2 rounded-lg w-full"
//               onClick={() => {
//                 if (!selectedSize) {
//                   alert("Pilih ukuran terlebih dahulu!");
//                   return;
//                 }
//                 navigate("/customer/checkout", {
//                   state: {
//                     name: defaultProduct.name,
//                     size: selectedSize,
//                     quantity,
//                     description: defaultProduct.description,
//                     price: defaultProduct.price,
//                     image: defaultProduct.images[0],
//                   },
//                 });
//               }}
//             >
//               Beli
//             </button>
//             <button className="bg-[#003D47] text-white px-6 py-2 rounded-lg w-full">
//               + Keranjang
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductOverview;

import React, { useState } from "react";
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../images/image1.png";

const ProductOverview = ({ fish }) => {
  const defaultProduct = {
    sku: "IKN12345",
    name: fish?.name || "Bibit Ikan",
    description:
      "Bibit ikan berkualitas unggul, cocok untuk budidaya air tawar.",
    price: 10000,
    stock: 50,
    images: Array.isArray(fish?.image) ? fish.image : [fish?.image],
    rating: 4.5,
    reviews: 5,
    type: { size: ["S", "M", "L", "XL"] },
  };

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(defaultProduct.images[0]);
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [quantity, setQuantity] = useState(1); // State for quantity
  const handleBuyNow = (product) => {
    navigate("/customer/checkout", { state: { product } });
  };

  console.log("Default Product Images:", defaultProduct.images);
  return (
    <div className="max-w-6xl mx-auto px-16">
      {/* Breadcrumb Positioned at the Top */}
      <div className="pt-8">
        <Breadcrumb pageName={defaultProduct.name} />
      </div>
      <div className="flex pb-10 gap-6 border-b justify-center">
        {/* Left Side - Image Section */}
        <div className="w-1/2">
          <img
            src={selectedImage}
            alt={defaultProduct.name}
            className="w-full h-80 object-cover rounded-lg"
          />
          {/* Scrollable Image Gallery */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {defaultProduct.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumbnail"
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img
                    ? "border-grey-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="w-1/2 pl-6">
          <h2 className="text-3xl font-bold">{defaultProduct.name}</h2>
          <p className="text-2xl text-green-600 font-semibold">
            Rp{defaultProduct.price}/kg
          </p>
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
            <span className="ml-2 text-gray-600">
              {defaultProduct.reviews} Ulasan
            </span>
          </div>
          <div className="mt-4">
            <label className="block font-semibold">Ukuran</label>
            <div className="flex gap-2 mt-2">
              {defaultProduct.type.size.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    selectedSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 p-4 border rounded-lg w-fit">
            <span className="block font-semibold mb-2">Atur Jumlah</span>
            <div className="flex items-center gap-4">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
              <span className="ml-4 text-gray-600">
                Stok Total: <b>{defaultProduct.stock} Kg</b>
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-grow gap-4 w-[325px]">
            <button
              className="border-2 border-[#003D47] text-black px-6 py-2 rounded-lg w-full"
              onClick={() => {
                if (!selectedSize) {
                  alert("Pilih ukuran terlebih dahulu!");
                  return;
                }
                navigate("/customer/checkout", {
                  state: {
                    name: defaultProduct.name,
                    size: selectedSize,
                    quantity,
                    description: defaultProduct.description,
                    price: defaultProduct.price,
                    image: defaultProduct.images[0],
                  },
                });
              }}
            >
              Beli
            </button>
            <button
              className="bg-[#003D47] text-white px-6 py-2 rounded-lg w-full"
              onClick={() => {
                if (!selectedSize) {
                  alert("Pilih ukuran terlebih dahulu!");
                  return;
                }

                // Retrieve current cart from localStorage
                const cart = JSON.parse(localStorage.getItem("cart")) || [];

                // Check if the product already exists in the cart (same name & size)
                const existingProductIndex = cart.findIndex(
                  (item) =>
                    item.name === defaultProduct.name &&
                    item.size === selectedSize
                );

                if (existingProductIndex !== -1) {
                  // If it exists, update the quantity
                  cart[existingProductIndex].quantity += quantity;
                } else {
                  // Otherwise, add a new product
                  cart.push({
                    name: defaultProduct.name,
                    size: selectedSize,
                    quantity,
                    description: defaultProduct.description,
                    price: defaultProduct.price,
                    image: defaultProduct.images[0],
                  });
                }

                // Save updated cart back to localStorage
                localStorage.setItem("cart", JSON.stringify(cart));

                alert("Produk ditambahkan ke keranjang!");
              }}
            >
              + Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;