import React, { useState, useEffect } from "react";

const BeratProduk = ({ data = {}, onChange = () => {} }) => {
  const [formData, setFormData] = useState({
    weight: data?.weight || "",
    dimensions: {
      height: data?.dimensions?.height || "",
      length: data?.dimensions?.length || "",
    },
  });

  useEffect(() => {
    setFormData({
      weight: data.weight || "",
      dimensions: {
        height: data.dimensions?.height || "",
        length: data.dimensions?.length || "",
      },
    });
  }, [data]);

  const handleChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedData);
    onChange(updatedData); // Kirim data ke parent
  };

  const handleDimensionChange = (dimension, value) => {
    const updatedData = {
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [dimension]: value,
      },
    };
    setFormData(updatedData);
    onChange(updatedData); // Kirim data ke parent
  };

  return (
    // Kontainer utama disederhanakan, styling kartu sudah ada di parent.
    <div>
      {/* Perubahan: Warna teks judul */}
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        Berat & Dimensi Produk
      </h3>
      <form action="#">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {/* Perubahan: Warna teks label */}
            <label className="mb-2 block text-sm font-medium text-black dark:text-gray-300">
              Berat (kg)
            </label>
            {/* Perubahan: Styling untuk input di dark mode */}
            <input
              type="number"
              placeholder="Masukan berat"
              value={formData.weight}
              onChange={(e) =>
                handleChange(
                  "weight",
                  e.target.value === "" ? "" : parseFloat(e.target.value) || 0
                )
              }
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-gray-300">
              Tinggi (cm)
            </label>
            <input
              type="number"
              placeholder="Masukan tinggi"
              value={formData.dimensions.height}
              onChange={(e) =>
                handleDimensionChange(
                  "height",
                  e.target.value === "" ? "" : parseFloat(e.target.value) || 0
                )
              }
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-gray-300">
              Panjang (cm)
            </label>
            <input
              type="number"
              placeholder="Masukan panjang"
              value={formData.dimensions.length}
              onChange={(e) =>
                handleDimensionChange(
                  "length",
                  e.target.value === "" ? "" : parseFloat(e.target.value) || 0
                )
              }
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BeratProduk;
