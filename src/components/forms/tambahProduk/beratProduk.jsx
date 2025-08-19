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
    <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full overflow-x-auto">
        <h3 className="font-medium text-black dark:text-black">Berat Ikan</h3>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-black">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  placeholder="Masukan berat Produk"
                  value={formData.weight}
                  onChange={(e) =>
                    handleChange(
                      "weight",
                      e.target.value === ""
                        ? ""
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-black">
                  Tinggi (cm)
                </label>
                <input
                  type="number"
                  placeholder="Masukan tinggi produk"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    handleDimensionChange(
                      "height",
                      e.target.value === ""
                        ? ""
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Panjang (cm)
                </label>
                <input
                  type="number"
                  placeholder="Masukan panjang produk"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    handleDimensionChange(
                      "length",
                      e.target.value === ""
                        ? ""
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeratProduk;
