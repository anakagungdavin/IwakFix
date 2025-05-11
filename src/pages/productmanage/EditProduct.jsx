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
    isPublished: true,
    stocks: [],
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [isSimpanSuccess, setSimpanSuccess] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (!data) throw new Error("Produk tidak ditemukan");

        const transformedStocks = Array.isArray(data.stocks)
          ? data.stocks.map((stock, index) => ({
              jenis: stock.jenis || `Jenis-${index + 1}`,
              size: stock.size || `Size-${index + 1}`,
              stock: stock.stock || 0,
              price: stock.price || 0, // Added price
              discount: stock.discount || 0, // Added discount
            }))
          : [];

        setProduct({
          name: data.name || "",
          description: data.description || "",
          images: data.images || [],
          imageFiles: [],
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
            data.seller ||
            localStorage.getItem("sellerId") ||
            "default-seller-id",
          isPublished: data.isPublished !== undefined ? data.isPublished : true,
          stocks: transformedStocks,
        });
        setRemovedImages([]);
        console.log("Product data fetched:", data);
        console.log("Transformed stocks on load:", transformedStocks);
      } catch (error) {
        console.error("Gagal to fetch product:", error);
        alert("Gagal memuat produk. Periksa koneksi atau coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      if (name.startsWith("dimensions.")) {
        const dimensionField = name.split(".")[1];
        setProduct((prevState) => ({
          ...prevState,
          dimensions: {
            ...prevState.dimensions,
            [dimensionField]: parseFloat(value) || 0,
          },
        }));
      } else {
        setProduct((prevState) => {
          const newState = {
            ...prevState,
            [name]: ["weight"].includes(name) ? parseFloat(value) || 0 : value,
          };
          console.log(`Updated ${name}:`, newState[name]);
          return newState;
        });
      }
    } else if (e && e.weight !== undefined && e.dimensions !== undefined) {
      setProduct((prevState) => {
        const newState = {
          ...prevState,
          weight: parseFloat(e.weight) || 0,
          dimensions: {
            height: parseFloat(e.dimensions.height) || 0,
            length: parseFloat(e.dimensions.length) || 0,
          },
        };
        console.log(
          "Updated from BeratProduk:",
          newState.weight,
          newState.dimensions
        );
        return newState;
      });
    } else if (e && e.type !== undefined && e.stocks !== undefined) {
      setProduct((prevState) => {
        const newState = {
          ...prevState,
          type: {
            jenis: e.type.jenis || [],
            size: e.type.size || [],
          },
          stocks: e.stocks || [],
        };
        console.log("Updated type and stocks:", newState.type, newState.stocks);
        return newState;
      });
    }
  };

  const handleAddImage = (files) => {
    if (files && files.length > 0) {
      const imagePreviews = files.map((file) => URL.createObjectURL(file));
      setProduct((prevState) => {
        const newState = {
          ...prevState,
          images: [...prevState.images, ...imagePreviews],
          imageFiles: [...prevState.imageFiles, ...files],
        };
        console.log("Updated images:", newState.images);
        return newState;
      });
    }
  };

  const handleRemoveImage = (removedImageUrl) => {
    setProduct((prevState) => {
      const newImages = prevState.images.filter(
        (url) => url !== removedImageUrl
      );
      const newImageFiles = prevState.imageFiles.filter((file) => {
        const fileUrl = URL.createObjectURL(file);
        return fileUrl !== removedImageUrl;
      });

      if (removedImageUrl && removedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removedImageUrl);
      }

      if (removedImageUrl && !removedImageUrl.startsWith("blob:")) {
        setRemovedImages((prev) => [...new Set([...prev, removedImageUrl])]);
      }

      return {
        ...prevState,
        images: newImages,
        imageFiles: newImageFiles,
      };
    });
  };

  const handleSaveDraft = () => {
    setSimpanSuccess(true);
  };

  const handleUpdate = async () => {
    try {
      const missingFields = [];
      if (!product.name) missingFields.push("Nama");
      if (!product.description) missingFields.push("Deskripsi");

      console.log("Stocks sebelum validasi:", product.stocks);

      if (product.type.jenis.length > 0 && product.type.size.length > 0) {
        if (product.stocks.length === 0) {
          throw new Error(
            "Harap atur stok untuk setiap kombinasi jenis dan ukuran!"
          );
        }
        product.stocks.forEach((stock, index) => {
          console.log(`Stock entry #${index + 1}:`, stock);
          if (!stock.jenis || !stock.size) {
            throw new Error(
              `Stock entry #${
                index + 1
              } missing required fields (jenis or size)`
            );
          }
          if (stock.stock < 0) {
            throw new Error(`Stock entry #${index + 1} has invalid stock`);
          }
        });
      }

      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(", ")} produk harus diisi!`);
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("weight", product.weight || 0);
      formData.append("seller", product.seller);
      formData.append("isPublished", product.isPublished);
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

      const existingImages = product.images.filter(
        (url) => !url.startsWith("blob:") && !removedImages.includes(url)
      );
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      const formDataLog = {};
      for (const [key, value] of formData.entries()) {
        formDataLog[key] = value instanceof File ? value.name : value;
      }
      console.log("FormData yang dikirim:", formDataLog);

      console.log("Data yang dikirim ke API:", {
        name: product.name,
        description: product.description,
        weight: product.weight,
        dimensions: product.dimensions,
        type: product.type,
        stocks: product.stocks,
        seller: product.seller,
        images: product.imageFiles.map((file) => file.name),
        existingImages,
        removedImages,
        isPublished: product.isPublished,
      });

      const response = await updateProduct(id, formData);

      if (!response) throw new Error("Gagal memperbarui produk");

      setProduct((prevState) => ({
        ...prevState,
        images: response.images || prevState.images,
        imageFiles: [],
        dimensions: response.dimensions || prevState.dimensions,
        type: response.type || prevState.type,
        stocks: response.stocks || prevState.stocks,
      }));
      setRemovedImages([]);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading product:", error.message);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;
  if (!product.name && !loading) return <p>Produk tidak ditemukan</p>;

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
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <UploadGambar
                  data={{ images: product.images }}
                  onUpload={handleAddImage}
                  onRemove={handleRemoveImage}
                  mode="edit"
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
                      stocks: updatedData.stocks || [],
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
              className="px-4 py-2 bg-[#E9FAF7] text-[#1A9882] rounded-md"
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
