import React, { useState, useEffect } from "react"; // Tambahkan useEffect
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // Menggunakan Lucide icons

const ModalView = ({ isOpen, onClose, item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset currentImageIndex ketika item berubah atau modal dibuka/tutup
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const {
    name,
    description,
    images = [],
    // price, // Tidak digunakan jika pricing dari stocks
    // discount, // Tidak digunakan jika pricing dari stocks
    // stock, // Tidak digunakan jika stock dari stocks
    // type = { jenis: [], size: [] }, // Ini sepertinya tidak terpakai lagi karena ada stocks array
    weight,
    dimensions = { length: 0, width: 0, height: 0 }, // Tambah width jika ada
    isPublished,
    stocks = [], // Array yang berisi variasi produk dengan harga dan stok masing-masing
  } = item;

  const totalStock = Array.isArray(stocks)
    ? stocks.reduce((sum, stockItem) => sum + (stockItem.stock || 0), 0)
    : 0;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const DetailItem = ({ label, value, valueClassName = "" }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <p className="text-sm text-gray-600">{label}:</p>
      <p className={`text-sm font-medium text-gray-800 ${valueClassName}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose} // Tutup modal jika klik di luar konten
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative max-h-[95vh] flex flex-col" // Lebarkan modal dan gunakan flex column
        onClick={(e) => e.stopPropagation()} // Hindari penutupan modal jika klik di dalam konten
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Produk: {name}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Bagian Atas: Gambar dan Info Singkat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carousel Gambar */}
            {images.length > 0 ? (
              <div className="relative group">
                <img
                  src={images[currentImageIndex]}
                  alt={`${name} - Gambar ${currentImageIndex + 1}`}
                  className="w-full h-72 object-cover rounded-lg shadow-md border border-gray-200"
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-700 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousImage();
                      }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-700 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs rounded-full px-3 py-1">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-72 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shadow-md border">
                <p>Tidak ada gambar</p>
              </div>
            )}

            {/* Informasi Produk Samping Gambar */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description || "Tidak ada deskripsi untuk produk ini."}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <DetailItem label="Berat" value={`${weight || "N/A"} kg`} />
                <DetailItem
                  label="Dimensi (PxLxT)"
                  value={`${dimensions.length || "N/A"} x ${
                    dimensions.width || "N/A" // Tambahkan width
                  } x ${dimensions.height || "N/A"} cm`}
                />
                <DetailItem label="Total Stok Saat Ini" value={totalStock} />
                <DetailItem
                  label="Status Publikasi"
                  value={isPublished ? "Published" : "Unpublished"}
                  valueClassName={
                    isPublished ? "text-green-600" : "text-red-600"
                  }
                />
              </div>
            </div>
          </div>

          {/* Pricing dalam Tabel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Variasi Harga dan Stok
            </h3>
            {Array.isArray(stocks) && stocks.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Jenis
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ukuran
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Satuan
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Harga Asli (Rp)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Diskon (%)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Harga Akhir (Rp)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Stok
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stocks.map((stockItem, index) => {
                      const discountedPrice =
                        stockItem.price -
                        (stockItem.price * (stockItem.discount || 0)) / 100;
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {stockItem.jenis || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {stockItem.size || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {stockItem.satuan || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stockItem.price?.toLocaleString("id-ID") || "0"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                            {stockItem.discount || 0}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">
                            {discountedPrice?.toLocaleString("id-ID") || "0"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                            {stockItem.stock || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md border">
                Tidak ada data variasi harga dan stok untuk produk ini.
              </p>
            )}
          </div>
        </div>

        {/* Footer Modal (Opsional, bisa untuk tombol aksi lain) */}
        {/* <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Tutup
            </button>
          </div> */}
      </div>
    </div>
  );
};

export default ModalView;
