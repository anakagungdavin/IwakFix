import React, { useState } from "react";
import ModalConfig from "../modal/ModalConfig";
import historyPembelian from "../../dummyData/dataSet";
// const historyPembelian = [
//     {
//         id: 55171,
//         custName: 'Jimin',
//         date: '13 Oktober 2024',
//         total: '200.000',
//         paidBy: 'CC',
//         statusBayar: 'Gagal',
//         orderDetails: {
//             orderId: 55171,
//             orderDate: '13 Oktober 2024',
//             productImage: '',
//             productName: 'Iwak bandeng',
//             quantity: 1,
//             pricePerUnit: '200.000',
//             recipient: 'Jimin',
//             phone: '08123456789',
//             address: 'Seoul, Korea Selatan',
//             paymentMethod: 'Credit Card',
//             itemsTotal: '200.000',
//             shippingCost: '20.000',
//             discount: '-10.000',
//             totalAmount: '210.000',
//         },
//     },
//     {
//         id: 55172,
//         custName: 'Jungkook',
//         date: '1 September 2024',
//         total: '300.000',
//         paidBy: 'VA',
//         statusBayar: 'Pending',
//         orderDetails: {
//             orderId: 55172,
//             orderDate: '1 September 2024',
//             productImage: '',
//             productName: 'Iwak Lele',
//             quantity: 1,
//             pricePerUnit: '300.000',
//             recipient: 'Jungkook',
//             phone: '08129876543',
//             address: 'Busan, Korea Selatan',
//             paymentMethod: 'Virtual Account',
//             itemsTotal: '300.000',
//             shippingCost: '25.000',
//             discount: '-15.000',
//             totalAmount: '310.000',
//         },
//     },
//     {
//         id: 55173,
//         custName: 'Uarmyhope',
//         date: '18 Februari 2024',
//         total: '400.000',
//         paidBy: 'Transfer Bank',
//         statusBayar: 'Sukses',
//         orderDetails: {
//             orderId: 55173,
//             orderDate: '18 Februari 2024',
//             productImage: '',
//             productName: 'Iwak Peyek',
//             quantity: 1,
//             pricePerUnit: '400.000',
//             recipient: 'Uarmyhope',
//             phone: '08137775555',
//             address: 'Gadjah Mada University, Perpustakaan UGM, Jl Tri Darma No.2, Karang Malang, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281 ',
//             paymentMethod: 'Bank Transfer',
//             itemsTotal: '400.000',
//             shippingCost: '30.000',
//             discount: '-20.000',
//             totalAmount: '410.000',
//         },
//     },
// ];

const TableHistory = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="overflow-x-auto p-6">
            <table className="w-full border-collapse text-left text-gray-700">
                <thead>
                    <tr className="border-b border-gray-300 text-gray-500 text-sm">
                        <th className="p-4">ID</th>
                        <th className="p-4">CUSTOMER</th>
                        <th className="p-4">TANGGAL</th>
                        <th className="p-4">TOTAL</th>
                        <th className="p-4">METODE BAYAR</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {historyPembelian.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 text-sm">
                            <td className="p-4">{item.id}</td>
                            <td className="p-4">{item.custName}</td>
                            <td className="p-4">{item.date}</td>
                            <td className="p-4">{(item.orderDetails.quantity * item.orderDetails.pricePerUnit).toFixed(3)}</td>
                            <td className="p-4">{item.paidBy}</td>
                            <td className="p-4">
                                <span className={
                                    item.statusBayar === 'Sukses' ? 'text-[#1A9882]' :
                                    item.statusBayar === 'Pending' ? 'text-[#F86624]' :
                                    item.statusBayar === 'Gagal' ? 'text-[#EB3D4D]' : ''
                                }>
                                    {item.statusBayar}
                                </span>
                            </td>
                            <td
                                className="p-4 text-blue-500 cursor-pointer hover:underline"
                                onClick={() => openModal(item.orderDetails)}
                            >
                                Lihat Details
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            <ModalConfig isOpen={isOpen} onClose={closeModal} orderDetails={selectedOrder} />
        </div>
    );
};

export default TableHistory;
