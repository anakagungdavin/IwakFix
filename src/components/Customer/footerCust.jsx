import React from "react";

const FooterCust = () => {
  return (
    <footer className="bg-[#003D47] text-white p-6 md:p-10 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* Grid container - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left Section - Brand and Address */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-yellow-400">iwak.</h2>
            <p className="mt-2 text-gray-300">
              400 University Drive Suite 200 <br />
              Coral Gables, FL 33134 USA
            </p>
          </div>

          {/* Middle Sections - Links & Help */}
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
              <li>
                <a
                  href="/contact"
                  className="text-yellow-400 hover:text-gray-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-200">Help</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="/payment-options"
                  className="text-yellow-400 hover:text-gray-300"
                >
                  Payment Options
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-yellow-400 hover:text-gray-300"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policies"
                  className="text-yellow-400 hover:text-gray-300"
                >
                  Privacy Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-200">Newsletter</h3>
            <div className="mt-2 flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="p-2 w-full border-b border-gray-400 bg-transparent focus:outline-none text-white placeholder-gray-400"
              />
              <button className="text-yellow-400 border-b border-yellow-400 hover:text-gray-300 pb-1">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-6 border-t border-gray-600 pt-4 text-center text-gray-400">
        <p>© 2025 iwak. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterCust;