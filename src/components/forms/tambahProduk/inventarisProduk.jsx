import React, { useState } from "react";

const InventarisProduk = () => {
    const [sku,setSKU] = useState(0);
    const handleSKU = (e) =>{
        const value = parseFloat(e.target.value);
        setSKU(value < 0 ? 0 : value);
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
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    SKU (Stock Keeping Unit)/ID Barang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukan ID atau SKU Produk"
                                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Jumlah Stok Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukan jumlah stok produk"
                                    value={sku}
                                    onChange={handleSKU}
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

export default InventarisProduk;