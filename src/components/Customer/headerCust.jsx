import React from "react";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";

const HeaderCust = () => {
  return (
    <header className="bg-[#003D47] w-screen text-white h-15 flex items-center px-6 justify-center">
      
      {/* Left: Navigation */}
      <nav className="flex gap-6">
        <a href="/customer-dashboard" className="text-white hover:text-gray-300">Home</a>
        <a href="/about" className="text-white hover:text-gray-300">About</a>
        <a href="/shop" className="text-white hover:text-gray-300">Toko</a>
      </nav>

      {/* Center: Search Bar*/}
      <div className="px-15 flex items-center relative">
        <input 
          type="text" 
          placeholder="Cari bibit unggulan" 
          className="w-[800px] pl-10 pr-2 py-2 bg-white text-black rounded-[10px] focus:outline-none"
        />
      </div>

      {/* Right: Cart & Profile */}
      <div className="flex gap-6 items-center">
        <a href="/cart" className="text-white hover:text-gray-300">
          <FaShoppingCart size={24} />
        </a>
        <a href="/profile" className="flex flex-col items-center text-white hover:text-gray-300">
          <FaUserCircle size={24} />
          {/* <span>Profile</span> */}
        </a>
      </div>

    </header>
  );
};

export default HeaderCust;