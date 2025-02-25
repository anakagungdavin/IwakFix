import React, { useState, useEffect } from "react";

const UploadGambar = ({ data = {}, onUpload, onRemove, mode = "add" }) => {
  const [gambarList, setGambarList] = useState([]); // Array untuk multiple images

  // Inisialisasi gambar dari data API saat mode edit
  useEffect(() => {
    if (mode === "edit" && data.images && Array.isArray(data.images)) {
      const initialImages = data.images.map((url, index) => ({
        id: `existing-image-${index}`,
        url,
        file: null, // Tidak ada file mentah saat fetch dari API
      }));
      setGambarList(initialImages);
      console.log("Inisialisasi gambar dari API:", initialImages); // Debugging
    } else {
      setGambarList([]); // Reset jika tidak ada gambar
    }
  }, [data.images, mode]);

  const handleChange = (event) => {
    const files = Array.from(event.target.files); // Ambil semua file yang dipilih
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        id: file.name,
        url: URL.createObjectURL(file),
        file,
      }));

      // Hapus URL preview lama untuk mencegah memory leak
      gambarList.forEach((item) => {
        if (item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });

      setGambarList((prevList) => [
        ...prevList.filter((item) => !item.file), // Simpan gambar lama tanpa file
        ...newImages, // Tambahkan gambar baru
      ]);
      if (onUpload) {
        console.log("Mengirim file baru ke parent:", files); // Debugging
        onUpload(files); // Kirim semua file baru ke parent
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files); // Ambil semua file yang di-drop
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        id: file.name,
        url: URL.createObjectURL(file),
        file,
      }));

      // Hapus URL preview lama
      gambarList.forEach((item) => {
        if (item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });

      setGambarList((prevList) => [
        ...prevList.filter((item) => !item.file), // Simpan gambar lama tanpa file
        ...newImages, // Tambahkan gambar baru
      ]);
      if (onUpload) {
        console.log("Mengirim file baru via drop:", files); // Debugging
        onUpload(files); // Kirim semua file baru ke parent
      }
    }
  };

  const handleRemove = (id) => {
    const filteredList = gambarList.filter((item) => item.id !== id);
    const removedImage = gambarList.find((item) => item.id === id);

    // Hapus URL preview yang dihapus untuk mencegah memory leak
    if (removedImage && removedImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.url);
    }

    setGambarList(filteredList);

    if (onRemove) {
      // Kirim URL permanen yang dihapus ke parent (hanya untuk gambar dari server)
      if (removedImage && !removedImage.url.startsWith("blob:")) {
        console.log(
          "Mengirim URL gambar yang dihapus ke parent:",
          removedImage.url
        );
        onRemove(removedImage.url); // Kirim URL permanen yang dihapus
      }
    }

    if (onUpload) {
      console.log(
        "Menghapus gambar, reset ke file yang tersisa:",
        filteredList.map((item) => item.file).filter(Boolean)
      );
      onUpload(filteredList.map((item) => item.file).filter(Boolean)); // Kirim file yang tersisa
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Media</h2>
      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-5 text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {gambarList.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {gambarList.map((item) => (
              <div
                key={item.id}
                className="relative bg-white p-2 rounded-md shadow"
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.url}
                    alt={`Preview ${item.id}`}
                    className="w-40 h-40 object-cover rounded-md"
                    onError={(e) =>
                      console.error("Gambar gagal dimuat:", e, item.url)
                    } // Debugging jika gambar tidak dimuat
                  />
                </a>
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

        {/* Tombol Tambah Gambar */}
        <label className="px-4 py-2 bg-[#003D47] text-white rounded-md mt-4 inline-block cursor-pointer">
          Tambah Gambar
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            multiple={true} // Aktifkan multiple upload
          />
        </label>
      </div>
    </div>
  );
};

export default UploadGambar;
