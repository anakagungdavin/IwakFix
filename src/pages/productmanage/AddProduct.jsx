import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import InformasiProduk from '../../components/forms/tambahProduk/informasiProduk';
import HargaProduk from '../../components/forms/tambahProduk/hargaProduk';
import InventarisProduk from '../../components/forms/tambahProduk/inventarisProduk';
import JenisProduk from '../../components/forms/tambahProduk/jenisProduk';
import BeratProduk from '../../components/forms/tambahProduk/beratProduk';
import UploadGambar from '../../components/forms/tambahProduk/mediaProduk';
import CancelModal from '../../components/modal/modalCancel';
import UploadSuccessModal from '../../components/modal/modalBerhasilUpload';
import SimpanModal from '../../components/modal/modalBerhasilSimpan';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../../services/api';

// export function getStatus (stok, isPublished) {
//     if (!isPublished) return "Draft"; 
//     if (stok === 0) return "Out of Stok";
//     if (stok < 10) return "Low Stok";
//     return "Published";
// }
export function getStatus(stok, isPublished) {
    if (!isPublished) return { label: "Draft", color: "bg-[#F0F1F3] text-[#667085]" }; 
    if (stok === 0) return { label: "Out of Stock", color: "bg-[#FEECEE] text-[#EB3D4D]" };
    if (stok < 10) return { label: "Low Stock", color: "bg-[#FFF0EA] text-[#F86624]" };
    return { label: "Published", color: "bg-[#E9FAF7] text-[#1A9882]" };
}
const AddProduct = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadSuccess, setUploadSuccess] = useState (false)
    const [isSimpanSuccess, setSimpanSuccess] = useState(false);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        sku: "",
        price: "",
        discount: "",
        stock: "",
        image: [],
        // imageFiles: [],
        weight: "",
        dimensions: {
            height: 0,
            length: 0,
            width: 0,
        },
        type: {
            color: [],
            size: []
        }
    });

    // Fungsi update state saat input berubah
    // const handleInputChange = (e) => {
    //     const {name, value} = e.target;
    //     setProductData((prev) => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    // const handleInputChange = (e) => {
    //     // if (!e || !e.target) {
    //     //     console.error("handleInputChange dipanggil tanpa event yang valid", e);
    //     //     return;
    //     // }
    
    //     // const { name, value } = e.target;
    //     // setProductData((prev) => ({
    //     //     ...prev,
    //     //     [name]: value
    //     // }));
    //     if (e && e.target) {
    //         // Jika dipanggil dengan event valid
    //         const { name, value } = e.target;
    //         setProductData((prev) => ({
    //             ...prev,
    //             [name]: value
    //         }));
    //     } else if (typeof e === "object") {
    //         // Jika dipanggil dengan objek langsung (dari JenisProduk, HargaProduk, dll.)
    //         setProductData(e);
    //     } else {
    //         console.error("handleInputChange dipanggil dengan format yang tidak dikenali", e);
    //     }
    // };
    const handleInputChange = (e) => {
        if (e && e.target) {
            // Jika dipanggil dengan event valid
            const { name, value } = e.target;
            setProductData((prev) => ({
                ...prev,
                [name]: value
            }));
        } else if (typeof e === "object" && e.weight !== undefined && e.dimensions !== undefined) {
            // Jika dipanggil dari BeratProduk (hanya update weight dan dimensions)
            setProductData((prev) => ({
                ...prev,
                weight: e.weight,
                dimensions: e.dimensions
            }));
        } else if (typeof e === "object") {
            // Jika dipanggil dengan objek langsung (dari JenisProduk, HargaProduk, dll.)
            setProductData(e);
        } else {
            console.error("handleInputChange dipanggil dengan format yang tidak dikenali", e);
        }
    };
    // console.log("productData:", productData);


    // Fungsi untuk upload gambar
    // const handleImageUpload = (imageFile) => {
    //     setProductData((prev) => ({
    //         ...prev,
    //         image: imageFile
    //     }));
    // };
    const handleImageUpload = (files) => {
        if (files && files.length > 0) {
            setProductData((prev) => ({
                ...prev,
                image: files[0], // Use the first file for now
                imageFiles: files, // Store all files if needed
            }));
        } else {
            console.warn("No valid files uploaded.");
            setProductData((prev) => ({
                ...prev,
                image: null,
                imageFiles: [],
            }));
        }
    };

    const handleSaveDraft = () => {
        setSimpanSuccess(true);
    };

    // const handleUpload = async () => {
    //     // setUploadSuccess(true);
    //     // try{
    //     //     const formData = new FormData();
    //     //     Object.keys(productData).forEach((key) => {
    //     //         formData.append(key, productData[key]);
    //     //     });
    //     //     console.log("FormData sebelum dikirim:", [...formData.entries()]); // Debug
    //     //     await addProduct(formData);
    //     //     setUploadSuccess(true);
    //     // }catch(error){
    //     //     console.error("Error Menambahkan Product:", error);
    //     // }
    //     try {
    //         const formData = new FormData();

    //         // Append non-nested fields
    //         formData.append("name", productData.name);
    //         formData.append("description", productData.description);
    //         formData.append("price", productData.price);
    //         formData.append("discount", productData.discount);
    //         formData.append("stock", productData.stock);
    //         formData.append("weight", productData.weight);

    //         // Append nested fields (dimensions)
    //         formData.append("dimensions[height]", productData.dimensions.height);
    //         formData.append("dimensions[length]", productData.dimensions.length);
    //         formData.append("dimensions[width]", productData.dimensions.width);

    //         // // Append arrays (type.color and type.size)
    //         // productData.type.color.forEach((color, index) => {
    //         //     formData.append(`type[color][${index}]`, color);
    //         // });
    //         // productData.type.size.forEach((size, index) => {
    //         //     formData.append(`type[size][${index}]`, size);
    //         // });
    //         (productData.type?.color ?? []).forEach((color, index) => {
    //             formData.append(`type[color][${index}]`, color);
    //         });
    //         (productData.type?.size ?? []).forEach((size, index) => {
    //             formData.append(`type[size][${index}]`, size);
    //         });

            

    //         // // Append image file
    //         // if (productData.image) {
    //         //     formData.append("image", productData.image);
    //         // }
    //         if (productData.image) {
    //             formData.append("image", productData.image);
    //         } else {
    //             console.warn("Tidak ada gambar yang diunggah!");
    //         }
            

    //         console.log("FormData sebelum dikirim:", [...formData.entries()]); // Debug

    //         // Call API to add product
    //         await addProduct(formData);
    //         setUploadSuccess(true);
    //     } catch (error) {
    //         console.error("Error Menambahkan Product:", error);

    //     }
    // };

    const handleUpload = async () => {
        try {
            console.log("productData before upload:", productData); // Debugging
    
            const formData = new FormData();
    
            // Append non-nested fields
            formData.append("name", productData.name);
            formData.append("description", productData.description);
            formData.append("price", productData.price);
            formData.append("sku", productData.sku);
            formData.append("discount", productData.discount);
            formData.append("stock", productData.stock);
            formData.append("weight", productData.weight);
    
            // Append nested fields (dimensions)
            formData.append("dimensions[height]", productData.dimensions.height);
            formData.append("dimensions[length]", productData.dimensions.length);
            formData.append("dimensions[width]", productData.dimensions.width);
    
            // Append arrays (type.color and type.size)
            (productData.type?.color ?? []).forEach((color, index) => {
                formData.append(`type[color][${index}]`, color);
            });
            (productData.type?.size ?? []).forEach((size, index) => {
                formData.append(`type[size][${index}]`, size);
            });
    
            // Append image file if it exists
            if (productData.image instanceof File) {
                formData.append("image", productData.image);
            } else {
                console.warn("No valid image file to upload.");
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
                    <Breadcrumb pageName="Tambah Produk"/>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InformasiProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><UploadGambar
    onUpload={(files) => {
        if (files && files.length > 0) {
            setProductData((prevState) => ({
                ...prevState,
                image: files[0], // Use the first file
                imageFiles: files, // Store all files
            }));
        } else {
            console.warn("No file selected or invalid file object.");
            setProductData((prevState) => ({
                ...prevState,
                image: null,
                imageFiles: [],
            }));
        }
    }}
    mode="add"
/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><HargaProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InventarisProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><JenisProduk data={productData} onChange={handleInputChange}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><BeratProduk data={productData} onChange={handleInputChange}/></div></div>
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
