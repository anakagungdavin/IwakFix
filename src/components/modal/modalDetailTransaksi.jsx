import React from "react";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            &larr; Kembali
          </button>
          <h2 className="text-lg font-semibold text-yellow-600">Detail Transaksi</h2>
        </div>

        {/* Status Pesanan */}
        <div className="flex items-center justify-between mt-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-md">
            Selesai
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-600">{transaction.code}</p>
            <p className="text-sm text-gray-600">{transaction.date}</p>
          </div>
        </div>

        {/* Detail Produk */}
        <div className="flex items-center gap-4 mt-4 border-b pb-4">
          <img src="/fish.png" alt="Ikan Gabus" className="w-16 h-16 object-cover rounded-md" />
          <div>
            <h3 className="text-md font-semibold text-gray-800">Ikan Gabus</h3>
            <p className="text-sm text-gray-600">
              {transaction.weight} kilogram x Rp{transaction.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Info Pengiriman */}
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-800">Info Pengiriman</h3>
          <p className="text-sm font-semibold">Jimin Park</p>
          <p className="text-sm text-gray-600">+6281234567890</p>
          <p className="text-sm text-gray-600">
            Gadjah Mada University, Perpustakaan UGM, Jl Tri Darma No.2, Karang Malang,
            Caturtunggal, Kec. Depok, Kabupaten Sleman, Yogyakarta 55281
          </p>
          <p className="text-sm text-gray-600">Nomor Resi: 10380192-CGK-29191</p>
        </div>

        {/* Rincian Pembayaran */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-md font-semibold text-gray-800">Rincian Pembayaran</h3>
          <div className="flex justify-between text-sm">
            <span>Metode Pembayaran</span>
            <span className="font-semibold">BCA Virtual Account</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Items(3)</span>
            <span>Rp130.000</span>
          </div>
          <div className="flex justify-between text-sm text-red-500 mt-2">
            <span>Discounts</span>
            <span>-Rp2.000</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Ongkir</span>
            <span>Rp130.000</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Total</span>
            <span>Rp130.000</span>
          </div>
        </div>

        {/* <div className="mt-4 flex justify-center">
          <button className="px-6 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-100 text-sm">
            Beli Lagi
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TransactionDetailModal;
