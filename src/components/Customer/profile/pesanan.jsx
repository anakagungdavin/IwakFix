import React, { useState } from "react";
import TransactionDetailModal from "../../modal/modalDetailTransaksi";

const TransactionCard = ({ date, status, code, name, weight, price, onViewDetail }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md border flex justify-between items-center">
            <div className="flex items-center gap-4">
                <img
                src="/fish.png"
                alt={name}
                className="w-16 h-16 rounded-lg object-cover"
                />
            <div>
            <p className="text-gray-500 text-sm">{date}</p>
            <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-[#d9a002] text-xs rounded-md">
                    {status}
                    </span>
                    <p className="text-gray-400 text-xs">{code}</p>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <p className="text-gray-500 text-sm">{weight} x Rp{price.toLocaleString()}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xl font-semibold text-gray-800">Rp{(weight * price).toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                    <button className="text-[#FFBC00] text-sm font-bold cursor-pointer"
                    onClick={onViewDetail}
                    >
                        Lihat Detail Transaksi
                    </button>
                </div>
            </div>
        </div>
    );
};

const TransactionList = () => {
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }
    const handleViewDetail = (transactions) => {
        setSelectedTransaction(transactions);
        setIsModalOpen(true);
    }
    const transactions = [
        {
        date: "12 Januari 2025",
        status: "Semua",
        code: "0GB1212025/PX101",
        name: "Ikan Gabus",
        weight: 2,
        price: 30000,
        },
        {
        date: "12 Januari 2025",
        status: "Semua",
        code: "0GB1212025/PX101",
        name: "Ikan Gabus",
        weight: 2,
        price: 30000,
        },
        {
        date: "12 Januari 2025",
        status: "Semua",
        code: "0GB1212025/PX101",
        name: "Ikan Gabus",
        weight: 2,
        price: 30000,
        },
        
    ];

    return (
        <div className="p-6 min-h-screen">
            <div className="flex gap-4 mb-6">
                <button className="px-6 py-2 border rounded-md text-yellow-600 bg-yellow-100 font-medium">
                Semua
                </button>
                <button className="px-6 py-2 border rounded-md text-gray-600">Berlangsung</button>
                <button className="px-6 py-2 border rounded-md text-gray-600">Selesai</button>
                <button className="px-6 py-2 border rounded-md text-gray-600">Gagal</button>
                <button className="px-5 py-2 border rounded-md text-gray-600">
                Menunggu Konfirmasi
                </button>
            </div>
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
                Download Sejarah Transaksi
            </button>
            <div className="mt-6 space-y-4">
                {transactions.map((transaction, index) => (
                    <TransactionCard key={index} {...transaction} onViewDetail={() => handleViewDetail(transaction)}/>
                ))}
            </div>
            {isModalOpen && (
                <TransactionDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
                />
            )}
        </div>
    );
};

export default TransactionList;
