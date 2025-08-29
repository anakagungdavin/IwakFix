import React, { useEffect, useState } from "react";

const InformasiProduk = ({ data, onChange = () => {} }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(data?.name || "");
    setDescription(data?.description || "");
  }, [data]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    onChange({ target: { name: "name", value } });
  };

  const handleDescChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    onChange({ target: { name: "description", value } });
  };

  return (
    // Kontainer utama disederhanakan, karena styling kartu sudah ada di parent.
    <div>
      {/* Perubahan: Warna teks judul */}
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        Informasi Produk
      </h3>
      <form action="#">
        <div className="space-y-4">
          <div>
            {/* Perubahan: Warna teks label */}
            <label className="mb-2 block text-sm font-medium text-black dark:text-gray-300">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            {/* Perubahan: Styling untuk input di dark mode */}
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Masukan nama produk"
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-gray-300">
              Deskripsi Produk
            </label>
            {/* Perubahan: Styling untuk textarea di dark mode */}
            <textarea
              rows={6}
              name="description"
              value={description}
              onChange={handleDescChange}
              placeholder="Masukan deskripsi produk"
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InformasiProduk;
