import React from "react";

const HeaderCust = () => {
  return (
    <header className="bg-[#003D47] w-screen text-white h-15 flex items-center px-6 justify-center">
      
      {/* Left: Navigation */}
      <nav className="flex gap-6">
        <a href="/" className="text-white hover:text-gray-300">Home</a>
        <a href="/about" className="text-white hover:text-gray-300">About</a>
        <a href="/shop" className="text-white hover:text-gray-300">Toko</a>
      </nav>

      {/* Center: Search Bar (flex-grow to take space) */}
      <div className="px-12 justify-center">
        <input 
          type="text" 
          placeholder="Find the best fish in town" 
          className="w-[800px] px-2 py-1 bg-white text-black rounded-md"
        />
      </div>

      {/* Right: Cart & Profile */}
      <div className="flex gap-6">
        <a href="/cart" className="text-white hover:text-gray-300">🛒 Cart</a>
        <a href="/profile" className="text-white hover:text-gray-300">👤 Profile</a>
      </div>

    </header>
  );
};

export default HeaderCust;