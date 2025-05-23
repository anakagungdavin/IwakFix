import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InformasiProduk from "../../components/forms/tambahProduk/informasiProduk";
import JenisProduk from "../../components/forms/tambahProduk/jenisProduk";
import BeratProduk from "../../components/forms/tambahProduk/beratProduk";
import UploadGambar from "../../components/forms/tambahProduk/mediaProduk";
import CancelModal from "../../components/modal/modalCancel";
import UploadSuccessModal from "../../components/modal/modalBerhasilUpload";
import SimpanModal from "../../components/modal/modalBerhasilSimpan";
import { getProductById, updateProduct } from "../../services/api";

// Fungsi getStatus tetap sama
export function getStatus(stok, isPublished) {
  if (!isPublished)
    return { label: "Draft", jenis: "bg-[#F0F1F3] text-[#667085]" };
  if (stok === 0)
    return { label: "Out of Stock", jenis: "bg-[#FEECEE] text-[#EB3D4D]" };
  if (stok < 10)
    return { label: "Low Stock", jenis: "bg-[#FFF0EA] text-[#F86624]" };
  return { label: "Published", jenis: "bg-[#E9FAF7] text-[#1A9882]" };
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    images: [],
    imageFiles: [], // Untuk file gambar baru yang akan diupload
    weight: 0,
    dimensions: {
      height: 0,
      length: 0,
    },
    type: {
      jenis: [],
      size: [],
    },
    seller: localStorage.getItem("sellerId") || "default-seller-id", // Pastikan sellerId ada atau berikan default yang valid
    isPublished: true,
    stocks: [],
  });
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false); // <-- STATE BARU
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [isSimpanSuccess, setSimpanSuccess] = useState(false);
  const [removedImages, setRemovedImages] = useState([]); // Untuk melacak URL gambar yang ada yang dihapus

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProductNotFound(false); // Reset state product not found
      try {
        const data = await getProductById(id);
        if (!data) {
          setProductNotFound(true); // <-- SET STATE JIKA PRODUK TIDAK DITEMUKAN
          throw new Error("Produk tidak ditemukan di database");
        }

        const transformedStocks = Array.isArray(data.stocks)
          ? data.stocks.map((stock, index) => ({
              // Tambahkan index jika diperlukan untuk fallback nama
              _id: stock._id || undefined, // Penting untuk update
              jenis: stock.jenis || `Jenis-${index + 1}`, // Fallback jika data jenis kosong
              size: stock.size || `Size-${index + 1}`, // Fallback jika data size kosong
              stock: stock.stock || 0,
              price: stock.price || 0,
              discount: stock.discount || 0,
              satuan: stock.satuan || "kg",
            }))
          : [];

        setProduct({
          name: data.name || "",
          description: data.description || "",
          images: data.images || [], // Ini adalah URL gambar yang sudah ada
          imageFiles: [], // Kosongkan imageFiles saat load
          weight: data.weight || 0,
          dimensions: {
            height: data.dimensions?.height || 0,
            length: data.dimensions?.length || 0,
          },
          type: {
            jenis: data.type?.jenis || [],
            size: data.type?.size || [],
          },
          seller:
            data.seller?._id ||
            data.seller ||
            localStorage.getItem("sellerId") ||
            "default-seller-id", // Ambil ID seller jika dipopulate
          isPublished: data.isPublished !== undefined ? data.isPublished : true,
          stocks: transformedStocks,
        });
        setRemovedImages([]); // Reset removed images saat load
        console.log("Product data fetched:", data);
      } catch (error) {
        console.error("Gagal memuat produk:", error.message);
        if (!error.message.includes("Produk tidak ditemukan di database")) {
          alert("Gagal memuat produk. Periksa koneksi atau coba lagi.");
        }
        // Jika error karena produk tidak ditemukan, productNotFound sudah true
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      // Hanya fetch jika ID ada
      fetchProduct();
    } else {
      setLoading(false);
      setProductNotFound(true); // Jika tidak ada ID, anggap produk tidak ditemukan
      console.error("Product ID is missing.");
    }
  }, [id]);

  const handleInputChange = (e) => {
    // Pastikan e dan e.target ada untuk menghindari error jika event tidak sesuai format
    if (e && e.target) {
      const { name, value, type: inputType, checked } = e.target;

      if (name.startsWith("dimensions.")) {
        const dimensionField = name.split(".")[1];
        setProduct((prevState) => ({
          ...prevState,
          dimensions: {
            ...prevState.dimensions,
            [dimensionField]: parseFloat(value) || 0,
          },
        }));
      } else if (inputType === "checkbox" && name === "isPublished") {
        setProduct((prevState) => ({
          ...prevState,
          isPublished: checked,
        }));
      } else {
        setProduct((prevState) => ({
          ...prevState,
          [name]: ["weight"].includes(name) ? parseFloat(value) || 0 : value,
        }));
      }
    } else if (e && e.weight !== undefined && e.dimensions !== undefined) {
      // Dari BeratProduk
      setProduct((prevState) => ({
        ...prevState,
        weight: parseFloat(e.weight) || 0,
        dimensions: {
          height: parseFloat(e.dimensions.height) || 0,
          length: parseFloat(e.dimensions.length) || 0,
        },
      }));
    } else if (e && e.type !== undefined && e.stocks !== undefined) {
      // Dari JenisProduk
      // Pastikan struktur stocks yang diterima dari JenisProduk benar
      const updatedStocks = Array.isArray(e.stocks)
        ? e.stocks.map((stock) => ({
            _id: stock._id || undefined, // Pastikan _id ada jika stock sudah ada sebelumnya
            jenis: stock.jenis,
            size: stock.size,
            satuan: stock.satuan || "kg", // Pastikan satuan ada
            stock: parseInt(stock.stock, 10) || 0,
            price: parseFloat(stock.price) || 0,
            discount: parseFloat(stock.discount) || 0,
          }))
        : [];

      setProduct((prevState) => ({
        ...prevState,
        type: {
          jenis: e.type.jenis || [],
          size: e.type.size || [],
        },
        stocks: updatedStocks,
      }));
    }
    // console.log("Product state updated:", product); // Hati-hati, product mungkin belum state terbaru di sini karena async
  };

  const handleAddImage = (newFiles) => {
    // Ganti nama parameter agar lebih jelas
    if (newFiles && newFiles.length > 0) {
      // Buat array URL preview untuk file baru
      const newImagePreviews = newFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setProduct((prevState) => ({
        ...prevState,
        // Gabungkan URL gambar yang sudah ada dengan preview file baru
        images: [
          ...prevState.images.filter((url) => !url.startsWith("blob:")),
          ...newImagePreviews,
        ],
        // Tambahkan file baru ke imageFiles
        imageFiles: [...prevState.imageFiles, ...newFiles],
      }));
    }
  };

  const handleRemoveImage = (removedImageUrl) => {
    setProduct((prevState) => {
      // Hapus dari array 'images' (URL yang ditampilkan)
      const newDisplayImages = prevState.images.filter(
        (url) => url !== removedImageUrl
      );

      // Hapus dari array 'imageFiles' jika itu adalah file baru (URL blob)
      let newImageFiles = prevState.imageFiles;
      if (removedImageUrl.startsWith("blob:")) {
        newImageFiles = prevState.imageFiles.filter((file) => {
          // Perlu cara untuk mencocokkan file dengan URL blob-nya.
          // Cara sederhana: jika hanya 1 file, dan URL-nya cocok, hapus.
          // Untuk multi-file, ini bisa lebih kompleks.
          // Salah satu cara: simpan mapping antara file dan URL blob-nya saat ditambahkan.
          // Untuk sekarang, kita asumsikan URL.createObjectURL(file) unik saat filter.
          // Namun, lebih baik menghapus berdasarkan index atau ID file jika memungkinkan.
          const tempUrl = URL.createObjectURL(file);
          const match = tempUrl === removedImageUrl;
          URL.revokeObjectURL(tempUrl); // Revoke setelah pengecekan
          return !match;
        });
        URL.revokeObjectURL(removedImageUrl); // Revoke URL blob yang dihapus
      }

      // Jika URL yang dihapus BUKAN blob (berarti gambar dari server), tambahkan ke removedImages
      if (!removedImageUrl.startsWith("blob:")) {
        setRemovedImages((prev) => [...new Set([...prev, removedImageUrl])]);
      }

      return {
        ...prevState,
        images: newDisplayImages,
        imageFiles: newImageFiles,
      };
    });
  };

  const handleSaveDraft = async () => {
    // Jadikan async jika ada operasi API
    // Validasi dasar minimal
    if (!product.name) {
      alert("Nama produk harus diisi untuk menyimpan sebagai draft.");
      return;
    }
    try {
      // Set isPublished ke false untuk draft
      const draftProductData = { ...product, isPublished: false };

      const formData = new FormData();
      formData.append("name", draftProductData.name);
      formData.append("description", draftProductData.description || ""); // Kirim string kosong jika tidak ada
      formData.append("weight", draftProductData.weight || 0);
      formData.append("seller", draftProductData.seller);
      formData.append("isPublished", draftProductData.isPublished); // false untuk draft
      formData.append(
        "dimensions",
        JSON.stringify(draftProductData.dimensions || { height: 0, length: 0 })
      );
      formData.append(
        "type",
        JSON.stringify(draftProductData.type || { jenis: [], size: [] })
      );
      formData.append("stocks", JSON.stringify(draftProductData.stocks || []));

      draftProductData.imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Gambar yang sudah ada (bukan blob dan tidak dihapus)
      const existingImages = draftProductData.images.filter(
        (url) => !url.startsWith("blob:") && !removedImages.includes(url)
      );
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
      // Gambar yang dihapus dari server
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      // Log FormData untuk debugging
      const formDataLog = {};
      for (const [key, value] of formData.entries()) {
        formDataLog[key] = value instanceof File ? value.name : value;
      }
      console.log("FormData (Draft) yang dikirim:", formDataLog);

      const response = await updateProduct(id, formData);
      if (!response) throw new Error("Gagal menyimpan draft produk");

      // Update state product dengan data dari response (terutama images jika ada perubahan)
      setProduct((prev) => ({
        ...prev,
        ...response, // Asumsikan response mengembalikan produk yang terupdate
        images: response.images || prev.images, // Jaga images jika response tidak mengembalikannya
        imageFiles: [], // Kosongkan file baru setelah upload
        isPublished: false, // Pastikan isPublished tetap false
      }));
      setRemovedImages([]); // Reset removed images

      setSimpanSuccess(true); // Tampilkan modal berhasil simpan
    } catch (error) {
      console.error("Error saving draft:", error.message);
      alert(`Gagal menyimpan draft: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const missingFields = [];
      if (!product.name.trim()) missingFields.push("Nama Produk"); // Trim untuk cek spasi
      if (!product.description.trim()) missingFields.push("Deskripsi Produk");

      if (missingFields.length > 0) {
        alert(`${missingFields.join(", ")} harus diisi!`);
        return; // Hentikan proses jika ada field wajib yang kosong
      }

      // Validasi stocks (jika jenis dan ukuran sudah dipilih)
      if (product.type.jenis.length > 0 || product.type.size.length > 0) {
        if (!product.stocks || product.stocks.length === 0) {
          alert(
            "Harap atur stok untuk setiap kombinasi jenis dan ukuran yang dipilih!"
          );
          return;
        }
        for (const stock of product.stocks) {
          if (!stock.jenis || !stock.size || !stock.satuan) {
            alert(
              `Detail stok (jenis, ukuran, satuan) tidak lengkap untuk salah satu entri stok.`
            );
            return;
          }
          if (
            stock.stock === undefined ||
            stock.stock < 0 ||
            isNaN(parseInt(stock.stock))
          ) {
            alert(
              `Jumlah stok tidak valid untuk ${stock.jenis} - ${stock.size}.`
            );
            return;
          }
          if (
            stock.price === undefined ||
            stock.price < 0 ||
            isNaN(parseFloat(stock.price))
          ) {
            alert(`Harga tidak valid untuk ${stock.jenis} - ${stock.size}.`);
            return;
          }
          // Diskon opsional, tapi jika ada harus valid
          if (
            stock.discount !== undefined &&
            (stock.discount < 0 ||
              stock.discount > 100 ||
              isNaN(parseFloat(stock.discount)))
          ) {
            alert(
              `Diskon tidak valid (0-100) untuk ${stock.jenis} - ${stock.size}.`
            );
            return;
          }
        }
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("weight", product.weight || 0);
      formData.append("seller", product.seller);
      formData.append("isPublished", product.isPublished); // Kirim status publish saat ini
      formData.append(
        "dimensions",
        JSON.stringify(product.dimensions || { height: 0, length: 0 })
      );
      formData.append(
        "type",
        JSON.stringify(product.type || { jenis: [], size: [] })
      );
      formData.append("stocks", JSON.stringify(product.stocks || []));

      // Tambahkan file gambar baru
      product.imageFiles.forEach((file) => {
        formData.append("images", file); // 'images' adalah key untuk file baru di backend
      });

      // Tambahkan URL gambar yang sudah ada (bukan blob dan tidak ada di removedImages)
      const existingImagesToKeep = product.images.filter(
        (url) => !url.startsWith("blob:") && !removedImages.includes(url)
      );
      if (existingImagesToKeep.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImagesToKeep));
      }

      // Tambahkan URL gambar yang dihapus (yang berasal dari server)
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      // Log FormData untuk debugging
      const formDataLog = {};
      for (const [key, value] of formData.entries()) {
        formDataLog[key] = value instanceof File ? value.name : value;
      }
      console.log("FormData (Update) yang dikirim:", formDataLog);

      const response = await updateProduct(id, formData);
      if (!response) throw new Error("Gagal memperbarui produk");

      // Update state product dengan data dari response (terutama images jika ada perubahan)
      setProduct((prev) => ({
        ...prev,
        ...response, // Asumsikan response mengembalikan produk yang terupdate
        images: response.images || prev.images, // Jaga images jika response tidak mengembalikannya
        imageFiles: [], // Kosongkan file baru setelah upload
      }));
      setRemovedImages([]); // Reset removed images

      setUploadSuccess(true); // Tampilkan modal berhasil update
    } catch (error) {
      console.error("Error updating product:", error.message);
      alert(`Gagal memperbarui produk: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setIsModalOpen(false);
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  // Kondisi render baru
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading produk...</p>
      </div>
    );
  if (productNotFound)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Produk tidak ditemukan.</p>
      </div>
    );
  // Jangan tampilkan "Produk tidak ditemukan" hanya karena product.name kosong saat edit

  return (
    <>
      <CancelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancel}
      />
      <UploadSuccessModal
        isOpen={isUploadSuccess}
        onClose={() => {
          setUploadSuccess(false);
          navigate("/admin/products"); // Arahkan ke daftar produk setelah sukses
        }}
        message="Produk berhasil diperbarui!"
      />
      <SimpanModal
        isOpen={isSimpanSuccess}
        onClose={() => {
          setSimpanSuccess(false);
          // navigate('/admin/products'); // Mungkin mau arahkan ke daftar produk juga
        }}
        message="Produk berhasil disimpan sebagai draft!"
      />

      <div className="bg-gray-100 min-h-screen py-6">
        {" "}
        {/* Ganti bg-gray-200 ke bg-gray-100 atau sesuai tema */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {" "}
          {/* Max width lebih kecil agar form tidak terlalu lebar */}
          <Breadcrumb pageName="Edit Produk" />
          <div className="grid grid-cols-1 gap-6 mt-6">
            {" "}
            {/* Sederhanakan grid, biarkan komponen form mengatur layout internalnya jika perlu */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <InformasiProduk
                data={product}
                // setData={setProduct} // Sebaiknya tidak pass setData langsung jika handleInputChange sudah cukup
                onChange={handleInputChange}
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <UploadGambar
                data={{
                  images: product.images,
                  imageFiles: product.imageFiles,
                }} // Kirim juga imageFiles jika perlu diakses di sana
                onUpload={handleAddImage}
                onRemove={handleRemoveImage}
                mode="edit"
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <JenisProduk
                data={product} // Kirim seluruh data produk
                onChange={handleInputChange} // Gunakan handleInputChange yang sudah menghandle jenis dan stocks
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <BeratProduk
                data={product} // Kirim seluruh data produk
                onChange={handleInputChange} // Gunakan handleInputChange yang sudah menghandle berat dan dimensi
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Batalkan
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Simpan sebagai Draft
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors" // Ganti warna agar lebih kontras
            >
              Perbarui Produk
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
