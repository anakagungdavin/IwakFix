import React, { useEffect, useState } from "react";

const JenisProduk = ({
  data = { type: { jenis: [], size: [] }, stocks: [] },
  onChange = () => {},
}) => {
  const [jenisProduk, setJenisProduk] = useState({
    jenis: Array.isArray(data.type?.jenis) ? [...data.type.jenis] : [],
    size: Array.isArray(data.type?.size) ? [...data.type.size] : [],
  });

  const [currentStep, setCurrentStep] = useState("jenis");
  const [stocks, setStocks] = useState(() =>
    Array.isArray(data.stocks)
      ? data.stocks.map((stock) => ({
          jenis: stock._doc ? stock._doc.jenis : stock.jenis,
          size: stock._doc ? stock._doc.size : stock.size,
          stock: stock._doc ? stock._doc.stock : stock.stock,
          price: stock._doc ? stock._doc.price : stock.price,
          discount: stock._doc ? stock._doc.discount : stock.discount,
        }))
      : []
  );
  const [selectedJenis, setSelectedJenis] = useState(null);

  useEffect(() => {
    setJenisProduk({
      jenis: Array.isArray(data.type?.jenis) ? [...data.type.jenis] : [],
      size: Array.isArray(data.type?.size) ? [...data.type.size] : [],
    });
    const transformedStocks = Array.isArray(data.stocks)
      ? data.stocks.map((stock) => ({
          jenis: stock._doc ? stock._doc.jenis : stock.jenis,
          size: stock._doc ? stock._doc.size : stock.size,
          stock: stock._doc ? stock._doc.stock : stock.stock,
          price: stock._doc ? stock._doc.price : stock.price,
          discount: stock._doc ? stock._doc.discount : stock.discount,
        }))
      : [];
    setStocks(transformedStocks);
    console.log("Transformed stocks:", transformedStocks);

    // Set default selectedJenis hanya saat data awal dimuat
    if (transformedStocks.length > 0 && !selectedJenis) {
      setSelectedJenis(transformedStocks[0].jenis);
    } else if (jenisProduk.jenis.length > 0 && !selectedJenis) {
      setSelectedJenis(jenisProduk.jenis[0]);
    }
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

    const updatedStocks = stocks.filter(
      (stock) =>
        !(type === "jenis"
          ? stock.jenis === jenisProduk[type][index]
          : stock.size === jenisProduk[type][index])
    );

    setJenisProduk(updatedJenis);
    setStocks(updatedStocks);
    onChange({ type: updatedJenis, stocks: updatedStocks });

    if (type === "jenis" && selectedJenis === jenisProduk[type][index]) {
      const remainingJenis = updatedJenis.jenis;
      setSelectedJenis(remainingJenis.length > 0 ? remainingJenis[0] : null);
    }
  };

  const handleChangeVariasi = (type, index, value) => {
    const updatedJenis = {
      ...jenisProduk,
      [type]: jenisProduk[type].map((item, i) => (i === index ? value : item)),
    };

    const updatedStocks = stocks.map((stock) => {
      if (type === "jenis" && stock.jenis === jenisProduk[type][index]) {
        return { ...stock, jenis: value };
      }
      if (type === "size" && stock.size === jenisProduk[type][index]) {
        return { ...stock, size: value };
      }
      return stock;
    });

    setJenisProduk(updatedJenis);
    setStocks(updatedStocks);
    onChange({ type: updatedJenis, stocks: updatedStocks });

    if (type === "jenis" && selectedJenis === jenisProduk[type][index]) {
      setSelectedJenis(value);
    }
  };

  const handleStockChange = (jenis, size, field, value) => {
    console.log("handleStockChange dipanggil:", { jenis, size, field, value });

    if (!jenis || !size) {
      console.warn("Jenis atau size tidak valid, abaikan perubahan:", {
        jenis,
        size,
      });
      return;
    }

    const updatedStocks = [...stocks];
    const existingIndex = updatedStocks.findIndex(
      (item) => item.jenis === jenis && item.size === size
    );

    let newValue;
    if (field === "stock" || field === "price" || field === "discount") {
      newValue = value === "" ? 0 : parseInt(value) || 0;
    } else {
      newValue = value;
    }

    if (existingIndex >= 0) {
      updatedStocks[existingIndex] = {
        ...updatedStocks[existingIndex],
        [field]: newValue,
      };
    } else {
      updatedStocks.push({
        jenis,
        size,
        stock: field === "stock" ? newValue : 0,
        price: field === "price" ? newValue : 0,
        discount: field === "discount" ? newValue : 0,
      });
    }

    console.log("Stocks setelah perubahan:", updatedStocks);
    setStocks(updatedStocks);
    onChange({ type: jenisProduk, stocks: updatedStocks });
  };

  const getStockValue = (jenis, size, field) => {
    const item = stocks.find(
      (item) => item.jenis === jenis && item.size === size
    );
    const value = item ? item[field] : 0;
    console.log("getStockValue:", { jenis, size, field, value });
    return value;
  };

  const generateStockCombinations = () => {
    if (jenisProduk.jenis.length > 0 && jenisProduk.size.length > 0) {
      setCurrentStep("stok");
      if (!selectedJenis && jenisProduk.jenis.length > 0) {
        setSelectedJenis(jenisProduk.jenis[0]);
      }
    }
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
                placeholder={`Masukkan ${
                  type === "jenis" ? "Jenis Ikan" : "Ukuran"
                }`}
                value={variasi}
                onChange={(e) =>
                  handleChangeVariasi(type, index, e.target.value)
                }
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
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Atur Stok dan Harga
      </h2>

      <div className="flex mb-6">
        <div className="w-1/3 pr-4">
          <h3 className="font-medium text-gray-700 mb-2">Jenis Ikan</h3>
          <div className="border rounded-md overflow-hidden">
            {jenisProduk.jenis.map((jenis, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedJenis === jenis
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedJenis(jenis)}
              >
                {jenis}
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3">
          {selectedJenis && jenisProduk.jenis.includes(selectedJenis) ? (
            <>
              <h3 className="font-medium text-gray-700 mb-2">
                Ukuran untuk {selectedJenis}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Ukuran</th>
                      <th className="py-2 px-4 border">Stok</th>
                      <th className="py-2 px-4 border">Harga</th>
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
                            value={getStockValue(selectedJenis, size, "stock")}
                            onChange={(e) => {
                              console.log(
                                "Input stok berubah:",
                                e.target.value
                              );
                              handleStockChange(
                                selectedJenis,
                                size,
                                "stock",
                                e.target.value
                              );
                            }}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(selectedJenis, size, "price")}
                            onChange={(e) => {
                              console.log(
                                "Input harga berubah:",
                                e.target.value
                              );
                              handleStockChange(
                                selectedJenis,
                                size,
                                "price",
                                e.target.value
                              );
                            }}
                          />
                        </td>
                        <td className="py-2 px-4 border">
                          <input
                            type="number"
                            className="w-full rounded-md border border-gray-300 bg-white py-1 px-2 text-black outline-none focus:border-blue-500"
                            value={getStockValue(
                              selectedJenis,
                              size,
                              "discount"
                            )}
                            onChange={(e) => {
                              console.log(
                                "Input diskon berubah:",
                                e.target.value
                              );
                              handleStockChange(
                                selectedJenis,
                                size,
                                "discount",
                                e.target.value
                              );
                            }}
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
    <div>{currentStep === "jenis" ? renderJenisStep() : renderStokStep()}</div>
  );
};

export default JenisProduk;
