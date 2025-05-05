// // import React, { useEffect, useState } from "react";

// // const JenisProduk = ({ data, onChange, isReadOnly = false }) => {
// //     const [jenisProduk, setJenisProduk] = useState(
// //         Array.isArray(data.type) ? data.type : []
// //     );

// //     const tipeProdukOptions = ["Warna", "Ukuran"];

// //     useEffect(() => {
// //         setJenisProduk(Array.isArray(data.type) ? data.type : []);
// //     }, [data.type]);

// //     const tambahJenis = () => {
// //         const newJenis = { id: Date.now(), tipe: "", variasi: [""] };
// //         const updatedJenisProduk = [...jenisProduk, newJenis];
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     const hapusJenis = (id) => {
// //         const updatedJenisProduk = jenisProduk.filter((jenis) => jenis.id !== id);
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     const handleTipeChange = (id, value) => {
// //         const updatedJenisProduk = jenisProduk.map((jenis) =>
// //             jenis.id === id ? { ...jenis, tipe: value } : jenis
// //         );
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     const tambahVariasi = (id) => {
// //         const updatedJenisProduk = jenisProduk.map((jenis) =>
// //             jenis.id === id ? { ...jenis, variasi: [...jenis.variasi, ""] } : jenis
// //         );
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     const hapusVariasi = (id, index) => {
// //         const updatedJenisProduk = jenisProduk.map((jenis) =>
// //             jenis.id === id
// //                 ? { ...jenis, variasi: jenis.variasi.filter((_, i) => i !== index) }
// //                 : jenis
// //         );
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     const handleVariasiChange = (id, index, value) => {
// //         const updatedJenisProduk = jenisProduk.map((jenis) =>
// //             jenis.id === id
// //                 ? { ...jenis, variasi: jenis.variasi.map((v, i) => (i === index ? value : v)) }
// //                 : jenis
// //         );
// //         setJenisProduk(updatedJenisProduk);
// //         onChange({ ...data, type: updatedJenisProduk });
// //     };

// //     return (
// //         <div className="p-5">
// //             <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
// //             {jenisProduk.map((jenis) => (
// //                 <div key={jenis.id} className="mb-4 border-b pb-4">
// //                     <div className="grid grid-cols-2 gap-4">
// //                         {/* Tipe Produk */}
// //                         <div>
// //                             <label className="block text-gray-600 mb-1">Tipe Produk</label>
// //                             {isReadOnly ? (
// //                                 <p className="text-black py-2">{jenis.tipe || "-"}</p>
// //                             ) : (
// //                                 <select
// //                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
// //                                     value={jenis.tipe}
// //                                     onChange={(e) => handleTipeChange(jenis.id, e.target.value)}
// //                                 >
// //                                     <option value="">Pilih jenis</option>
// //                                     {tipeProdukOptions.map((option) => (
// //                                         <option key={option} value={option}>
// //                                             {option}
// //                                         </option>
// //                                     ))}
// //                                 </select>
// //                             )}
// //                         </div>

// //                         {/* Variasi */}
// //                         <div>
// //                             <label className="block text-gray-600 mb-1">Jenis</label>
// //                             {jenis.variasi.map((variasi, index) => (
// //                                 <div key={index} className="flex items-center mb-2">
// //                                     {isReadOnly ? (
// //                                         <p className="text-black py-2">{variasi}</p>
// //                                     ) : (
// //                                         <input
// //                                             type="text"
// //                                             className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
// //                                             placeholder="Masukan jenis variasi"
// //                                             value={variasi}
// //                                             onChange={(e) =>
// //                                                 handleVariasiChange(jenis.id, index, e.target.value)
// //                                             }
// //                                         />
// //                                     )}
// //                                     {!isReadOnly && jenis.variasi.length > 1 && (
// //                                         <button
// //                                             type="button"
// //                                             className="ml-2 text-red-500"
// //                                             onClick={() => hapusVariasi(jenis.id, index)}
// //                                         >
// //                                             ✖
// //                                         </button>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                             {!isReadOnly && (
// //                                 <button
// //                                     type="button"
// //                                     className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
// //                                     onClick={() => tambahVariasi(jenis.id)}
// //                                 >
// //                                     + Tambah Variasi
// //                                 </button>
// //                             )}
// //                         </div>
// //                     </div>

// //                     {!isReadOnly && jenisProduk.length > 1 && (
// //                         <button
// //                             type="button"
// //                             className="mt-3 px-4 py-1 bg-[#FEECEE] text-[#EB3D4D] rounded-md"
// //                             onClick={() => hapusJenis(jenis.id)}
// //                         >
// //                             Hapus Jenis
// //                         </button>
// //                     )}
// //                 </div>
// //             ))}

// //             {!isReadOnly && (
// //                 <button
// //                     type="button"
// //                     className="mt-4 px-4 py-2 bg-[#E9FAF7] text-[#1A9882]"
// //                     onClick={tambahJenis}
// //                 >
// //                     + Tambah Jenis
// //                 </button>
// //             )}
// //         </div>
// //     );
// // };

// // export default JenisProduk;


// //Ver 2
// // import React, { useEffect, useState } from "react";

// // const JenisProduk = ({ data = {type: {color: [], size: []}}, onChange = () => {}, }) => {
// //     const [jenisProduk, setJenisProduk] = useState({
// //         color: Array.isArray(data.type?.color) ? data.type.color : [],
// //         size: Array.isArray(data.type?.size) ? data.type.size : []
// //     });

// //     useEffect(() => {
// //         setJenisProduk({
// //             color: Array.isArray(data.type?.color) ? data.type.color : [],
// //             size: Array.isArray(data.type?.size) ? data.type.size : []
// //         });
// //     }, [data.type]);

// //     const handleAddVariasi = (type) => {
// //         const updatedJenis = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
// //         setJenisProduk(updatedJenis);
// //         // onChange({ ...data, type: updatedJenis });
// //         onChange({ type: updatedJenis });
// //     };

// //     const handleRemoveVariasi = (type, index) => {
// //         const updatedJenis = {
// //             ...jenisProduk,
// //             [type]: jenisProduk[type].filter((_, i) => i !== index),
// //         };
// //         setJenisProduk(updatedJenis);
// //         // onChange({ ...data, type: updatedJenis });
// //         onChange({ type: updatedJenis });
// //     };

// //     const handleChangeVariasi = (type, index, value) => {
// //         const updatedJenis = {
// //             ...jenisProduk,
// //             [type]: jenisProduk[type].map((item, i) => (i === index ? value : item))
// //         };
// //         setJenisProduk(updatedJenis);
// //         // onChange({ ...data, type: updatedJenis });
// //         onChange({ type: updatedJenis });
// //     };

// //     return (
// //         <div className="p-5">
// //             <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
// //             {Object.keys(jenisProduk).map((type) => (
// //                 <div key={type} className="mb-4 border-b pb-4">
// //                     <label className="block text-gray-600 mb-1">{type === "color" ? "Warna" : "Ukuran"}</label>
// //                     {jenisProduk[type].map((variasi, index) => (
// //                         <div key={index} className="flex items-center mb-2">
// //                             {  (
// //                                 <input
// //                                     type="text"
// //                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
// //                                     placeholder={`Masukkan ${type === "color" ? "warna" : "ukuran"}`}
// //                                     value={variasi}
// //                                     onChange={(e) => handleChangeVariasi(type, index, e.target.value)}
// //                                 />
// //                             )}
// //                             {jenisProduk[type].length > 0 && (
// //                                 <button
// //                                     type="button"
// //                                     className="ml-2 text-red-500"
// //                                     onClick={() => handleRemoveVariasi(type, index)}
// //                                 >
// //                                     ✖
// //                                 </button>
// //                             )}
// //                         </div>
// //                     ))}
// //                     {(
// //                         <button
// //                             type="button"
// //                             className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
// //                             onClick={() => handleAddVariasi(type)}
// //                         >
// //                             + Tambah {type === "color" ? "Warna Bibit Ikan" : "Ukuran Bibit Ikan"}
// //                         </button>
// //                     )}
// //                 </div>
// //             ))}
// //         </div>
// //     );
// // };

// // export default JenisProduk;


// import React, { useEffect, useState } from "react";

// const JenisProduk = ({ data = { type: { jenis: [], size: [] } }, onChange = () => {} }) => {
//   const [jenisProduk, setJenisProduk] = useState({
//     jenis: Array.isArray(data.type?.jenis) ? data.type.jenis : [],
//     size: Array.isArray(data.type?.size) ? data.type.size : [],
//   });

//   useEffect(() => {
//     setJenisProduk({
//       jenis: Array.isArray(data.type?.jenis) ? data.type.jenis : [],
//       size: Array.isArray(data.type?.size) ? data.type.size : [],
//     });
//   }, [data.type]);

//   const handleAddVariasi = (type) => {
//     const updatedJenis = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
//     setJenisProduk(updatedJenis);
//     onChange({ type: updatedJenis });
//   };

//   const handleRemoveVariasi = (type, index) => {
//     const updatedJenis = {
//       ...jenisProduk,
//       [type]: jenisProduk[type].filter((_, i) => i !== index),
//     };
//     setJenisProduk(updatedJenis);
//     onChange({ type: updatedJenis });
//   };

//   const handleChangeVariasi = (type, index, value) => {
//     const updatedJenis = {
//       ...jenisProduk,
//       [type]: jenisProduk[type].map((item, i) => (i === index ? value : item)),
//     };
//     setJenisProduk(updatedJenis);
//     onChange({ type: updatedJenis });
//   };

//   return (
//     <div className="p-5">
//       <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
//       {Object.keys(jenisProduk).map((type) => (
//         <div key={type} className="mb-4 border-b pb-4">
//           <label className="block text-gray-600 mb-1">
//             {type === "jenis" ? "Jenis Ikan" : "Ukuran"}
//           </label>
//           {jenisProduk[type].map((variasi, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <input
//                 type="text"
//                 className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                 placeholder={`Masukkan ${type === "jenis" ? "Jenis Ikan" : "Ukuran"}`}
//                 value={variasi}
//                 onChange={(e) => handleChangeVariasi(type, index, e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="ml-2 text-red-500"
//                 onClick={() => handleRemoveVariasi(type, index)}
//               >
//                 ✖
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
//             onClick={() => handleAddVariasi(type)}
//           >
//             + Tambah {type === "jenis" ? "Jenis Ikan" : "Ukuran"}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default JenisProduk;

import React, { useEffect, useState } from "react";

const JenisProduk = ({ 
  data = { type: { jenis: [], size: [] }, stocks: [] }, 
  onChange = () => {},
}) => {
  const [jenisProduk, setJenisProduk] = useState({
    jenis: Array.isArray(data.type?.jenis) ? data.type.jenis : [],
    size: Array.isArray(data.type?.size) ? data.type.size : [],
  });

  const [currentStep, setCurrentStep] = useState("jenis");
  const [stocks, setStocks] = useState(Array.isArray(data.stocks) ? data.stocks : []);
  const [selectedJenis, setSelectedJenis] = useState(null);

  useEffect(() => {
    setJenisProduk({
      jenis: Array.isArray(data.type?.jenis) ? data.type.jenis : [],
      size: Array.isArray(data.type?.size) ? data.type.size : [],
    });
    setStocks(Array.isArray(data.stocks) ? data.stocks : []);
  }, [data.type, data.stocks]);

  const handleAddVariasi = (type) => {
    const updatedJenis = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis, stocks });
  };

  const handleRemoveVariasi = (type, index) => {
    const updatedJenis = {
      ...jenisProduk,
      [type]: jenisProduk[type].filter((_, i) => i !== index),
    };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis, stocks });
  };

  const handleChangeVariasi = (type, index, value) => {
    const updatedJenis = {
      ...jenisProduk,
      [type]: jenisProduk[type].map((item, i) => (i === index ? value : item)),
    };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis, stocks });
  };

  const handleStockChange = (jenis, size, field, value) => {
    const updatedStocks = [...stocks];
    const existingIndex = updatedStocks.findIndex(
      item => item.jenis === jenis && item.size === size
    );

    if (existingIndex >= 0) {
      updatedStocks[existingIndex][field] = value;
    } else {
      updatedStocks.push({ 
        jenis, 
        size, 
        stock: field === 'stock' ? value : 0,
        price: field === 'price' ? value : 0,
        sku: field === 'sku' ? value : '',
        discount: field === 'discount' ? value : 0
      });
    }

    setStocks(updatedStocks);
    onChange({ type: jenisProduk, stocks: updatedStocks });
  };

  const generateStockCombinations = () => {
    if (jenisProduk.jenis.length > 0 && jenisProduk.size.length > 0) {
      setCurrentStep("stok");
    }
  };

  const getStockValue = (jenis, size, field) => {
    const item = stocks.find(item => item.jenis === jenis && item.size === size);
    return item ? item[field] : (field === 'sku' ? '' : 0);
  };

  const renderJenisStep = () => (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
      {Object.keys(jenisProduk).map((type) => (
        <div key={type} className="mb-4 border-b pb-4">
          <label className="block text-gray-600 mb-1">
            {type === "jenis" ? "Jenis Ikan" : "Ukuran"}
          </label>
          {jenisProduk[type].map((variasi, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                placeholder={`Masukkan ${type === "jenis" ? "Jenis Ikan" : "Ukuran"}`}
                value={variasi}
                onChange={(e) => handleChangeVariasi(type, index, e.target.value)}
              />
              {jenisProduk[type].length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveVariasi(type, index)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
            onClick={() => handleAddVariasi(type)}
          >
            + Tambah {type === "jenis" ? "Jenis Ikan" : "Ukuran"}
          </button>
        </div>
      ))}

      {jenisProduk.jenis.length > 0 && jenisProduk.size.length > 0 && (
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={generateStockCombinations}
        >
          Atur Stok dan Harga
        </button>
      )}
    </div>
  );

  const renderStokStep = () => (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Atur Stok dan Harga</h2>
      
      <div className="flex mb-6">
        <div className="w-1/3 pr-4">
          <h3 className="font-medium text-gray-700 mb-2">Jenis Ikan</h3>
          <div className="border rounded-md overflow-hidden">
            {jenisProduk.jenis.map((jenis, index) => (
              <div 
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedJenis === jenis ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedJenis(jenis)}
              >
                {jenis}
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3">
          {selectedJenis ? (
            <>
              <h3 className="font-medium text-gray-700 mb-2">Ukuran untuk {selectedJenis}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Ukuran</th>
                      <th className="py-2 px-4 border">Stok</th>
                      <th className="py-2 px-4 border">Harga</th>
                      <th className="py-2 px-4 border">SKU</th>
                      <th className="py-2 px-4 border">Diskon (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jenisProduk.size.map((size, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 border">{size}</td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(selectedJenis, size, 'stock')}
                            onChange={(e) => handleStockChange(
                              selectedJenis, 
                              size, 
                              'stock', 
                              parseInt(e.target.value) || 0
                            )}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(selectedJenis, size, 'price')}
                            onChange={(e) => handleStockChange(
                              selectedJenis, 
                              size, 
                              'price', 
                              parseInt(e.target.value) || 0
                            )}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(selectedJenis, size, 'sku')}
                            onChange={(e) => handleStockChange(
                              selectedJenis, 
                              size, 
                              'sku', 
                              e.target.value
                            )}
                            placeholder="Kode SKU"
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(selectedJenis, size, 'discount')}
                            onChange={(e) => handleStockChange(
                              selectedJenis, 
                              size, 
                              'discount', 
                              parseInt(e.target.value) || 0
                            )}
                            min="0"
                            max="100"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Pilih jenis ikan terlebih dahulu
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => setCurrentStep("jenis")}
      >
        Kembali
      </button>
    </div>
  );

  return (
    <div>
      {currentStep === "jenis" ? renderJenisStep() : renderStokStep()}
    </div>
  );
};

export default JenisProduk;