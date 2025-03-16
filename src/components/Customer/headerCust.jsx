// headerCust.jsx
import React, { useState } from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HeaderCust = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = async (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products?search=${encodeURIComponent(query)}&limit=5`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Search results:", data); // Debugging
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
      setSearchQuery(""); // Reset input setelah submit
    }
  };

  return (
    <header className="bg-[#003D47] w-full text-white py-4 px-4 md:px-6">
      {/* Mobile View */}
      <div className="flex items-center justify-between sm:hidden relative">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className="flex-1 max-w-md mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari bibit unggulan"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-black rounded-lg focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-50 bg-white text-black w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                {searchResults.map((product) => (
                  <a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => setSearchResults([])} // Tutup dropdown saat klik
                  >
                    {product.name} - Rp{" "}
                    {product.discountedPrice.toLocaleString()}
                  </a>
                ))}
              </div>
            )}
          </form>
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

      {/* Mobile Navigation */}
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
          <div className="text-xl font-bold mr-8">
            <a href="/customer-dashboard" className="flex items-center">
              BibitToko
            </a>
          </div>
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

        <div className="flex-1 max-w-2xl mx-8 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari bibit unggulan"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-black rounded-lg focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-50 bg-white text-black w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                {searchResults.map((product) => (
                  <a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => setSearchResults([])}
                  >
                    {product.name} - Rp{" "}
                    {product.discountedPrice.toLocaleString()}
                  </a>
                ))}
              </div>
            )}
          </form>
        </div>

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
