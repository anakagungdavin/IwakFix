import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InformasiProduk from "../../components/forms/tambahProduk/informasiProduk";
import JenisProduk from "../../components/forms/tambahProduk/jenisProduk";
import BeratProduk from "../../components/forms/tambahProduk/beratProduk";
import UploadGambar from "../../components/forms/tambahProduk/mediaProduk";
import CancelModal from "../../components/modal/modalCancel";
import UploadSuccessModal from "../../components/modal/modalBerhasilUpload";
import SimpanModal from "../../components/modal/modalBerhasilSimpan";
import { addProduct } from "../../services/api";

// Fungsi getStatus tetap sama dan bisa digunakan jika diperlukan di sini,
// namun umumnya status baru ada setelah produk dibuat.
// Untuk konsistensi, kita bisa menyimpannya.
export function getStatus(stok, isPublished) {
  if (!isPublished)
    return { label: "Draft", jenis: "bg-[#F0F1F3] text-[#667085]" };
  if (stok === 0)
    return { label: "Out of Stock", jenis: "bg-[#FEECEE] text-[#EB3D4D]" };
  if (stok < 10)
    return { label: "Low Stock", jenis: "bg-[#FFF0EA] text-[#F86624]" };
  return { label: "Published", jenis: "bg-[#E9FAF7] text-[#1A9882]" };
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [isSimpanSuccess, setSimpanSuccess] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    stock: 0, // Ini mungkin lebih relevan untuk produk sederhana tanpa varian
    price: 0, // Untuk produk sederhana tanpa varian
    discount: 0, // Untuk produk sederhana tanpa varian
    images: [],
    imageFiles: [],
    weight: 0,
    dimensions: {
      height: 0,
      length: 0,
    },
    type: {
      jenis: [],
      size: [],
    },
    seller: localStorage.getItem("sellerId") || "default-seller-id",
    isPublished: true, // Defaultnya true untuk tombol "Tambah Produk"
    stocks: [], // Untuk produk dengan varian
  });

  const handleInputChange = (e) => {
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
        // Jika ada toggle untuk isPublished di form, ini akan menanganinya
        setProduct((prevState) => ({
          ...prevState,
          isPublished: checked,
        }));
      } else {
        setProduct((prevState) => {
          const newState = {
            ...prevState,
            [name]: ["stock", "price", "discount", "weight"].includes(name)
              ? parseFloat(value) || 0
              : value,
          };
          // console.log(`Updated ${name}:`, newState[name]);
          return newState;
        });
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
      const updatedStocks = Array.isArray(e.stocks)
        ? e.stocks.map((stock) => ({
            jenis: stock.jenis,
            size: stock.size,
            satuan: stock.satuan || "kg",
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
  };

  const handleAddImage = (files) => {
    if (files && files.length > 0) {
      const imagePreviews = files.map((file) => URL.createObjectURL(file));
      setProduct((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...imagePreviews],
        imageFiles: [...prevState.imageFiles, ...files],
      }));
    }
  };

  const handleRemoveImage = (removedImageUrl) => {
    setProduct((prevState) => {
      const newImages = prevState.images.filter(
        (url) => url !== removedImageUrl
      );
      const newImageFiles = prevState.imageFiles.filter((file) => {
        const fileUrl = URL.createObjectURL(file);
        const match = fileUrl === removedImageUrl;
        if (match) {
          URL.revokeObjectURL(fileUrl); // Revoke object URL if it's the one being removed
        }
        return !match;
      });

      // Jika URL yang dihapus adalah blob, revoke juga
      if (removedImageUrl && removedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removedImageUrl);
      }

      return {
        ...prevState,
        images: newImages,
        imageFiles: newImageFiles,
      };
    });
  };

  const commonFormDataSetup = (isPublishedStatus) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("weight", product.weight || 0);
    formData.append("seller", product.seller);
    formData.append("isPublished", isPublishedStatus);
    formData.append(
      "dimensions",
      JSON.stringify({
        height: product.dimensions.height || 0,
        length: product.dimensions.length || 0,
      })
    );
    formData.append(
      "type",
      JSON.stringify({
        jenis: product.type.jenis || [],
        size: product.type.size || [],
      })
    );
    formData.append("stocks", JSON.stringify(product.stocks || []));
    product.imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Jika tidak ada varian (type.jenis dan type.size kosong),
    // dan ada harga/stok utama, kita bisa menambahkannya sebagai satu stock item
    // Ini asumsi, backend harus bisa menangani ini atau validasi lebih lanjut diperlukan
    if (
      product.type.jenis.length === 0 &&
      product.type.size.length === 0 &&
      product.stocks.length === 0
    ) {
      if (product.price > 0 || product.stock > 0) {
        const defaultStockItem = {
          jenis: "Default", // Atau biarkan kosong jika backend menangani
          size: "Default", // Atau biarkan kosong
          satuan: "pcs", // Satuan default
          stock: product.stock || 0,
          price: product.price || 0,
          discount: product.discount || 0,
        };
        formData.set("stocks", JSON.stringify([defaultStockItem]));
        // Juga, jika type kosong, pastikan tidak mengirim array kosong yang membingungkan
        formData.set("type", JSON.stringify({ jenis: [], size: [] }));
      }
    }

    // Log FormData untuk debugging
    const formDataLog = {};
    for (const [key, value] of formData.entries()) {
      formDataLog[key] = value instanceof File ? value.name : value;
    }
    console.log(
      `FormData (isPublished: ${isPublishedStatus}) yang dikirim:`,
      formDataLog
    );

    return formData;
  };

  const validateProductData = () => {
    const missingFields = [];
    if (!product.name.trim()) missingFields.push("Nama Produk");
    if (!product.description.trim()) missingFields.push("Deskripsi Produk");

    if (missingFields.length > 0) {
      alert(`${missingFields.join(", ")} harus diisi!`);
      return false;
    }

    // Validasi stocks jika jenis atau ukuran dipilih
    if (product.type.jenis.length > 0 || product.type.size.length > 0) {
      if (!product.stocks || product.stocks.length === 0) {
        alert(
          "Harap atur stok untuk setiap kombinasi jenis dan ukuran yang dipilih!"
        );
        return false;
      }
      for (const stock of product.stocks) {
        if (!stock.jenis || !stock.size || !stock.satuan) {
          alert(
            `Detail stok (jenis, ukuran, satuan) tidak lengkap untuk salah satu entri stok.`
          );
          return false;
        }
        if (
          stock.stock === undefined ||
          stock.stock < 0 ||
          isNaN(parseInt(stock.stock))
        ) {
          alert(
            `Jumlah stok tidak valid untuk ${stock.jenis} - ${stock.size}.`
          );
          return false;
        }
        if (
          stock.price === undefined ||
          stock.price < 0 ||
          isNaN(parseFloat(stock.price))
        ) {
          alert(`Harga tidak valid untuk ${stock.jenis} - ${stock.size}.`);
          return false;
        }
        if (
          stock.discount !== undefined &&
          (stock.discount < 0 ||
            stock.discount > 100 ||
            isNaN(parseFloat(stock.discount)))
        ) {
          alert(
            `Diskon tidak valid (0-100) untuk ${stock.jenis} - ${stock.size}.`
          );
          return false;
        }
      }
    } else {
      // Validasi untuk produk sederhana (tanpa varian)
      // Jika price ada, harus > 0. Stok boleh 0.
      if (product.price < 0) {
        alert("Harga produk tidak boleh negatif.");
        return false;
      }
      if (product.stock < 0) {
        alert("Stok produk tidak boleh negatif.");
        return false;
      }
      if (product.discount < 0 || product.discount > 100) {
        alert("Diskon produk harus antara 0 dan 100.");
        return false;
      }
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!product.name.trim()) {
      alert("Nama produk harus diisi untuk menyimpan sebagai draft.");
      return;
    }
    try {
      const formData = commonFormDataSetup(false); // isPublished = false
      const response = await addProduct(formData);
      if (!response) throw new Error("Gagal menyimpan draft produk");

      setProduct((prevState) => ({
        ...prevState,
        images: response.images || prevState.images, // Jika API mengembalikan URL gambar
        imageFiles: [], // Kosongkan file baru setelah simpan
        isPublished: false,
      }));
      setSimpanSuccess(true);
    } catch (error) {
      console.error("Error saving draft:", error.message);
      alert(`Gagal menyimpan draft: ${error.message}`);
    }
  };

  const handleAddProduct = async () => {
    if (!validateProductData()) return;

    try {
      const formData = commonFormDataSetup(true); // isPublished = true
      const response = await addProduct(formData);
      if (!response) throw new Error("Gagal menambahkan produk");

      setProduct((prevState) => ({
        ...prevState,
        images: response.images || prevState.images,
        imageFiles: [],
      }));
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert(`Gagal menambahkan produk: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

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
        message="Produk berhasil ditambahkan!"
      />
      <SimpanModal
        isOpen={isSimpanSuccess}
        onClose={() => {
          setSimpanSuccess(false);
          // Opsional: navigate("/admin/products/drafts") atau serupa jika ada halaman draft
        }}
        message="Produk berhasil disimpan sebagai draft!"
      />

      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <Breadcrumb pageName="Tambah Produk" />
          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <InformasiProduk
                data={product}
                // setData={setProduct} // Sebaiknya tidak pass setData langsung
                onChange={handleInputChange}
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <UploadGambar
                data={{
                  images: product.images,
                  imageFiles: product.imageFiles,
                }}
                onUpload={handleAddImage}
                onRemove={handleRemoveImage}
                mode="add" // Mode tetap "add" untuk AddProduct
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <JenisProduk
                data={product}
                onChange={handleInputChange} // Gunakan handleInputChange yang sudah menghandle jenis dan stocks
              />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
              <BeratProduk
                data={product}
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
              onClick={handleAddProduct}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Tambah Produk
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
