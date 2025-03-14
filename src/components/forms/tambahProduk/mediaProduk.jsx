import React, { useState, useEffect } from "react";

const UploadGambar = ({ data = {}, onUpload, onRemove, mode = "add" }) => {
  const [gambarList, setGambarList] = useState([]);

  // Inisialisasi gambar dari data.images
  useEffect(() => {
    if (data.images && Array.isArray(data.images)) {
      const initialImages = data.images.map((url, index) => ({
        id: `image-${index}`,
        url,
        file: null, // Tidak ada file mentah saat inisialisasi
      }));
      setGambarList(initialImages);
    }
  }, [data.images]); // Jalankan ulang saat data.images berubah

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        id: file.name,
        url: URL.createObjectURL(file),
        file,
      }));
      setGambarList((prevList) => [...prevList, ...newImages]);
      if (onUpload) onUpload(files);
    }
  };

  const handleRemove = (id) => {
    const removedImage = gambarList.find((item) => item.id === id);
    if (removedImage && removedImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.url);
    }
    const filteredList = gambarList.filter((item) => item.id !== id);
    setGambarList(filteredList);
    if (onRemove && removedImage) onRemove(removedImage.url);
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Media</h2>
      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-5 text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            const newImages = files.map((file) => ({
              id: file.name,
              url: URL.createObjectURL(file),
              file,
            }));
            setGambarList((prevList) => [...prevList, ...newImages]);
            if (onUpload) onUpload(files);
          }
        }}
      >
        {gambarList.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {gambarList.map((item) => (
              <div
                key={item.id}
                className="relative bg-white p-2 rounded-md shadow"
              >
                <img
                  src={item.url}
                  alt={`Preview ${item.id}`}
                  className="w-40 h-40 object-cover rounded-md"
                  onError={(e) => console.error("Gambar gagal dimuat:", e, item.url)}
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 bg-[#FEECEE] text-[#EB3D4D] rounded-full p-1 text-xs shadow-md"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-200 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V12m0 0V8m0 4h4m4 0h4m-4 0V8m0 4v4m-4-4v4m0-4V8m0 4H7"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Drag and drop image here, or click add image
            </p>
          </div>
        )}

        <label className="px-4 py-2 bg-[#003D47] text-white rounded-md mt-4 inline-block cursor-pointer">
          Tambah Gambar
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            multiple={true}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadGambar;