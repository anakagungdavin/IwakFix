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

    const handleSaveDraft = () => {
        alert("Produk disimpan sebagai draft!");
    };

    const handleUpload = () => {
        alert("Produk berhasil diunggah!");
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
            <div className="bg-gray-200 min-h-screen py-6">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <Breadcrumb pageName="Tambah Produk"/>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InformasiProduk/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><UploadGambar/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><HargaProduk/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InventarisProduk/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><JenisProduk/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><BeratProduk/></div></div>
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
