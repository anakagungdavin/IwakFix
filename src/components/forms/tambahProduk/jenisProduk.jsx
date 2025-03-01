// import React, { useEffect, useState } from "react";

// const JenisProduk = ({ data, onChange, isReadOnly = false }) => {
//     const [jenisProduk, setJenisProduk] = useState(
//         Array.isArray(data.type) ? data.type : []
//     );

//     const tipeProdukOptions = ["Warna", "Ukuran"];

//     useEffect(() => {
//         setJenisProduk(Array.isArray(data.type) ? data.type : []);
//     }, [data.type]);

//     const tambahJenis = () => {
//         const newJenis = { id: Date.now(), tipe: "", variasi: [""] };
//         const updatedJenisProduk = [...jenisProduk, newJenis];
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     const hapusJenis = (id) => {
//         const updatedJenisProduk = jenisProduk.filter((jenis) => jenis.id !== id);
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     const handleTipeChange = (id, value) => {
//         const updatedJenisProduk = jenisProduk.map((jenis) =>
//             jenis.id === id ? { ...jenis, tipe: value } : jenis
//         );
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     const tambahVariasi = (id) => {
//         const updatedJenisProduk = jenisProduk.map((jenis) =>
//             jenis.id === id ? { ...jenis, variasi: [...jenis.variasi, ""] } : jenis
//         );
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     const hapusVariasi = (id, index) => {
//         const updatedJenisProduk = jenisProduk.map((jenis) =>
//             jenis.id === id
//                 ? { ...jenis, variasi: jenis.variasi.filter((_, i) => i !== index) }
//                 : jenis
//         );
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     const handleVariasiChange = (id, index, value) => {
//         const updatedJenisProduk = jenisProduk.map((jenis) =>
//             jenis.id === id
//                 ? { ...jenis, variasi: jenis.variasi.map((v, i) => (i === index ? value : v)) }
//                 : jenis
//         );
//         setJenisProduk(updatedJenisProduk);
//         onChange({ ...data, type: updatedJenisProduk });
//     };

//     return (
//         <div className="p-5">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
//             {jenisProduk.map((jenis) => (
//                 <div key={jenis.id} className="mb-4 border-b pb-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         {/* Tipe Produk */}
//                         <div>
//                             <label className="block text-gray-600 mb-1">Tipe Produk</label>
//                             {isReadOnly ? (
//                                 <p className="text-black py-2">{jenis.tipe || "-"}</p>
//                             ) : (
//                                 <select
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                     value={jenis.tipe}
//                                     onChange={(e) => handleTipeChange(jenis.id, e.target.value)}
//                                 >
//                                     <option value="">Pilih jenis</option>
//                                     {tipeProdukOptions.map((option) => (
//                                         <option key={option} value={option}>
//                                             {option}
//                                         </option>
//                                     ))}
//                                 </select>
//                             )}
//                         </div>

//                         {/* Variasi */}
//                         <div>
//                             <label className="block text-gray-600 mb-1">Jenis</label>
//                             {jenis.variasi.map((variasi, index) => (
//                                 <div key={index} className="flex items-center mb-2">
//                                     {isReadOnly ? (
//                                         <p className="text-black py-2">{variasi}</p>
//                                     ) : (
//                                         <input
//                                             type="text"
//                                             className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                             placeholder="Masukan jenis variasi"
//                                             value={variasi}
//                                             onChange={(e) =>
//                                                 handleVariasiChange(jenis.id, index, e.target.value)
//                                             }
//                                         />
//                                     )}
//                                     {!isReadOnly && jenis.variasi.length > 1 && (
//                                         <button
//                                             type="button"
//                                             className="ml-2 text-red-500"
//                                             onClick={() => hapusVariasi(jenis.id, index)}
//                                         >
//                                             ✖
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             {!isReadOnly && (
//                                 <button
//                                     type="button"
//                                     className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
//                                     onClick={() => tambahVariasi(jenis.id)}
//                                 >
//                                     + Tambah Variasi
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {!isReadOnly && jenisProduk.length > 1 && (
//                         <button
//                             type="button"
//                             className="mt-3 px-4 py-1 bg-[#FEECEE] text-[#EB3D4D] rounded-md"
//                             onClick={() => hapusJenis(jenis.id)}
//                         >
//                             Hapus Jenis
//                         </button>
//                     )}
//                 </div>
//             ))}

//             {!isReadOnly && (
//                 <button
//                     type="button"
//                     className="mt-4 px-4 py-2 bg-[#E9FAF7] text-[#1A9882]"
//                     onClick={tambahJenis}
//                 >
//                     + Tambah Jenis
//                 </button>
//             )}
//         </div>
//     );
// };

// export default JenisProduk;


//Ver 2
// import React, { useEffect, useState } from "react";

// const JenisProduk = ({ data = {type: {color: [], size: []}}, onChange = () => {}, }) => {
//     const [jenisProduk, setJenisProduk] = useState({
//         color: Array.isArray(data.type?.color) ? data.type.color : [],
//         size: Array.isArray(data.type?.size) ? data.type.size : []
//     });

//     useEffect(() => {
//         setJenisProduk({
//             color: Array.isArray(data.type?.color) ? data.type.color : [],
//             size: Array.isArray(data.type?.size) ? data.type.size : []
//         });
//     }, [data.type]);

//     const handleAddVariasi = (type) => {
//         const updatedJenis = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
//         setJenisProduk(updatedJenis);
//         // onChange({ ...data, type: updatedJenis });
//         onChange({ type: updatedJenis });
//     };

//     const handleRemoveVariasi = (type, index) => {
//         const updatedJenis = {
//             ...jenisProduk,
//             [type]: jenisProduk[type].filter((_, i) => i !== index),
//         };
//         setJenisProduk(updatedJenis);
//         // onChange({ ...data, type: updatedJenis });
//         onChange({ type: updatedJenis });
//     };

//     const handleChangeVariasi = (type, index, value) => {
//         const updatedJenis = {
//             ...jenisProduk,
//             [type]: jenisProduk[type].map((item, i) => (i === index ? value : item))
//         };
//         setJenisProduk(updatedJenis);
//         // onChange({ ...data, type: updatedJenis });
//         onChange({ type: updatedJenis });
//     };

//     return (
//         <div className="p-5">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
//             {Object.keys(jenisProduk).map((type) => (
//                 <div key={type} className="mb-4 border-b pb-4">
//                     <label className="block text-gray-600 mb-1">{type === "color" ? "Warna" : "Ukuran"}</label>
//                     {jenisProduk[type].map((variasi, index) => (
//                         <div key={index} className="flex items-center mb-2">
//                             {  (
//                                 <input
//                                     type="text"
//                                     className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                                     placeholder={`Masukkan ${type === "color" ? "warna" : "ukuran"}`}
//                                     value={variasi}
//                                     onChange={(e) => handleChangeVariasi(type, index, e.target.value)}
//                                 />
//                             )}
//                             {jenisProduk[type].length > 0 && (
//                                 <button
//                                     type="button"
//                                     className="ml-2 text-red-500"
//                                     onClick={() => handleRemoveVariasi(type, index)}
//                                 >
//                                     ✖
//                                 </button>
//                             )}
//                         </div>
//                     ))}
//                     {(
//                         <button
//                             type="button"
//                             className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
//                             onClick={() => handleAddVariasi(type)}
//                         >
//                             + Tambah {type === "color" ? "Warna Bibit Ikan" : "Ukuran Bibit Ikan"}
//                         </button>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default JenisProduk;


import React, { useEffect, useState } from "react";

const JenisProduk = ({ data = { type: { color: [], size: [] } }, onChange = () => {} }) => {
  const [jenisProduk, setJenisProduk] = useState({
    color: Array.isArray(data.type?.color) ? data.type.color : [],
    size: Array.isArray(data.type?.size) ? data.type.size : [],
  });

  useEffect(() => {
    setJenisProduk({
      color: Array.isArray(data.type?.color) ? data.type.color : [],
      size: Array.isArray(data.type?.size) ? data.type.size : [],
    });
  }, [data.type]);

  const handleAddVariasi = (type) => {
    const updatedJenis = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis }); // Kirim data ke parent
  };

  const handleRemoveVariasi = (type, index) => {
    const updatedJenis = {
      ...jenisProduk,
      [type]: jenisProduk[type].filter((_, i) => i !== index),
    };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis }); // Kirim data ke parent
  };

  const handleChangeVariasi = (type, index, value) => {
    const updatedJenis = {
      ...jenisProduk,
      [type]: jenisProduk[type].map((item, i) => (i === index ? value : item)),
    };
    setJenisProduk(updatedJenis);
    onChange({ type: updatedJenis }); // Kirim data ke parent
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
      {Object.keys(jenisProduk).map((type) => (
        <div key={type} className="mb-4 border-b pb-4">
          <label className="block text-gray-600 mb-1">
            {type === "color" ? "Warna" : "Ukuran"}
          </label>
          {jenisProduk[type].map((variasi, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                placeholder={`Masukkan ${type === "color" ? "warna" : "ukuran"}`}
                value={variasi}
                onChange={(e) => handleChangeVariasi(type, index, e.target.value)}
              />
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleRemoveVariasi(type, index)}
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
            onClick={() => handleAddVariasi(type)}
          >
            + Tambah {type === "color" ? "Warna" : "Ukuran"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default JenisProduk;