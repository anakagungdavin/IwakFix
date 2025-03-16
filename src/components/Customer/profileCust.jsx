import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InformasiCust from "./profile/informasi";
import Alamat from "./profile/alamat";
import TransactionList from "./profile/pesanan";

const CustProfile = () => {
  const [activeMenu, setActiveMenu] = useState("Profile Saya");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const menuItems = [
    { name: "Profile Saya", icon: "fas fa-user", tab: "profile" },
    { name: "Pesanan Saya", icon: "fas fa-box", tab: "orders" },
    { name: "Alamat", icon: "fas fa-map-marker-alt", tab: "address" },
  ];

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = JSON.parse(text);
        setUserData(result.data);
      } else {
        throw new Error("Unexpected response format: " + text);
      }
    } catch (err) {
      setError(err.message);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const selectedMenu = menuItems.find((item) => item.tab === tab);
      if (selectedMenu) {
        setActiveMenu(selectedMenu.name);
      }
    }
  }, [searchParams]);

  const handleMenuClick = (menuName, tab) => {
    setActiveMenu(menuName);
    setMenuOpen(false);
    navigate(`/profile?tab=${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <img
              src={userData?.avatar || "https://via.placeholder.com/80"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
            <div>
              <p className="text-sm text-gray-600">Hello,</p>
              <h2 className="text-base font-semibold">
                {userData?.name || "User"}
              </h2>
            </div>
          </div>
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block md:w-1/4 bg-white shadow-md p-4 md:p-6 rounded-lg`}
        >
          <div className="flex flex-col items-center">
            <img
              src={userData?.avatar || "https://via.placeholder.com/80"}
              alt="User Avatar"
              className="w-16 md:w-20 h-16 md:h-20 rounded-full border-4 border-gray-300"
            />
            <p className="mt-3 text-gray-600">Hello,</p>
            <h2 className="text-lg font-semibold">
              {userData?.name || "User"}
            </h2>
          </div>
          <div className="mt-6">
            <ul className="space-y-2 md:space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleMenuClick(item.name, item.tab)}
                  className={`flex items-center gap-2 p-2 md:p-3 rounded-md cursor-pointer font-semibold ${
                    activeMenu === item.name
                      ? "bg-[#003D47] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <i className={item.icon}></i> {item.name}
                </li>
              ))}
              <li
                onClick={handleLogout}
                className="text-red-500 font-semibold p-2 md:p-3 hover:bg-red-100 rounded-md cursor-pointer"
              >
                Log Out
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            {activeMenu}
          </h2>
          {activeMenu === "Profile Saya" && (
            <InformasiCust userData={userData} />
          )}
          {activeMenu === "Pesanan Saya" && (
            <TransactionList userId={userData?._id} />
          )}
          {activeMenu === "Alamat" && <Alamat userData={userData} />}
        </div>
      </div>
    </div>
  );
};

export default CustProfile;