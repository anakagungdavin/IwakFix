import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InformasiProduk from "../../components/forms/tambahProduk/informasiProduk";
import HargaProduk from "../../components/forms/tambahProduk/hargaProduk";
import InventarisProduk from "../../components/forms/tambahProduk/inventarisProduk";
import JenisProduk from "../../components/forms/tambahProduk/jenisProduk";
import BeratProduk from "../../components/forms/tambahProduk/beratProduk";
import UploadGambar from "../../components/forms/tambahProduk/mediaProduk";
import CancelModal from "../../components/modal/modalCancel";
import UploadSuccessModal from "../../components/modal/modalBerhasilUpload";
import SimpanModal from "../../components/modal/modalBerhasilSimpan";
import { addProduct } from "../../services/api";

// Helper function for status (same as in original AddProduct.jsx)
export function getStatus(stok, isPublished) {
  if (!isPublished)
    return { label: "Draft", color: "bg-[#F0F1F3] text-[#667085]" };
  if (stok === 0)
    return { label: "Out of Stock", color: "bg-[#FEECEE] text-[#EB3D4D]" };
  if (stok < 10)
    return { label: "Low Stock", color: "bg-[#FFF0EA] text-[#F86624]" };
  return { label: "Published", color: "bg-[#E9FAF7] text-[#1A9882]" };
}

const AddProduct = () => {
<<<<<<< Updated upstream
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadSuccess, setUploadSuccess] = useState (false)
    const [isSimpanSuccess, setSimpanSuccess] = useState(false);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        image: null,
        weight: "",
        dimensions: {
            height: "",
            length: "",
            width: ""
        },
        type: {
            color: [],
            size: []
        }
=======
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [isSimpanSuccess, setSimpanSuccess] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    discount: "",
    stock: "",
    images: [], // Array of image URLs (for preview or existing images)
    imageFiles: [], // Array of file objects (for new uploads)
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
    seller: "YOUR_SELLER_OBJECTID_HERE", // Replace with actual seller ID from auth
  });

  // Handle input changes (similar to EditProduct.jsx)
  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setProduct((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (
      typeof e === "object" &&
      e.weight !== undefined &&
      e.dimensions !== undefined
    ) {
      // Update from BeratProduk
      setProduct((prevState) => ({
        ...prevState,
        weight: e.weight,
        dimensions: e.dimensions || { height: 0, length: 0, width: 0 },
      }));
    } else if (typeof e === "object") {
      // Update from JenisProduk, HargaProduk, etc.
      setProduct(e);
    } else {
      console.error(
        "handleInputChange dipanggil dengan format yang tidak dikenali",
        e
      );
    }
  };

  // Handle image upload (similar to EditProduct.jsx)
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

  // Handle image removal (similar to EditProduct.jsx)
  const handleRemoveImage = (removedImageUrl) => {
    setProduct((prevState) => {
      const newImages = prevState.images.filter(
        (url) => url !== removedImageUrl
      );
      const newImageFiles = prevState.imageFiles.filter((file) => {
        const fileUrl = URL.createObjectURL(file);
        return fileUrl !== removedImageUrl;
      });

      // Revoke blob URL to prevent memory leaks
      if (removedImageUrl && removedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removedImageUrl);
      }

      return {
        ...prevState,
        images: newImages,
        imageFiles: newImageFiles,
      };
>>>>>>> Stashed changes
    });
  };

<<<<<<< Updated upstream
    // Fungsi update state saat input berubah
    // const handleInputChange = (e) => {
    //     const {name, value} = e.target;
    //     setProductData((prev) => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    const handleInputChange = (e) => {
        // if (!e || !e.target) {
        //     console.error("handleInputChange dipanggil tanpa event yang valid", e);
        //     return;
        // }
    
        // const { name, value } = e.target;
        // setProductData((prev) => ({
        //     ...prev,
        //     [name]: value
        // }));
        if (e && e.target) {
            // Jika dipanggil dengan event valid
            const { name, value } = e.target;
            setProductData((prev) => ({
                ...prev,
                [name]: value
            }));
        } else if (typeof e === "object") {
            // Jika dipanggil dengan objek langsung (dari JenisProduk, HargaProduk, dll.)
            setProductData(e);
        } else {
            console.error("handleInputChange dipanggil dengan format yang tidak dikenali", e);
        }
    };

    // Fungsi untuk upload gambar
    const handleImageUpload = (imageFile) => {
        setProductData((prev) => ({
            ...prev,
            image: imageFile
        }));
    };
