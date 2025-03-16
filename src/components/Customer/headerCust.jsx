import React, { useState } from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const HeaderCust = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#003D47] w-full text-white py-4 px-4 md:px-6">
      {/* Mobile View */}
      <div className="flex items-center justify-between sm:hidden">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className="flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari bibit unggulan"
              className="w-full pl-10 pr-4 py-2 bg-white text-black rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <a href="/cart" className="text-white hover:text-gray-300">
            <FaShoppingCart size={20} />
          </a>
          <a href="/profile" className="text-white hover:text-gray-300">
            <FaUserCircle size={20} />
          </a>
        </div>
      </div>

      {/* Mobile Navigation when menu is open */}
      <nav className={`${isMenuOpen ? "block" : "hidden"} sm:hidden mt-4`}>
        <a
          href="/customer-dashboard"
          className="block py-2 text-white hover:text-gray-300"
        >
          Home
        </a>
        <a href="/about" className="block py-2 text-white hover:text-gray-300">
          About
        </a>
        <a href="/shop" className="block py-2 text-white hover:text-gray-300">
          Toko
        </a>
      </nav>

      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <div className="text-xl font-bold mr-8">
            <a href="/" className="flex items-center">
              BibitToko
            </a>
          </div>

          {/* Desktop Navigation on same line as logo */}
          <nav className="flex items-center space-x-6">
            <a
              href="/customer-dashboard"
              className="text-white hover:text-gray-300"
            >
              Home
            </a>
            <a href="/about" className="text-white hover:text-gray-300">
              About
            </a>
            <a href="/shop" className="text-white hover:text-gray-300">
              Toko
            </a>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari bibit unggulan"
              className="w-full pl-10 pr-4 py-2 bg-white text-black rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Cart & Profile with text labels for desktop */}
        <div className="flex gap-6 items-center">
          <a
            href="/cart"
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <FaShoppingCart size={20} />
            <span>Cart</span>
          </a>
          <a
            href="/profile"
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <FaUserCircle size={20} />
            <span>Profile</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderCust;