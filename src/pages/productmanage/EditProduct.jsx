import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InformasiProduk from "../../components/forms/tambahProduk/informasiProduk";
import HargaProduk from "../../components/forms/tambahProduk/hargaProduk";
import InventarisProduk from "../../components/forms/tambahProduk/inventarisProduk";
import JenisProduk from "../../components/forms/tambahProduk/jenisProduk";
import BeratProduk from "../../components/forms/tambahProduk/beratProduk";
import UploadGambar from "../../components/forms/tambahProduk/mediaProduk";
import CancelModal from "../../components/modal/modalCancel";
import UploadSuccessModal from "../../components/modal/modalBerhasilUpload";
import SimpanModal from "../../components/modal/modalBerhasilSimpan";
import { getProductById, updateProduct } from "../../services/api";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    discount: "",
    stock: "",
    images: [], // Array URL untuk preview (dari API atau baru diunggah)
    imageFiles: [], // Array file mentah untuk upload
    weight: "",
    dimensions: {
      height: 0,
      length: 0,
      width: 0,
    },
    type: {
      color: [],
      size: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [isSimpanSuccess, setSimpanSuccess] = useState(false);
  const [removedImages, setRemovedImages] = useState([]); // State untuk melacak gambar yang dihapus

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (!data) throw new Error("Produk tidak ditemukan");

        const dimensions = data.dimensions || {
          height: 0,
          length: 0,
          width: 0,
        };
        const imageUrls = data.images || [];
        setProduct({
          ...data,
          images: imageUrls,
          imageFiles: [],
          dimensions,
        });
        setRemovedImages([]); // Reset gambar yang dihapus saat fetch
        console.log("Product data fetched:", data); // Debugging
      } catch (error) {
        console.error("Gagal to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSaveDraft = () => {
    setSimpanSuccess(true);
  };

  const handleUpdate = async () => {
    try {
      console.log("Data sebelum update:", product);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("sku", product.sku);
      formData.append("price", product.price);
      formData.append("discount", product.discount || "");
      formData.append("stock", product.stock);
      formData.append("weight", product.weight || "");

      // Kirim dimensions sebagai string JSON
      const dimensions = product.dimensions || {
        height: 0,
        length: 0,
        width: 0,
      };
      formData.append("dimensions", JSON.stringify(dimensions));

      // Kirim type sebagai string JSON
      const type = product.type || { color: [], size: [] };
      formData.append("type", JSON.stringify(type));

      // Tambahkan semua file gambar baru ke FormData
      if (product.imageFiles && product.imageFiles.length > 0) {
        product.imageFiles.forEach((file) => {
          formData.append("images", file); // Kirim file baru
          console.log("File gambar baru yang dikirim:", file.name);
        });
      } else {
        console.log("Tidak ada file gambar baru, menggunakan gambar lama.");
      }

      // Tambahkan URL gambar lama yang belum dihapus ke FormData
      const existingImageUrls = product.images
        .filter(
          (url) => !url.startsWith("blob:") && !removedImages.includes(url)
        )
        .map((url) => url);
      if (existingImageUrls.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImageUrls));
        console.log("URL gambar lama yang dikirim:", existingImageUrls);
      }

      // Tambahkan daftar gambar yang dihapus ke FormData
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
        console.log("Gambar yang dihapus:", removedImages);
      }

      const response = await updateProduct(product._id, formData);

      console.log("Response dari update:", response);
      if (!response) throw new Error("Gagal memperbarui produk");

      // Perbarui state dengan images baru dari respons server
      setProduct((prevState) => ({
        ...prevState,
        images: response.images || prevState.images,
        imageFiles: [],
        dimensions: response.dimensions || prevState.dimensions,
        type: response.type || prevState.type,
      }));
      setRemovedImages([]); // Reset gambar yang dihapus setelah update berhasil
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error saat update produk:", error);
      alert("Gagal memperbarui produk. Periksa koneksi atau coba lagi.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  // Fungsi untuk menghapus gambar dari preview
  const handleRemoveImage = (removedImageUrl) => {
    setProduct((prevState) => {
      const newImages = prevState.images.filter(
        (url) => url !== removedImageUrl
      );
      const newImageFiles = prevState.imageFiles.filter(
        (_, index) => prevState.images[index] !== removedImageUrl
      );

      // Hapus URL preview lama untuk mencegah memory leak
      if (removedImageUrl && removedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removedImageUrl);
      }

      // Tambahkan URL gambar yang dihapus ke state removedImages (hanya URL permanen dari server)
      if (removedImageUrl && !removedImageUrl.startsWith("blob:")) {
        setRemovedImages((prev) => [...prev, removedImageUrl]);
        console.log(
          "Menambahkan URL gambar yang dihapus ke removedImages:",
          removedImageUrl
        );
      }

      return {
        ...prevState,
        images: newImages,
        imageFiles: newImageFiles,
      };
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <>
      <CancelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancel}
      />
      <UploadSuccessModal
        isOpen={isUploadSuccess}
        onClose={() => setUploadSuccess(false)}
      />
      <SimpanModal
        isOpen={isSimpanSuccess}
        onClose={() => setSimpanSuccess(false)}
      />

      <div className="bg-gray-200 min-h-screen py-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <Breadcrumb pageName="Edit Produk" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <InformasiProduk
                  data={product}
                  setData={setProduct}
                  onChange={(e) => {
                    setProduct((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <UploadGambar
                  data={product}
                  onUpload={(files) => {
                    if (files && files.length > 0) {
                      const imagePreviews = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setProduct((prevState) => {
                        // Hapus URL preview lama untuk mencegah memory leak
                        prevState.images.forEach((url) => {
                          if (url.startsWith("blob:")) {
                            URL.revokeObjectURL(url);
                          }
                        });

                        return {
                          ...prevState,
                          images: [...prevState.images, ...imagePreviews],
                          imageFiles: [...prevState.imageFiles, ...files],
                        };
                      });
                    }
                  }}
                  onRemove={handleRemoveImage}
                  mode="edit"
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <HargaProduk
                  data={product}
                  setData={setProduct}
                  onChange={(e) => {
                    setProduct((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <InventarisProduk
                  data={product}
                  setData={setProduct}
                  onChange={(e) => {
                    setProduct((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <JenisProduk
                  data={product}
                  onChange={(updatedData) => {
                    setProduct((prevState) => ({
                      ...prevState,
                      type: updatedData.type,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <BeratProduk
                  data={product}
                  onChange={(updatedData) => {
                    setProduct((prevState) => ({
                      ...prevState,
                      weight: updatedData.weight,
                      dimensions: updatedData.dimensions || {
                        height: 0,
                        length: 0,
                        width: 0,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[#FEECEE] text-[#EB3D4D] rounded-md"
            >
              Batalkan
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-[#F0F1F3] text-[#667085] rounded-md"
            >
              Simpan sebagai Draft
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-[#E9FAF7] text-[#1A9882]"
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
