import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Alamat = () => {
    const navigate = useNavigate()
    return (
        <div>
            <button
               onClick={() => navigate("")}
               className="flex items-center px-4 py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Tambah Alamat
            </button>
            <div className="mt-6 space-y-4">
                    {[1, 2].map((index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border">
                            <div>
                                <h3 className="font-semibold text-gray-800">Jimin Park</h3>
                                <p className="text-gray-500 text-sm">4517 Kotagede, Yogyakarta</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 bg-yellow-300 text-black px-3 py-1 rounded-lg shadow-md hover:bg-yellow-400 transition">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button className="flex items-center gap-1 bg-red-200 text-black px-3 py-1 rounded-lg shadow-md hover:bg-red-300 transition">
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default Alamat;