import Breadcrumb from '../../breadcrumb/breadcrumb';

import InformasiProduk from '../../components/forms/tambahProduk/informasiProduk';
import HargaProduk from '../../components/forms/tambahProduk/hargaProduk';
import InventarisProduk from '../../components/forms/tambahProduk/inventarisProduk';
import JenisProduk from '../../components/forms/tambahProduk/jenisProduk';
import BeratProduk from '../../components/forms/tambahProduk/beratProduk';
import UploadGambar from '../../components/forms/tambahProduk/mediaProduk';

const ViewProduct = () => {
    return (
        <div className="bg-gray-200 min-h-screen py-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <Breadcrumb pageName="Detail Produk"/>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <InformasiProduk isReadOnly />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <UploadGambar isReadOnly />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <HargaProduk isReadOnly />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <InventarisProduk isReadOnly />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <JenisProduk isReadOnly />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <BeratProduk isReadOnly />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        className="px-4 py-2 bg-[#FEECEE] text-[#EB3D4D] rounded-md hover:opacity-80 transition"
                        onClick={() => window.history.back()}
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;
