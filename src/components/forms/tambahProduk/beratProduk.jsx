import React, { useState } from "react";

const BeratProduk = () => {
    const [berat,setBerat] = useState(0);
    const handleBerat = (e) =>{
        const value = parseFloat(e.target.value);
        setBerat(value < 0 ? 0 : value);
    };
    const [tinggi,setTinggi] = useState(0);
    const handleTinggi = (e) =>{
        const value = parseFloat(e.target.value);
        setTinggi(value < 0 ? 0 : value);
    };
    const [panjang,setPanjang] = useState(0);
    const handlePanjang = (e) =>{
        const value = parseFloat(e.target.value);
        setPanjang(value < 0 ? 0 : value);
    };
    const [lebar,setLebar] = useState(0);
    const handleLebar = (e) =>{
        const value = parseFloat(e.target.value);
        setLebar(value < 0 ? 0 : value);
    };
    return (
        <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
            <div className="max-w-full overflow-x-auto">
                <h3 className="font-medium text-black dark:text-white">
                    Inventaris Produk
                </h3>
                <form action="#">
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Berat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukan berat Produk"
                                    value={berat}
                                    onChange={handleBerat}
                                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="w-full xl:w-1/4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Tinggi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukan tinggi produk"
                                    value={tinggi}
                                    onChange={handleTinggi}
                                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="w-full xl:w-1/4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Panjang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukan panjang produk"
                                    value={panjang}
                                    onChange={handlePanjang}
                                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="w-full xl:w-1/4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Lebar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukan lebar produk"
                                    value={lebar}
                                    onChange={handleLebar}
                                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default BeratProduk;