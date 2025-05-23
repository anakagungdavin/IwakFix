import React, { useState } from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignInAlt, // Icon baru untuk login, opsional
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const HeaderCust = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Cek apakah ada token
  const userRole = localStorage.getItem("role");
  const isAdmin = token && userRole === "admin"; // Pastikan token ada sebelum cek role

  // Tentukan link dan teks berdasarkan status login dan role
  let authLinkPath = "/login";
  let authLinkText = "Masuk";
  let AuthIcon = FaSignInAlt; // Menggunakan FaSignInAlt untuk login, bisa diganti FaUserCircle jika mau

  if (token) {
    authLinkPath = isAdmin ? "/admin-dashboard" : "/profile";
    authLinkText = isAdmin ? "Dashboard" : "Profil";
    AuthIcon = FaUserCircle; // Gunakan FaUserCircle untuk Profile/Dashboard
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
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
          </form>
        </div>

        <div className="flex gap-4 items-center">
          {/* Tampilkan Cart hanya jika login dan bukan admin */}
          {token && !isAdmin && (
            <Link to="/cart" className="text-white hover:text-gray-300">
              <FaShoppingCart size={20} />
            </Link>
          )}
          <Link
            to={authLinkPath}
            className="text-white hover:text-gray-300 flex items-center gap-2"
          >
            <AuthIcon size={20} />
            <span className="text-sm hidden xs:inline">{authLinkText}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`${isMenuOpen ? "block" : "hidden"} sm:hidden mt-4`}>
        <Link
          to="/customer-dashboard"
          className="block py-2 text-white hover:text-gray-300"
          onClick={toggleMenu}
        >
          Beranda
        </Link>
        <Link
          to="/about"
          className="block py-2 text-white hover:text-gray-300"
          onClick={toggleMenu}
        >
          Tentang Kami
        </Link>
        <Link
          to="/shop"
          className="block py-2 text-white hover:text-gray-300"
          onClick={toggleMenu}
        >
          Produk
        </Link>
      </nav>

      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-8">
            <Link to="/customer-dashboard" className="flex items-center gap-2">
              <img
                src="/images/logo/pemkot.png"
                alt="Pemkot Logo"
                className="h-8 w-auto"
              />
              <img
                src="/images/logo/Slice 1-fix.png"
                alt="IWAK Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              to="/customer-dashboard"
              className="text-white hover:text-gray-300"
            >
              Beranda
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300">
              Tentang Kami
            </Link>
            <Link to="/shop" className="text-white hover:text-gray-300">
              Produk
            </Link>
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
          </form>
        </div>

        <div className="flex gap-6 items-center">
          {/* Tampilkan Cart hanya jika login dan bukan admin */}
          {token && !isAdmin && (
            <Link
              to="/cart"
              className="flex items-center gap-2 text-white hover:text-gray-300"
            >
              <FaShoppingCart size={20} />
              <span>Keranjang</span>
            </Link>
          )}
          <Link
            to={authLinkPath}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <AuthIcon size={20} />
            <span>{authLinkText}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderCust;
