import React, { useState } from "react";

const JenisProduk = () => {
    // State untuk menyimpan daftar jenis produk
    const [jenisProduk, setJenisProduk] = useState([
        { id: 1, tipe: "", variasi: [""] }
    ]);

    // Opsi dropdown tipe produk
    const tipeProdukOptions = ["Warna", "Ukuran", "Jenis Ikan"];

    // Menambah jenis produk baru
    const tambahJenis = () => {
        setJenisProduk([
            ...jenisProduk,
            { id: Date.now(), tipe: "", variasi: [""] }
        ]);
    };

    // Menghapus jenis produk
    const hapusJenis = (id) => {
        setJenisProduk(jenisProduk.filter((jenis) => jenis.id !== id));
    };

    // Mengubah tipe produk
    const handleTipeChange = (id, value) => {
        setJenisProduk(
            jenisProduk.map((jenis) =>
                jenis.id === id ? { ...jenis, tipe: value } : jenis
            )
        );
    };

    // Menambah variasi dalam jenis tertentu
    const tambahVariasi = (id) => {
        setJenisProduk(
            jenisProduk.map((jenis) =>
                jenis.id === id
                    ? { ...jenis, variasi: [...jenis.variasi, ""] }
                    : jenis
            )
        );
    };

    // Menghapus variasi dalam jenis tertentu
    const hapusVariasi = (id, index) => {
        setJenisProduk(
            jenisProduk.map((jenis) =>
                jenis.id === id
                    ? {
                          ...jenis,
                          variasi: jenis.variasi.filter((_, i) => i !== index)
                      }
                    : jenis
            )
        );
    };

    // Mengubah nilai variasi
    const handleVariasiChange = (id, index, value) => {
        setJenisProduk(
            jenisProduk.map((jenis) =>
                jenis.id === id
                    ? {
                          ...jenis,
                          variasi: jenis.variasi.map((v, i) =>
                              i === index ? value : v
                          )
                      }
                    : jenis
            )
        );
    };

    return (
        <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
            {jenisProduk.map((jenis) => (
                <div key={jenis.id} className="mb-4 border-b pb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tipe Produk */}
                        <div>
                            <label className="block text-gray-600 mb-1">Tipe Produk</label>
                            <select
                                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                value={jenis.tipe}
                                onChange={(e) => handleTipeChange(jenis.id, e.target.value)}
                            >
                                <option value="">Pilih jenis</option>
                                {tipeProdukOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Variasi */}
                        <div>
                            <label className="block text-gray-600 mb-1">Jenis</label>
                            {jenis.variasi.map((variasi, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
                                        placeholder="Masukan jenis variasi"
                                        value={variasi}
                                        onChange={(e) =>
                                            handleVariasiChange(jenis.id, index, e.target.value)
                                        }
                                    />
                                    {jenis.variasi.length > 1 && (
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => hapusVariasi(jenis.id, index)}
                                        >
                                            ✖
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
                                onClick={() => tambahVariasi(jenis.id)}
                            >
                                + Tambah Variasi
                            </button>
                        </div>
                    </div>

                    {/* Tombol Hapus Jenis */}
                    {jenisProduk.length > 1 && (
                        <button
                            type="button"
                            className="mt-3 px-4 py-1 bg-[#FEECEE] text-[#EB3D4D] rounded-md"
                            onClick={() => hapusJenis(jenis.id)}
                        >
                            Hapus Jenis
                        </button>
                    )}
                </div>
            ))}

            {/* Tombol Tambah Jenis */}
            <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#E9FAF7] text-[#1A9882]"
                onClick={tambahJenis}
            >
                + Tambah Jenis
            </button>
        </div>
    );
};

export default JenisProduk;
