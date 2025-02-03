import React, { useState } from "react";

const HargaProduk = () => {
    const [harga, setHarga] = useState(0);
    const [diskon, setDiskon] = useState(0);

    const handleHargaChange = (e) => {
        const value = parseFloat(e.target.value);
        setHarga(value < 0 ? 0 : value);
    };

    const handleDiskonChange = (e) => {
        const value = parseFloat(e.target.value);
        setDiskon(value < 0 ? 0 : value);
    };

    const totalHarga = harga - (harga * diskon / 100);

    return (
        <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
            <div className="max-w-full overflow-x-auto">
                <h3 className="font-medium text-black">Harga Produk</h3>
                <form>
                    <div className="p-6.5">
                        {/* Input Harga Produk */}
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Harga Produk <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Masukkan harga produk"
                                value={harga}
                                onChange={handleHargaChange}
                                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Input Diskon Produk */}
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Diskon Produk (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Masukkan persen diskon"
                                value={diskon}
                                onChange={handleDiskonChange}
                                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Jika tidak diskon isi 0
                            </p>
                        </div>

                        {/* Output Total Harga */}
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Total Harga Setelah Diskon
                            </label>
                            <input
                                type="text"
                                value={totalHarga.toFixed(2)}
                                disabled
                                className="w-full rounded-md border border-gray-300 bg-gray-100 py-3 px-5 text-black outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HargaProduk;
