import React from "react";
import AupImage from "/images/aup.png";

const FooterCust = () => {
  return (
    <footer className="bg-[#003D47] text-white p-6 md:p-10 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* Grid container - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Section - Brand, Address, and WhatsApp */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-yellow-400">Siphiko</h2>
            <p className="mt-2 text-gray-300">
              Jalan Pleret Raya, Kelurahan Sumber, Kecamatan Banjarsari <br />
              Kota Surakarta
            </p>
            <p className="text-white">
              <span className="font-semibold">Jam Pelayanan:</span> <br />
              Senin-Kamis: 8:00 - 15:00 <br />
              Jumat: 8:00 - 13:00
            </p>
            <p className="mt-2 text-gray-300">Telepon: (0271)716461</p>
            <p className="mt-2 text-gray-300">WhatsApp: 085713561686</p>
            <a
              href="https://wa.me/6285713561686"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.561 4.248 1.621 6.083L0 24l5.917-1.621A11.905 11.905 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.838 0-3.64-.492-5.223-1.423l-.374-.199-3.51.961.961-3.51-.199-.374A10.02 10.02 0 012 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.744-6.86c-.295-.148-1.764-.867-2.038-.967-.274-.1-.472-.148-.67.148-.198.295-.767.967-.944 1.164-.177.198-.354.222-.649.074-.295-.148-1.25-.46-2.38-1.467-.885-.786-1.483-1.756-1.66-2.051-.177-.295-.018-.456.133-.604.134-.132.295-.346.443-.519.148-.173.198-.295.295-.492.098-.198.05-.37-.025-.519-.074-.148-.67-1.615-.92-2.208-.246-.578-.495-.498-.67-.498h-.57c-.198 0-.519.074-.767.346-.247.272-.944.914-.944 2.229s.964 2.58 1.1 2.777c.137.198 1.888 2.876 4.573 4.036 2.682 1.16 2.682.774 3.167.724.485-.05 1.565-.629 1.789-1.235.222-.606.222-1.135.148-1.235-.074-.099-.272-.198-.567-.346z" />
              </svg>
              Hubungi via WhatsApp
            </a>
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
