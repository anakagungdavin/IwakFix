import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InformasiProduk from '../../components/forms/tambahProduk/informasiProduk';
import HargaProduk from '../../components/forms/tambahProduk/hargaProduk';
import InventarisProduk from '../../components/forms/tambahProduk/inventarisProduk';
import JenisProduk from '../../components/forms/tambahProduk/jenisProduk';
import BeratProduk from '../../components/forms/tambahProduk/beratProduk';
import UploadGambar from '../../components/forms/tambahProduk/mediaProduk';
import CancelModal from '../../components/modal/modalCancel';
import UploadSuccessModal from '../../components/modal/modalBerhasilUpload';
import SimpanModal from '../../components/modal/modalBerhasilSimpan';
import { getProductById, updateProduct } from '../../services/api';

const EditProduct = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [product, setProduct] = useState({
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
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadSuccess, setUploadSuccess] = useState (false)
    const [isSimpanSuccess, setSimpanSuccess] = useState(false);

    useEffect (() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error){
                console.error("Gagal to fetch product", error)
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSaveDraft = () => {
        setSimpanSuccess(true);
    };

    // const handleUpdate = () => {
    //     setUploadSuccess(true);
    // };
    const handleUpdate = async () => {
        try {
            await updateProduct(product._id, product);
            setUploadSuccess(true);
        } catch (eror) {
            alert("Gagal memperbarui produk");
        }
    };

    const handleCancel = () => { 
        setIsModalOpen(true);
    };

    const confirmCancel = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    if (loading) return <p>Loading...</p>
    if (!product) return <p>Produk tidak ditemukan</p>


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
                    <Breadcrumb pageName="Edit Produk"/>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InformasiProduk data={product} setData={setProduct}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><UploadGambar data={product} setData={setProduct}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><HargaProduk data={product} setData={setProduct}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><InventarisProduk data={product} setData={setProduct}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><JenisProduk data={product} setData={setProduct}/></div></div>
                        <div className="col-span-4"><div className="bg-white shadow-md rounded-lg p-4"><BeratProduk data={product} setData={setProduct}/></div></div>
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