import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome /> },
    {
      name: "Manajemen Produk",
      path: "/product-management",
      icon: <FaShoppingCart />,
    },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    {
      name: "Riwayat Bukti Transaksi",
      path: "/riwayat-transaksi",
      icon: <FaClipboardList />,
    },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // For desktop sidebar
  if (!isMobile) {
    return (
      <div className="flex h-full">
        <div
          className={`bg-white shadow-md h-full p-5 ${
            isOpen ? "w-64" : "w-20"
          } transition-all duration-300 flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1
                className={`text-yellow-500 font-bold text-2xl ${
                  !isOpen && "hidden"
                }`}
              >
                iwak.
              </h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 text-2xl"
              >
                <FaBars />
              </button>
            </div>

            <p
              className={`text-gray-400 uppercase text-sm mb-2 ${
                !isOpen && "hidden"
              }`}
            >
              Main Menu
            </p>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all 
                      ${
                        location.pathname === item.path
                          ? "bg-gray-100 font-semibold text-[#003D47]"
                          : "text-[#8B909A]"
                      }`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {isOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul>
              <li>
                <button
                  onClick={handleLogOut}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-red-200 text-red-500 transition-all"
                >
                  <span className="text-lg mr-3">
                    <FaSignOutAlt />
                  </span>
                  {isOpen && <span>Log Out</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // For mobile dropdown
  return (
    <ul className="w-full py-2">
      {menuItems.map((item, index) => (
        <li key={index} className="w-full">
          <Link
            to={item.path}
            className={`flex items-center px-4 py-3 hover:bg-gray-100/70 transition-all 
              ${
                location.pathname === item.path
                  ? "bg-gray-200/70 font-semibold text-[#003D47]"
                  : "text-[#8B909A]"
              }`}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
      <li className="w-full">
        <button
          onClick={handleLogOut}
          className="flex items-center w-full px-4 py-3 hover:bg-red-100/70 text-red-500 transition-all"
        >
          <span className="text-lg mr-3">
            <FaSignOutAlt />
          </span>
          <span>Log Out</span>
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
