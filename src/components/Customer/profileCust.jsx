// profileCust.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InformasiCust from "./profile/informasi";
import Alamat from "./profile/alamat"; // Pastikan path ini benar
import TransactionList from "./profile/pesanan";
import ChangePassword from "./profile/gantiPassword"; // <-- IMPORT KOMPONEN BARU

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
    { name: "Ganti Password", icon: "fas fa-key", tab: "change-password" }, // <-- TAMBAHKAN MENU INI
  ];

  const fetchUserProfile = async () => {
    // ... (fungsi fetchUserProfile tetap sama)
    try {
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
      setError(null);
    } catch (err) {
      setError(err.message);
      // navigate("/login"); // Jangan redirect otomatis saat error fetch profil, biarkan user lihat errornya
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserProfile().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const selectedMenu = menuItems.find((item) => item.tab === tab);
      if (selectedMenu) {
        setActiveMenu(selectedMenu.name);
      }
    } else {
      // Default ke "Profile Saya" jika tidak ada tab di URL
      setActiveMenu("Profile Saya");
      navigate("/profile?tab=profile", { replace: true });
    }
  }, [searchParams, navigate]); // tambahkan navigate ke dependencies

  const handleMenuClick = (menuName, tab) => {
    setActiveMenu(menuName);
    setMenuOpen(false);
    navigate(`/profile?tab=${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !userData) {
    // Hanya tampilkan error besar jika user data tidak ada
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400 p-4 bg-gray-100 dark:bg-gray-900">
        Error: {error} <br />
        <button
          onClick={() => navigate("/login")}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-t-lg shadow-sm">
          <div className="flex items-center gap-2">
            <img
              src={userData?.avatar || "/images/avatar_placeholder.webp"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hello,</p>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {userData?.name || "User"}
              </h2>
            </div>
          </div>
          <button
            onClick={toggleMenu}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none"
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
          } md:block md:w-1/4 bg-white dark:bg-gray-800 md:shadow-md p-4 md:p-6 md:rounded-l-lg ${
            menuOpen ? "rounded-b-lg shadow-md" : ""
          }`}
        >
          <div className="flex-col items-center hidden md:flex">
            {" "}
            {/* Sembunyikan di mobile karena sudah ada di header mobile */}
            <img
              src={userData?.avatar || "/images/avatar_placeholder.webp"}
              alt="User Avatar"
              className="w-16 md:w-20 h-16 md:h-20 rounded-full border-4 border-gray-300 dark:border-gray-600"
            />
            <p className="mt-3 text-gray-600 dark:text-gray-400">Hello,</p>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userData?.name || "User"}
            </h2>
          </div>
          <div className="mt-0 md:mt-6">
            <ul className="space-y-2 md:space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleMenuClick(item.name, item.tab)}
                  className={`flex items-center gap-2 p-2 md:p-3 rounded-md cursor-pointer font-semibold ${
                    activeMenu === item.name
                      ? "bg-[#003D47] text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <i className={item.icon}></i> {item.name}
                </li>
              ))}
              <li
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 md:p-3 text-red-500 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md cursor-pointer"
              >
                <i className="fas fa-sign-out-alt"></i> Keluar
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-b-lg md:rounded-r-lg md:rounded-bl-none shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
            {activeMenu}
          </h2>
          {activeMenu === "Profile Saya" && userData && (
            <InformasiCust
              userData={userData}
              onProfileUpdate={fetchUserProfile}
            />
          )}
          {activeMenu === "Pesanan Saya" && userData && (
            <TransactionList userId={userData?._id} />
          )}
          {activeMenu === "Alamat" && userData && (
            <Alamat userData={userData} onDataUpdate={fetchUserProfile} />
          )}
          {activeMenu === "Ganti Password" && ( // <-- RENDER KOMPONEN BARU
            <ChangePassword />
          )}
          {/* Tampilkan pesan error fetch profil di sini jika ada, tapi konten lain masih bisa tampil */}
          {error && userData && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded">
              Update profil terakhir mungkin gagal: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
