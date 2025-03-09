import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditAddressModal from "../../modal/modalEditAlamat";
import AddressModal from "../../modal/modalTambahAlamat";
import DeleteModal from "../../modal/modalDelete";

const Alamat = () => {
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([
        { id: 1, name: "Jimin Park", street: "4517 Kotagede, Yogyakarta", phone: "000000000000", postalCode: "551171", province: "DIY", city: "Yogyakarta", isPrimary: false },
        { id: 2, name: "Kim Taehyung", street: "221B Baker Street, London", phone: "111111111111", postalCode: "NW16XE", province: "London", city: "London", isPrimary: false },
    ]);
    
    const handleEditClick = (address) => {
        setSelectedAddress(address);
        setIsEditOpen(true);
    };
    
    const handleDeleteClick = (address) => {
        setSelectedAddress(address);
        setIsDeleteOpen(true);
    };
    
    const confirmDelete = () => {
        setAddresses(addresses.filter(addr => addr.id !== selectedAddress.id));
        setIsDeleteOpen(false);
    };

    return (
        <div>
            <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center px-4 py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Alamat
            </button>
            <div className="mt-6 space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border">
                        <div>
                            <h3 className="font-semibold text-gray-800">{address.name}</h3>
                            <p className="text-gray-500 text-sm">{address.street}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditClick(address)} className="flex items-center gap-1 bg-[#fdfbe7] text-[#ff9d00] px-3 py-1 rounded-lg shadow-md hover:bg-yellow-400 transition">
                                <Pencil size={14} /> Edit
                            </button>
                            <button onClick={() => handleDeleteClick(address)} className="flex items-center gap-1 bg-[#FEECEE] text-[#EB3D4D] px-3 py-1 rounded-lg shadow-md hover:bg-red-300 transition">
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <EditAddressModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} address={selectedAddress} />
            <AddressModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
            <DeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} />
        </div>
    );
};

export default Alamat;
