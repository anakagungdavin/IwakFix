import React, { useEffect, useState } from "react";

const JenisProduk = ({
  data = { type: { jenis: [], size: [] }, stocks: [] },
  onChange = () => {},
}) => {
  // ... (semua state dan logika fungsi tetap sama)
  const [jenisProduk, setJenisProduk] = useState({
    jenis: Array.isArray(data.type?.jenis) ? [...data.type.jenis] : [],
    size: Array.isArray(data.type?.size) ? [...data.type.size] : [],
  });
  const [currentStep, setCurrentStep] = useState("jenis");
  const [stocks, setStocks] = useState(() => {
    const initialStocks = Array.isArray(data.stocks)
      ? data.stocks.map((stock) => ({
          _id: stock._id || undefined,
          jenis: stock.jenis,
          size: stock.size,
          stock: stock.stock || 0,
          price: stock.price || 0,
          discount: stock.discount || 0,
          satuan: stock.satuan || "kg",
        }))
      : [];
    return initialStocks;
  });
  const [selectedJenis, setSelectedJenis] = useState(null);

  useEffect(() => {
    const newJenis = Array.isArray(data.type?.jenis)
      ? [...data.type.jenis]
      : [];
    const newSize = Array.isArray(data.type?.size) ? [...data.type.size] : [];
    setJenisProduk({ jenis: newJenis, size: newSize });

    const transformedStocks = Array.isArray(data.stocks)
      ? data.stocks.map((stock) => ({
          _id: stock._id || undefined,
          jenis: stock.jenis,
          size: stock.size,
          stock: stock.stock || 0,
          price: stock.price || 0,
          discount: stock.discount || 0,
          satuan: stock.satuan || "kg",
        }))
      : [];
    setStocks(transformedStocks);

    const validInitialJenis = newJenis.filter((j) => j && j.trim() !== "");
    if (!selectedJenis && validInitialJenis.length > 0) {
      setSelectedJenis(validInitialJenis[0]);
    } else if (
      selectedJenis &&
      !validInitialJenis.includes(selectedJenis) &&
      validInitialJenis.length > 0
    ) {
      setSelectedJenis(validInitialJenis[0]);
    } else if (validInitialJenis.length === 0) {
      setSelectedJenis(null);
    }
  }, [data.type, data.stocks]);

  const handleAddVariasi = (type) => {
    const updatedTipe = { ...jenisProduk, [type]: [...jenisProduk[type], ""] };
    setJenisProduk(updatedTipe);
    onChange({ type: updatedTipe, stocks });
  };

  const handleRemoveVariasi = (type, index) => {
    const itemToRemove = jenisProduk[type][index];
    const updatedTipe = {
      ...jenisProduk,
      [type]: jenisProduk[type].filter((_, i) => i !== index),
    };

    let finalUpdatedStocks;
    if (type === "jenis") {
      finalUpdatedStocks = stocks.filter(
        (stock) => stock.jenis !== itemToRemove
      );
    } else {
      finalUpdatedStocks = stocks.filter(
        (stock) => stock.size !== itemToRemove
      );
    }

    setJenisProduk(updatedTipe);
    setStocks(finalUpdatedStocks);
    onChange({ type: updatedTipe, stocks: finalUpdatedStocks });

    if (type === "jenis" && selectedJenis === itemToRemove) {
      const remainingJenis = updatedTipe.jenis.filter(
        (j) => j && j.trim() !== ""
      );
      setSelectedJenis(remainingJenis.length > 0 ? remainingJenis[0] : null);
    }
  };

  const handleChangeVariasi = (type, index, value) => {
    const oldItemValue = jenisProduk[type][index];
    const updatedTipe = {
      ...jenisProduk,
      [type]: jenisProduk[type].map((item, i) => (i === index ? value : item)),
    };

    const updatedStocks = stocks.map((stock) => {
      if (type === "jenis" && stock.jenis === oldItemValue) {
        return { ...stock, jenis: value };
      }
      if (type === "size" && stock.size === oldItemValue) {
        return { ...stock, size: value };
      }
      return stock;
    });

    setJenisProduk(updatedTipe);
    setStocks(updatedStocks);
    onChange({ type: updatedTipe, stocks: updatedStocks });

    if (type === "jenis" && selectedJenis === oldItemValue) {
      setSelectedJenis(value);
    }
  };

  const handleStockChange = (jenisInput, sizeInput, field, value) => {
    if (!jenisInput || !sizeInput) {
      return;
    }

    let currentStocks = [...stocks];
    const existingIndex = currentStocks.findIndex(
      (item) => item.jenis === jenisInput && item.size === sizeInput
    );

    let newValue;
    if (field === "stock" || field === "price" || field === "discount") {
      newValue = value === "" ? 0 : parseFloat(value);
      if (isNaN(newValue)) newValue = 0;
    } else {
      newValue = value;
    }

    if (existingIndex >= 0) {
      currentStocks[existingIndex] = {
        ...currentStocks[existingIndex],
        [field]: newValue,
      };
    } else {
      const databaseStockItem = data.stocks.find(
        (s) => s.jenis === jenisInput && s.size === sizeInput
      );
      const newStockItem = {
        _id: databaseStockItem?._id || undefined,
        jenis: jenisInput,
        size: sizeInput,
        stock: databaseStockItem?.stock || 0,
        price: databaseStockItem?.price || 0,
        discount: databaseStockItem?.discount || 0,
        satuan: databaseStockItem?.satuan || "kg",
      };
      newStockItem[field] = newValue;
      currentStocks.push(newStockItem);
    }
    setStocks(currentStocks);
    onChange({ type: jenisProduk, stocks: currentStocks });
  };

  const getStockValue = (jenisInput, sizeInput, field) => {
    const item = stocks.find(
      (s) => s.jenis === jenisInput && s.size === sizeInput
    );
    if (item) {
      if (field === "satuan") return item.satuan || "kg";
      return item[field] !== undefined
        ? item[field]
        : field === "stock" || field === "price" || field === "discount"
        ? 0
        : "";
    }
    const databaseItem = data.stocks.find(
      (s) => s.jenis === jenisInput && s.size === sizeInput
    );
    if (databaseItem) {
      if (field === "satuan") return databaseItem.satuan || "kg";
      return databaseItem[field] !== undefined
        ? databaseItem[field]
        : field === "stock" || field === "price" || field === "discount"
        ? 0
        : "";
    }
    if (field === "satuan") return "kg";
    if (field === "stock" || field === "price" || field === "discount")
      return 0;
    return "";
  };

  const generateStockCombinations = () => {
    const validJenis = jenisProduk.jenis.filter((j) => j && j.trim() !== "");
    const validSizes = jenisProduk.size.filter((s) => s && s.trim() !== "");

    if (validJenis.length > 0 && validSizes.length > 0) {
      setCurrentStep("stok");
      if (
        (!selectedJenis || !validJenis.includes(selectedJenis)) &&
        validJenis.length > 0
      ) {
        setSelectedJenis(validJenis[0]);
      }

      let newStocksArray = [];

      validJenis.forEach((currentJenis) => {
        validSizes.forEach((currentSize) => {
          const databaseStockItem = data.stocks.find(
            (s) => s.jenis === currentJenis && s.size === currentSize
          );
          const existingStockItem = stocks.find(
            (s) => s.jenis === currentJenis && s.size === currentSize
          );

          if (databaseStockItem) {
            newStocksArray.push({
              _id: databaseStockItem._id || undefined,
              jenis: databaseStockItem.jenis,
              size: databaseStockItem.size,
              stock: databaseStockItem.stock || 0,
              price: databaseStockItem.price || 0,
              discount: databaseStockItem.discount || 0,
              satuan: databaseStockItem.satuan || "kg",
            });
          } else if (existingStockItem) {
            newStocksArray.push({ ...existingStockItem });
          } else {
            newStocksArray.push({
              _id: undefined,
              jenis: currentJenis,
              size: currentSize,
              stock: 0,
              price: 0,
              discount: 0,
              satuan: "kg",
            });
          }
        });
      });
      setStocks(newStocksArray);
      onChange({ type: jenisProduk, stocks: newStocksArray });
    } else {
      alert("Mohon isi Jenis Ikan dan Ukuran terlebih dahulu.");
    }
  };

  const renderJenisStep = () => (
    <div>
      {/* Perubahan: Warna teks judul */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Jenis Produk
      </h2>
      {Object.keys(jenisProduk).map((tipeKey) => (
        <div key={tipeKey} className="mb-4 border-b dark:border-gray-600 pb-4">
          {/* Perubahan: Warna teks label */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tipeKey === "jenis" ? "Jenis Ikan" : "Ukuran"}
          </label>
          {jenisProduk[tipeKey].map((variasi, index) => (
            <div key={index} className="flex items-center mb-2">
              {/* Perubahan: Styling input untuk dark mode */}
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
                placeholder={`Masukkan ${
                  tipeKey === "jenis" ? "Jenis Ikan" : "Ukuran"
                }`}
                value={variasi}
                onChange={(e) =>
                  handleChangeVariasi(tipeKey, index, e.target.value)
                }
              />
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                onClick={() => handleRemoveVariasi(tipeKey, index)}
              >
                ✖
              </button>
            </div>
          ))}
          {/* Perubahan: Styling tombol tambah untuk dark mode */}
          <button
            type="button"
            className="mt-2 px-4 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 cursor-pointer"
            onClick={() => handleAddVariasi(tipeKey)}
          >
            + Tambah {tipeKey === "jenis" ? "Jenis Ikan" : "Ukuran"}
          </button>
        </div>
      ))}

      {jenisProduk.jenis.some((j) => j && j.trim() !== "") &&
        jenisProduk.size.some((s) => s && s.trim() !== "") && (
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={generateStockCombinations}
          >
            Atur Stok dan Harga
          </button>
        )}
    </div>
  );

  const renderStokStep = () => {
    const validJenisToRender = jenisProduk.jenis.filter(
      (j) => j && j.trim() !== ""
    );
    const validSizesToRender = jenisProduk.size.filter(
      (s) => s && s.trim() !== ""
    );

    if (validJenisToRender.length === 0 && currentStep === "stok") {
      setCurrentStep("jenis");
      return null;
    }

    return (
      <div>
        {/* Perubahan: Warna teks judul */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Atur Stok dan Harga
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {/* Perubahan: Warna teks sub-judul */}
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenis Ikan
            </h3>
            {/* Perubahan: Styling list untuk dark mode */}
            <div className="border dark:border-gray-600 rounded-md overflow-hidden">
              {validJenisToRender.map((jenisItem, index) => (
                <div
                  key={index}
                  className={`p-3 cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                    selectedJenis === jenisItem
                      ? "bg-blue-100 border-l-4 border-blue-500 dark:bg-blue-900/50 dark:border-blue-400 font-semibold"
                      : "border-l-4 border-transparent"
                  }`}
                  onClick={() => setSelectedJenis(jenisItem)}
                >
                  {jenisItem}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/3">
            {selectedJenis && validJenisToRender.includes(selectedJenis) ? (
              <>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ukuran untuk {selectedJenis}
                </h3>
                {validSizesToRender.length > 0 ? (
                  <div className="overflow-x-auto">
                    {/* Perubahan: Styling tabel untuk dark mode */}
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Ukuran
                          </th>
                          <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Stok
                          </th>
                          <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Satuan
                          </th>
                          <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Harga
                          </th>
                          <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Diskon (%)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {validSizesToRender.map((sizeItem, index) => (
                          <tr
                            key={`${selectedJenis}-${sizeItem}-${index}`}
                            className="border-b dark:border-gray-700"
                          >
                            <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                              {sizeItem}
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={getStockValue(
                                  selectedJenis,
                                  sizeItem,
                                  "stock"
                                )}
                                onChange={(e) =>
                                  handleStockChange(
                                    selectedJenis,
                                    sizeItem,
                                    "stock",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <select
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={getStockValue(
                                  selectedJenis,
                                  sizeItem,
                                  "satuan"
                                )}
                                onChange={(e) =>
                                  handleStockChange(
                                    selectedJenis,
                                    sizeItem,
                                    "satuan",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="ekor">Ekor</option>
                              </select>
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={getStockValue(
                                  selectedJenis,
                                  sizeItem,
                                  "price"
                                )}
                                onChange={(e) =>
                                  handleStockChange(
                                    selectedJenis,
                                    sizeItem,
                                    "price",
                                    e.target.value
                                  )
                                }
                                min="0"
                                step="any"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={getStockValue(
                                  selectedJenis,
                                  sizeItem,
                                  "discount"
                                )}
                                onChange={(e) =>
                                  handleStockChange(
                                    selectedJenis,
                                    sizeItem,
                                    "discount",
                                    e.target.value
                                  )
                                }
                                min="0"
                                max="100"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    Mohon tambahkan ukuran untuk jenis ikan ini.
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                {validJenisToRender.length > 0
                  ? "Pilih jenis ikan."
                  : "Mohon isi dan pilih jenis ikan di langkah sebelumnya."}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          onClick={() => setCurrentStep("jenis")}
        >
          Kembali
        </button>
      </div>
    );
  };

  return (
    <div>{currentStep === "jenis" ? renderJenisStep() : renderStokStep()}</div>
  );
};

export default JenisProduk;
