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

      const apiUrl = import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
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
        setUserData(result.data); // Simpan hanya result.data
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
    navigate(`/profile?tab=${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg flex gap-8">
        <div className="w-1/4 bg-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col items-center">
            <img
              src={userData?.avatar || "https://via.placeholder.com/80"}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-gray-300"
            />
            <p className="mt-3 text-gray-600">Hello,</p>
            <h2 className="text-lg font-semibold">
              {userData?.name || "User"}
            </h2>
          </div>
          <div className="mt-6">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleMenuClick(item.name, item.tab)}
                  className={`flex items-center gap-2 p-3 rounded-md cursor-pointer font-semibold ${
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
                className="text-red-500 font-semibold p-3 hover:bg-red-100 rounded-md cursor-pointer"
              >
                Log Out
              </li>
            </ul>
          </div>
        </div>
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">{activeMenu}</h2>
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