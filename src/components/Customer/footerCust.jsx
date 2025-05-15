import React from "react";
import AupImage from "/images/aup.png";

const FooterCust = () => {
  return (
    <footer className="bg-[#003D47] text-white p-6 md:p-10 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* Grid container - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Section - Brand and Address */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-yellow-400">Siphiko</h2>
            <p className="mt-2 text-gray-300">
              Jalan Pleret Raya, Kelurahan Sumber, Kecamatan Banjarsari <br />
              Kota Surakarta
            </p>
          </div>

          {/* Middle Section - Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-200">Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="text-yellow-400 hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="text-yellow-400 hover:text-gray-300">
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-yellow-400 hover:text-gray-300"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Image and Text */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src={AupImage}
              alt="AUP"
              className="w-50 h-auto object-contain"
            />
            <h3 className="text-base font-semibold text-gray-200">
              UPTD Aneka Usaha Perikanan
            </h3>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-6 border-t border-gray-600 pt-4 text-center text-gray-400">
        <p>© 2025 Siphiko. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterCust;
