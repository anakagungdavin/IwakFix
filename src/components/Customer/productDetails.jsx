import React, { useState } from "react";

const ProductDetails = ({ fish }) => {
  const [activeTab, setActiveTab] = useState("Deskripsi");

  const defaultProduct = {
    sku: "IKN12345",
    name: fish?.name || "Bibit Ikan Gurame",
    description:
      "Bibit Ikan Gurame Berkualitas Unggul - Pilihan Tepat untuk Bisnis Perikanan Anda. Bibit ikan gurame kami merupakan pilihan terbaik untuk Anda yang ingin memulai atau mengembangkan bisnis budidaya ikan air tawar. Kami menyediakan bibit ikan gurame yang sehat, kuat, dan cepat tumbuh, sehingga cocok untuk kebutuhan peternakan Anda.",
    sizes: [
      { label: "XL", value: "3 Inchi" },
      { label: "L", value: "2.5 Inchi" },
      { label: "M", value: "2 Inchi" },
      { label: "S", value: "1.5 Inchi" },
    ],
  };

  return (
    <div className="p-6 pl-0 pr-4 max-w-5xl mx-auto">
      <div className="flex border-gray-300 mb-4">
        <h3
          className={`text-lg font-bold pb-2 mr-4 cursor-pointer ${
            activeTab === "Deskripsi" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Deskripsi")}
        >
          Deskripsi
        </h3>
        <h3
          className={`text-lg font-bold pb-2 cursor-pointer ${
            activeTab === "Spesifikasi" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Spesifikasi")}
        >
          Spesifikasi
        </h3>
      </div>
      
      {activeTab === "Deskripsi" ? (
        <p className="text-gray-800 leading-relaxed mb-4">{defaultProduct.description}</p>
      ) : (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Spesifikasi Ukuran:</h4>
          <ul className="text-gray-800">
            {defaultProduct.sizes.map((size) => (
              <li key={size.label}>
                <span className="font-semibold">{size.label}:</span> {size.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
