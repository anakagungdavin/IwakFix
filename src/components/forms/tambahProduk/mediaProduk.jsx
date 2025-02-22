import React, { useState } from "react";

const UploadGambar = ({ onUpload }) => {
    const [gambarList, setGambarList] = useState([
        // { id: "1", url: "https://via.placeholder.com/150" },
        // { id: "2", url: "https://via.placeholder.com/150" },
    ]);

    const handleChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newGambarList = Array.from(files).map((file) => ({
                id: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                file,
            }));
            setGambarList((prev) => [...prev, ...newGambarList]);
            if (onUpload) {
                onUpload(files[0]); //1 gambar doang
            }
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const newGambarList = Array.from(files).map((file) => ({
                id: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                file,
            }));
            setGambarList((prev) => [...prev, ...newGambarList]);
            if (onUpload) {
                onUpload(files[0]) // 1 gambar
            }
        }
    };

    const handleRemove = (id) => {
        setGambarList(gambarList.filter((item) => item.id !== id));

        if(onUpload){
            onUpload(null) //reset image ke parent state
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Media</h2>
            <div 
                className = "border-2 border-dashed border-gray-300 rounded-md p-5 text-center cursor-pointer"
                onDragOver={(e) =>  e.preventDefault()}
                onDrop={handleDrop}
            >
                {gambarList.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {gambarList.map((item) => (
                            <div key={item.id} className="relative bg-white p-2 rounded-md shadow">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    <img src={item.url} alt="Preview" className="w-40 h-40 object-cover rounded-md" />
                                </a>
                                <button 
                                    onClick={() => handleRemove(item.id)} 
                                    className="absolute top-2 right-2 bg-[#FEECEE] text-[#EB3D4D] rounded-full p-1 text-xs shadow-md"
                                    >
                                        ✖
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-200 p-3 rounded-full">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V12m0 0V8m0 4h4m4 0h4m-4 0V8m0 4v4m-4-4v4m0-4V8m0 4H7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm mt-2 text-center">
                                Drag and drop image here, or click add image
                            </p>
                        </div>
                    
                )}

                
                    <label className="px-4 py-2 bg-[#003D47] text-white rounded-md mt-4 inline-block cursor-pointer">
                        Tambah Gambar
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleChange} 
                            accept="image/*" 
                            multiple={true}
                        />
                    </label>
            
            </div>
        </div>
    );
};

export default UploadGambar;
