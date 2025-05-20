import React, { useEffect, useState } from "react";

const JenisProduk = ({
  data = { type: { jenis: [], size: [] }, stocks: [] },
  onChange = () => {},
}) => {
  // Log data.stocks mentah untuk debugging
  console.log(
    "Raw data.stocks dari prop:",
    JSON.stringify(data.stocks, null, 2)
  );

  const [jenisProduk, setJenisProduk] = useState({
    jenis: Array.isArray(data.type?.jenis) ? [...data.type.jenis] : [],
    size: Array.isArray(data.type?.size) ? [...data.type.size] : [],
  });

  const [currentStep, setCurrentStep] = useState("jenis");
  const [stocks, setStocks] = useState(() => {
    const initialStocks = Array.isArray(data.stocks)
      ? data.stocks.map((stock) => {
          if (!stock.satuan) {
            console.warn(
              `Stock item ${stock.jenis}-${stock.size} tidak memiliki satuan di database, menggunakan default 'kg'`
            );
          }
          return {
            _id: stock._id || undefined,
            jenis: stock.jenis,
            size: stock.size,
            stock: stock.stock || 0,
            price: stock.price || 0,
            discount: stock.discount || 0,
            satuan: stock.satuan || "kg", // Default hanya jika satuan benar-benar tidak ada
          };
        })
      : [];
    console.log(
      "Initial stocks di useState:",
      JSON.stringify(initialStocks, null, 2)
    );
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
      ? data.stocks.map((stock) => {
          if (!stock.satuan) {
            console.warn(
              `Stock item ${stock.jenis}-${stock.size} tidak memiliki satuan di database, menggunakan default 'kg'`
            );
          }
          return {
            _id: stock._id || undefined,
            jenis: stock.jenis,
            size: stock.size,
            stock: stock.stock || 0,
            price: stock.price || 0,
            discount: stock.discount || 0,
            satuan: stock.satuan || "kg",
          };
        })
      : [];
    console.log(
      "Transformed stocks di useEffect:",
      JSON.stringify(transformedStocks, null, 2)
    );
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
            if (!databaseStockItem.satuan) {
              console.warn(
                `Database stock item ${currentJenis}-${currentSize} tidak memiliki satuan, menggunakan default 'kg'`
              );
            }
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

      console.log(
        "New stocks array di generateStockCombinations:",
        JSON.stringify(newStocksArray, null, 2)
      );
      setStocks(newStocksArray);
      onChange({ type: jenisProduk, stocks: newStocksArray });
    } else {
      alert("Mohon isi Jenis Ikan dan Ukuran terlebih dahulu.");
    }
  };

  const renderJenisStep = () => (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Jenis Produk</h2>
      {Object.keys(jenisProduk).map((tipeKey) => (
        <div key={tipeKey} className="mb-4 border-b pb-4">
          <label className="block text-gray-600 mb-1">
            {tipeKey === "jenis" ? "Jenis Ikan" : "Ukuran"}
          </label>
          {jenisProduk[tipeKey].map((variasi, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white py-3 px-5 text-black outline-none focus:border-blue-500"
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
                className="ml-2 text-red-500"
                onClick={() => handleRemoveVariasi(tipeKey, index)}
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-[#E9FAF7] text-[#1A9882]"
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
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
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Atur Stok dan Harga
        </h2>

        <div className="flex mb-6">
          <div className="w-1/3 pr-4">
            <h3 className="font-medium text-gray-700 mb-2">Jenis Ikan</h3>
            <div className="border rounded-md overflow-hidden">
              {validJenisToRender.map((jenisItem, index) => (
                <div
                  key={index}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedJenis === jenisItem
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedJenis(jenisItem)}
                >
                  {jenisItem}
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/3">
            {selectedJenis && validJenisToRender.includes(selectedJenis) ? (
              <>
                <h3 className="font-medium text-gray-700 mb-2">
                  Ukuran untuk {selectedJenis}
                </h3>
                {validSizesToRender.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border">Ukuran</th>
                          <th className="py-2 px-4 border">Stok</th>
                          <th className="py-2 px-4 border">Satuan</th>
                          <th className="py-2 px-4 border">Harga</th>
                          <th className="py-2 px-4 border">Diskon (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validSizesToRender.map((sizeItem, index) => (
                          <tr
                            key={`${selectedJenis}-${sizeItem}-${index}`}
                            className="border-b"
                          >
                            <td className="py-2 px-4 border">{sizeItem}</td>
                            <td className="py-2 px-4 border">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
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
                            <td className="py-2 px-4 border">
                              <select
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
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
                            <td className="py-2 px-4 border">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
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
                            <td className="py-2 px-4 border">
                              <input
                                type="number"
                                className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
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
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    Mohon tambahkan ukuran untuk jenis ikan ini.
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                {validJenisToRender.length > 0
                  ? "Pilih jenis ikan."
                  : "Mohon isi dan pilih jenis ikan di langkah sebelumnya."}
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
  };

  return (
    <div>{currentStep === "jenis" ? renderJenisStep() : renderStokStep()}</div>
  );
};

export default JenisProduk;
