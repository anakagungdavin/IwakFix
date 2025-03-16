import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

const MainLayout = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if the screen width is mobile sized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobileView ? "column" : "row",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {isMobileView ? (
        <>
          <div className="flex justify-between items-center py-2 px-4 bg-white shadow-sm">
            <div className="text-yellow-500 font-bold text-xl">iwak.</div>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
                onClick={toggleMobileMenu}
              />

              {/* Dropdown Menu */}
              <div className="absolute top-12 right-0 left-0 mx-2 max-h-96 overflow-y-auto rounded-lg shadow-lg z-20 bg-white/90 backdrop-blur-md">
                <Sidebar isMobile={true} />
              </div>
            </>
          )}
        </>
      ) : (
        // For desktop view
        <div className="h-screen">
          <Sidebar isMobile={false} />
        </div>
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          padding: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;