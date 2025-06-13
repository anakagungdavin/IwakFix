// DashboardCust.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderCust from "../../components/Customer/headerCust";
import ProductRecommendations from "../../components/Customer/productRecommendation";
import FooterCust from "../../components/Customer/footerCust";
import WebsiteStatsSection from "../../components/Customer/WebsiteStatsSection";
import PasswordReminderModal from "../../components/modal/PasswordReminderModal";

// ... (fishTypes tetap sama)
const fishTypes = [
  {
    id: 1,
    name: "Lele",
    image: ["/images/lele.jpeg"],
    nutrition: {
      short: ["Protein 18g Calories 120"],
      detailed: {
        protein: "18g per 100g",
        calories: "120 kcal per serving",
        omega3: "1.2g",
        fat: "5g",
        calcium: "85mg",
      },
    },
  },
  {
    id: 2,
    name: "Nila",
    image: ["/images/nila.jpeg"],
    nutrition: {
      short: ["Protein 20g Calories 96"],
      detailed: {
        protein: "20g per 100g",
        calories: "96 kcal per serving",
        omega3: "0.4g",
        fat: "3.2g",
        calcium: "60mg",
      },
    },
  },
  {
    id: 3,
    name: "Mas",
    image: ["/images/mas.jpeg"],
    nutrition: {
      short: ["Protein 16g Calories 135"],
      detailed: {
        protein: "16g per 100g",
        calories: "135 kcal per serving",
        omega3: "0.8g",
        fat: "7g",
        calcium: "70mg",
      },
    },
  },
  {
    id: 4,
    name: "Gurami",
    image: ["/images/gurame.jpeg"],
    nutrition: {
      short: ["Protein 19g Calories 110"],
      detailed: {
        protein: "19g per 100g",
        calories: "110 kcal per serving",
        omega3: "1.5g",
        fat: "4.8g",
        calcium: "92mg",
      },
    },
  },
];

