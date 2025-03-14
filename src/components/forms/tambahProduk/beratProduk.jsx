// import React, { useEffect, useState } from "react";

// const BeratProduk = ({ data, onChange, isReadOnly = false }) => {
//     const [berat,setBerat] = useState(0);
//     const handleBeratChange = (e) =>{
//         const value = parseFloat(e.target.value);
//         // setBerat(value < 0 ? 0 : value);
//         onChange({
//             ...data,
//             weight: value < 0 ? 0 : value,
//         })
//     };
//     const [tinggi,setTinggi] = useState(0);
//     const handleTinggiChange = (e) =>{
//         const value = parseFloat(e.target.value);
//         // setTinggi(value < 0 ? 0 : value);
//         onChange({
//             ...data,
//             dimensions: {
//                 ...data.dimensions,
//                 weight: value < 0 ? 0 : value,
//             },
//         })
//     };
//     const [panjang,setPanjang] = useState(0);
//     const handlePanjangChange = (e) =>{
//         const value = parseFloat(e.target.value);
//         // setPanjang(value < 0 ? 0 : value);
//         onChange({
//             ...data,
//             dimensions: {
//                 ...data.dimensions,
//                 length: value < 0 ? 0 : value,
//             },
//         })
//     };
//     const [lebar,setLebar] = useState(0);
//     const handleLebarChange = (e) =>{
//         const value = parseFloat(e.target.value);
//         // setLebar(value < 0 ? 0 : value);
//         onChange({
//             ...data,
//             dimensions: {
//                 ...data.dimensions,
//                 width: value < 0 ? 0 : value,
//             },
//         })
//     };

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const
//     //         } catch (error) {
//     //             console.error("Erorr saat mengambil data:", error);
//     //         }
//     //     }
//     // })
//     return (
//         <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
//             <div className="max-w-full overflow-x-auto">
//                 <h3 className="font-medium text-black dark:text-white">
//                     Berat Produk
//                 </h3>
//                 <form action="#">
//                     <div className="p-6.5">
//                         <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Berat <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan berat Produk"
//                                     value={data.weight || ""}
//                                     onChange={handleBeratChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Tinggi <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan tinggi produk"
//                                     value={data.dimensions?.height || ""}
//                                     onChange={handleTinggiChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Panjang <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan panjang produk"
//                                     value={data.dimensions?.length || ""}
//                                     onChange={handlePanjangChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Lebar <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan lebar produk"
//                                     value={data.dimensions?.width || ""}
//                                     onChange={handleLebarChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }
// export default BeratProduk;

//ver2
// import React, { useState, useEffect } from "react";

// const BeratProduk = ({ data = {}, onChange = () => {} }) => {
//     const [formData, setFormData] = useState({
//         weight: data?.weight || 0,
//         dimensions: {
//             height: data?.dimensions?.height || 0,
//             length: data?.dimensions?.length || 0,
//             width: data?.dimensions?.width || 0,
//         }
//     });

//     useEffect(() => {
//         setFormData({
//             weight: data.weight || 0,
//             dimensions: {
//                 height: data.dimensions?.height || 0,
//                 length: data.dimensions?.length || 0,
//                 width: data.dimensions?.width || 0,
//             }
//         });
//     }, [data]);

//     const handleChange = (field, value) => {
//         const updatedData = {
//             ...formData,
//             [field]: value
//         };
//         setFormData(updatedData);
//         onChange(updatedData);
//     };

//     const handleDimensionChange = (dimension, value) => {
//         const updatedData = {
//             ...formData,
//             dimensions: {
//                 ...formData.dimensions,
//                 [dimension]: value
//             }
//         };
//         setFormData(updatedData);
//         onChange(updatedData);
//     };

//     return (
//         <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
//             <div className="max-w-full overflow-x-auto">
//                 <h3 className="font-medium text-black dark:text-white">
//                     Berat Produk
//                 </h3>
//                 <form action="#">
//                     <div className="p-6.5">
//                         <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Berat (kg)<span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan berat Produk"
//                                     value={formData.weight}
//                                     onChange={(e) => handleChange("weight", parseFloat(e.target.value) || 0)}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Tinggi (cm)<span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan tinggi produk"
//                                     value={formData.dimensions.height}
//                                     onChange={(e) => handleDimensionChange("height", parseFloat(e.target.value) || 0)}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Panjang (cm) <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan panjang produk"
//                                     value={formData.dimensions.length}
//                                     onChange={(e) => handleDimensionChange("length", parseFloat(e.target.value) || 0)}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                             <div className="w-full xl:w-1/4">
//                                 <label className="mb-2.5 block text-black dark:text-white">
//                                     Lebar (cm) <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     placeholder="Masukan lebar produk"
//                                     value={formData.dimensions.width}
//                                     onChange={(e) => handleDimensionChange("width", parseFloat(e.target.value) || 0)}
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default BeratProduk;

import React, { useState, useEffect } from "react";

const BeratProduk = ({ data = {}, onChange = () => {} }) => {
  const [formData, setFormData] = useState({
    weight: data?.weight || 0,
    dimensions: {
      height: data?.dimensions?.height || 0,
      length: data?.dimensions?.length || 0,
      width: data?.dimensions?.width || 0,
    },
  });

  useEffect(() => {
    setFormData({
      weight: data.weight || 0,
      dimensions: {
        height: data.dimensions?.height || 0,
        length: data.dimensions?.length || 0,
        width: data.dimensions?.width || 0,
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
        <h3 className="font-medium text-black dark:text-white">Berat Produk</h3>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Berat (kg)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukan berat Produk"
                  value={formData.weight}
                  onChange={(e) =>
                    handleChange("weight", parseFloat(e.target.value) || 0)
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tinggi (cm)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukan tinggi produk"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    handleDimensionChange(
                      "height",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Panjang (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukan panjang produk"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    handleDimensionChange(
                      "length",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Lebar (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukan lebar produk"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    handleDimensionChange(
                      "width",
                      parseFloat(e.target.value) || 0
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
