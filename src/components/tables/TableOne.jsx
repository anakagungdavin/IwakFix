import React, { useState } from "react";
import TableProcessor from "./TableProcessor";
import ModalConfig from "../modal/ModalConfig";

  const data = [
    {
      id: "#5089",
      date: "31 March 2023",
      total: "$1200",
      orderDetails: {
        orderId: "#5089",
        orderDate: "31 March 2023",
        productImage: "/path/to/local/image.jpg", // Replace with actual image
        productName: "Ikan Gabus",
        quantity: "2 kilogram",
        pricePerUnit: "$30.00",
        recipient: "Jimin Park",
        phone: "+6281234567890",
        address:
          "Gadjah Mada University, Perpustakaan UGM, Jl Tri Darma No.2, Karang Malang, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
        paymentMethod: "BCA Virtual",
        itemsTotal: "$1200",
        shippingCost: "$30",
        discount: "-$20",
        totalAmount: "$1210",
      },
    },
    // Add more rows as needed
  ];

const columns = [
  { label: "ID", accessor: "id", width: "20%" },
  { label: "Tanggal", accessor: "date", width: "30%" },
  { label: "Total", accessor: "total", width: "30%" },
  { label: "Actions", accessor: "actions", width: "20%" },
];

const TableOne = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    { header: "ID", key: "id" },
    { header: "Tanggal", key: "date" },
    { header: "Total", key: "total" },
    {
      header: "Actions",
      key: "actions",
      renderAction: (row, onActionClick) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => onActionClick(row)}
        >
          Lihat Detail
        </button>
      ),
    },
  ];

  const handleActionClick = (row) => {
    setSelectedOrder(row.orderDetails);
    setModalOpen(true);
  };

  return (
    <div>
      <TableProcessor columns={columns} data={data} onActionClick={handleActionClick} />
      <ModalConfig
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        orderDetails={selectedOrder}
      />
    </div>
  );
};

export default TableOne;