const DashboardCust = () => {
  const [hoveredFishId, setHoveredFishId] = useState(null);
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiUrl =
        import.meta.env.VITE_API_URL || "https://iwak.onrender.com";
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        }
      } else {
        console.error("Gagal mengambil profil user:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userData) {
      const { lastPasswordChangeAt, createdAt } = userData;
      const checkDate = lastPasswordChangeAt
        ? new Date(lastPasswordChangeAt)
        : new Date(createdAt);

      // Atur interval sesuai kebutuhan pengujian atau produksi
      const intervalInMs = 6 * 30 * 24 * 60 * 60 * 1000; // Produksi: 6 bulan
      // const intervalInMs = 1 * 60 * 1000; // Pengujian: 6 detik (0.1 menit)
      // const intervalInMs = 30 * 1000; // Pengujian: 10 detik

      const targetTime = new Date(Date.now() - intervalInMs);

      // HILANGKAN pengecekan sessionStorage
      // const reminderShownThisSession = sessionStorage.getItem(
      // "passwordReminderShown"
      // );

      // Sekarang modal akan muncul jika kondisi tanggal terpenuhi,
      // tidak peduli apa yang ada di sessionStorage
      if (checkDate < targetTime) {
        setShowPasswordModal(true);
      } else {
        // Jika kondisi tanggal tidak terpenuhi, pastikan modal tidak tampil
        // (berguna jika user baru saja ganti password di sesi yang sama)
        setShowPasswordModal(false);
      }
    }
  }, [userData]);

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    // HILANGKAN pengaturan sessionStorage di sini jika ingin modal selalu muncul
    // sessionStorage.setItem("passwordReminderShown", "true");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <HeaderCust />
      </div>

      <PasswordReminderModal
        isOpen={showPasswordModal}
        onClose={handleClosePasswordModal}
      />

      {/* ... sisa JSX Anda ... */}
      <div className="bg-[#003D47] text-white py-4 pb-0 px-4 md:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-start">
          <img
            src="/images/logo/Slice 1-fix.png"
            alt="Siphiko Logo"
            className="w-[290px] h-[153px] object-contain mb-4"
          />
          <p className="text-base md:text-lg text-white font-bold text-left">
            Dinas Ketahanan Pangan dan Pertanian Kota Surakarta
          </p>
          <p className="text-sm md:text-lg text-white font-normal text-left">
            UPTD Aneka Usaha Perikanan
          </p>
        </div>
      </div>

      <section className="relative bg-[#003D47] text-white pt-10 pb-20 px-4 md:px-6 lg:px-12 rounded-br-[80px] overflow-hidden">
        <img
          src="/images/fish.png"
          alt="fish background"
          className="absolute top-0 right-0 w-full sm:w-[900px] opacity-45 pointer-events-none select-none object-cover h-full sm:h-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="text-left md:max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 leading-tight">
              Temukan Benih Ikan Terbaik
              <br /> dan Berkualitas Hanya di Sini!
            </h1>
            <p className="mt-4 text-white text-base md:text-lg font-light">
              Kami menyediakan berbagai jenis bibit ikan unggulan dengan
              kualitas terjamin. Dapatkan bibit sehat, siap tebar, dan dikirim
              langsung ke lokasi Anda dengan cepat dan aman. Percayakan
              kebutuhan bibit ikan Anda kepada kami untuk hasil panen yang lebih
              optimal!
            </p>
          </div>
        </motion.div>
      </section>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-12 -mt-12 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-2 md:px-0">
          {fishTypes.map((fish) => (
            <div key={fish.id} className="relative">
              <motion.div
                onClick={() => {
                  navigate(`/product/${fish.id}`, { state: { fish } });
                  window.scrollTo(0, 0);
                }}
                onMouseEnter={() => setHoveredFishId(fish.id)}
                onMouseLeave={() => setHoveredFishId(null)}
                animate={{
                  scale: hoveredFishId === fish.id ? 1.05 : 1,
                  zIndex: hoveredFishId === fish.id ? 20 : 1,
                  boxShadow:
                    hoveredFishId === fish.id
                      ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                initial={false}
                transition={{ duration: 0.3 }}
                className={`bg-[#80B3BB] text-white p-3 md:p-4 rounded-lg border-2 ${
                  hoveredFishId === fish.id
                    ? "border-blue-500"
                    : "border-transparent"
                } cursor-pointer flex flex-col items-center justify-center w-full ${
                  hoveredFishId === fish.id
                    ? "absolute left-0 top-0"
                    : "relative"
                }`}
                style={{
                  minHeight: hoveredFishId === fish.id ? "240px" : "160px",
                  height: hoveredFishId === fish.id ? "240px" : "auto",
                }}
              >
                {hoveredFishId === fish.id ? (
                  <div className="flex flex-col items-center w-full py-2">
                    <img
                      src={fish.image[0]}
                      alt={fish.name}
                      className="w-14 md:w-16 h-14 md:h-16 object-contain mb-1"
                    />
                    <p className="text-center font-semibold text-sm md:text-base mb-2">
                      {fish.name}
                    </p>
                    <div className="h-px w-3/4 bg-white/50 mb-2"></div>
                    <div className="w-full text-xs px-2">
                      {Object.entries(fish.nutrition.detailed).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-0.5"
                          >
                            <span className="capitalize font-medium">
                              {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                            </span>
                            <span className="text-right">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2 h-[140px] justify-between">
                    <img
                      src={fish.image[0]}
                      alt={fish.name}
                      className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 object-contain"
                    />
                    <p className="text-center font-semibold mt-2 text-sm md:text-base">
                      {fish.name}
                    </p>
                    <div className="flex flex-col items-center mt-1">
                      {fish.nutrition.short.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-200 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              <div className="invisible h-[160px]"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        <ProductRecommendations />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 py-8">
        <WebsiteStatsSection />
      </div>

      <FooterCust />
    </div>
  );
};

export default DashboardCust;