=======
  const handleSaveDraft = () => {
    setSimpanSuccess(true);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      // Append non-nested fields
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("sku", product.sku);
      formData.append("price", Number(product.price) || 0);
      formData.append("discount", Number(product.discount) || 0);
      formData.append("stock", Number(product.stock) || 0);
      formData.append("weight", Number(product.weight) || 0);
      formData.append("seller", product.seller); // Ensure seller is included
>>>>>>> Stashed changes

      // Append nested fields (dimensions and type) as JSON strings
      formData.append(
        "dimensions",
        JSON.stringify(product.dimensions || { height: 0, length: 0, width: 0 })
      );
      formData.append(
        "type",
        JSON.stringify(product.type || { color: [], size: [] })
      );

<<<<<<< Updated upstream
    const handleUpload = async () => {
        // setUploadSuccess(true);
        // try{
        //     const formData = new FormData();
        //     Object.keys(productData).forEach((key) => {
        //         formData.append(key, productData[key]);
        //     });
        //     console.log("FormData sebelum dikirim:", [...formData.entries()]); // Debug
        //     await addProduct(formData);
        //     setUploadSuccess(true);
        // }catch(error){
        //     console.error("Error Menambahkan Product:", error);
        // }
        try {
            const formData = new FormData();

            // Append non-nested fields
            formData.append("name", productData.name);
            formData.append("description", productData.description);
            formData.append("price", productData.price);
            formData.append("discount", productData.discount);
            formData.append("stock", productData.stock);
            formData.append("weight", productData.weight);

            // Append nested fields (dimensions)
            formData.append("dimensions[height]", productData.dimensions.height);
            formData.append("dimensions[length]", productData.dimensions.length);
            formData.append("dimensions[width]", productData.dimensions.width);

            // Append arrays (type.color and type.size)
            productData.type.color.forEach((color, index) => {
                formData.append(`type[color][${index}]`, color);
            });
            productData.type.size.forEach((size, index) => {
                formData.append(`type[size][${index}]`, size);
            });

            // Append image file
            if (productData.image) {
                formData.append("image", productData.image);
            }

            console.log("FormData sebelum dikirim:", [...formData.entries()]); // Debug

            // Call API to add product
            await addProduct(formData);
            setUploadSuccess(true);
        } catch (error) {
            console.error("Error Menambahkan Product:", error);

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
=======
      // Append new image files
      product.imageFiles.forEach((file) => {
        formData.append("images", file); // Send files for upload
      });

      //   console.log("FormData sebelum dikirim:", [...formData.entries()]);

      // Call API to add product
      const response = await addProduct(formData);
      //   console.log("Response dari addProduct:", response);

      if (!response) throw new Error("Gagal menambahkan produk");

      // Update state with new images from server response
      setProduct((prevState) => ({
        ...prevState,
        images: response.images || prevState.images,
        imageFiles: [],
      }));
      setUploadSuccess(true);
    } catch (error) {
      console.error(
        "Error Menambahkan Product:",
        error.response?.data || error.message
      );
      alert("Gagal menambahkan produk. Periksa koneksi atau coba lagi.");
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        />
            <div className="bg-gray-200 min-h-screen py-6">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <Breadcrumb pageName="Tambah Produk"/>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InformasiProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><UploadGambar
                            onUpload={(file) => {
                                setProduct(prevState => ({
                                    ...prevState,
                                    image: file ? URL.createObjectURL(file) : null,
                                }));
                            }}
                            mode="add"
                        /></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><HargaProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InventarisProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><JenisProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><BeratProduk data={productData} onChange={handleInputChange}/></div></div>
                    </div>
=======
      />
>>>>>>> Stashed changes

      <div className="bg-gray-200 min-h-screen py-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <Breadcrumb pageName="Tambah Produk" />
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
                  data={product}
                  onUpload={(files) => handleAddImage(files)}
                  onRemove={handleRemoveImage}
                  mode="add"
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <HargaProduk
                  data={product}
                  setData={setProduct}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <InventarisProduk
                  data={product}
                  setData={setProduct}
                  onChange={handleInputChange}
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
              onClick={handleUpload}
              className="px-4 py-2 bg-[#E9FAF7] text-[#1A9882]"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
