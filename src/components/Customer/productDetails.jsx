import React from "react";

const ProductDetails = ({ fish }) => {
  // Default fallback product details
  const defaultProduct = {
    sku: "IKN12345",
    name: fish?.name || "Bibit Ikan",
    description:
      "Bibit ikan berkualitas unggul, cocok untuk budidaya air tawar. Pilihan terbaik untuk bisnis budidaya ikan air tawar dengan pertumbuhan cepat dan kualitas unggul.",
    size: "Spesifikasi Ukuran: XL: 3 Inchi, L: 2.5 Inchi, M: 2 Inchi, S: 1.5 Inchi",
    price: 10000,
    stock: 50,
  };

  return (
    <div className="p-6 pl-0 pr-4 max-w-5xl mx-auto">
      <h3 className="text-lg font-bold">Deskripsi</h3>
      <p>{defaultProduct.description}</p>
      <p className="text-lg font-medium ">{defaultProduct.size}</p>
    </div>
  );
};

export default ProductDetails;
