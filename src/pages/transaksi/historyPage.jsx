import Breadcrumb from "../../breadcrumb/breadcrumb";
import TableHistory from "../../components/tables/TableTransaksiHistory";
import { useNavigate } from "react-router-dom";
import SalesReport from "../../components/modal/modalInvoiceHistory";
import { useState } from "react";

const HistoryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }
    return(
        <>
        <div className="bg-gray-200 min-h-screen py-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <Breadcrumb pageName="Transaction History"/>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex justify-between items-center">
                        <button 
                        className="flex items-center px-4 py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md"
                        onClick={toggleModal}
                        >
                            <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path d="M9 15V7H11V15H14L10 19L6 15H9Z" />
                            <path
                                fillRule="evenodd"
                                d="M3 3H17V13H15V5H5V13H3V3Z"
                                clipRule="evenodd"
                            />
                            </svg>
                            Cetak
                        </button>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <TableHistory/>
                            {/* <SalesReport/> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isModalOpen && <SalesReport onClose={toggleModal}/>}
        </>
    )
}

export default HistoryPage;