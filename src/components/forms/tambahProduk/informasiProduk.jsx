// import React, { useEffect, useState } from "react";

// const InformasiProduk = ({data, onChange = () => {}}) => {
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");

//     useEffect(() => {
//         setName(data?.name || "");
//         setDescription(data?.description || "");
//     }, [data]);

//     const handleNameChange = (e) => {
//         const value = e.target.value;
//         setName(value);
//         onChange({target: {name: "name", value}});
//     };
//     const handleDescChange = (e) => {
//         const value = e.target.value;
//         setDescription(value);
//         onChange({target: {name: "description", value}});
//     };

//     return (
//         <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
//             <div className="max-w-full overflow-x-auto">
//                 <h3 className="font-medium text-black dark:text-white">
//                     Informasi Produk
//                 </h3>
//                 <form action="#">
//                     <div className="p-6.5">
//                         <div className="mb-4.5">
//                             <label className="mb-2.5 block text-black dark:text-white">
//                                 Nama Produk <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={name}
//                                 onChange={handleNameChange}
//                                 placeholder="Masukan nama produk"
//                                 className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                             />
//                         </div>
//                         <div className="mb-6">
//                             <label className="mb-2.5 block text-black dark:text-white">
//                                 Deskripsi Produk
//                             </label>
//                             <textarea 
//                             rows={6}
//                             name="description"
//                             value={description}
//                             onChange={handleDescChange}
//                             placeholder="Masukan deskripsi produk"
//                             className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
//                             ></textarea>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default InformasiProduk;
import React, { useEffect, useState } from "react";

const InformasiProduk = ({data, onChange = () => {}}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setName(data?.name || "");
        setDescription(data?.description || "");
    }, [data]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        onChange({target: {name: "name", value}});
    };
    const handleDescChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        onChange({target: {name: "description", value}});
    };

    return (
        <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
            <div className="max-w-full overflow-x-auto">
                <h3 className="font-medium text-black dark:text-white">
                    Informasi Produk
                </h3>
                <form action="#">
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Nama Produk <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Masukan nama produk"
                                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Deskripsi Produk
                            </label>
                            <textarea 
                            rows={6}
                            name="description"
                            value={description}
                            onChange={handleDescChange}
                            placeholder="Masukan deskripsi produk"
                            className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                            ></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InformasiProduk;