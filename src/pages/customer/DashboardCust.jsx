import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderCust from "../../components/Customer/headerCust";
import ProductRecommendations from "../../components/Customer/productRecommendation";
import FooterCust from "../../components/Customer/footerCust";
import CustomerReviews from "../../components/Customer/reviewCust";

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

const fullText = "Temukan benih Ikan Terbaik dan berkualitas hanya di sini!";
const typingSpeed = 50; // Speed of typing effect (ms per character)

const DashboardCust = () => {
  const [hoveredFishId, setHoveredFishId] = useState(null);
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter Effect
  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowCursor(false), 500); // Hide cursor after finishing
    }
  }, [textIndex]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <HeaderCust />
      </div>

      {/* Logo and Siphiko Banner */}
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

      {/* Hero Section */}
      <section className="relative bg-[#003D47] text-white pt-10 pb-20 px-4 md:px-6 lg:px-12 rounded-br-[80px] overflow-hidden">
        {/* Background Ikan Kanan */}
        <img
          src="/images/fish.png"
          alt="fish background"
          className="absolute top-0 right-0 w-[900px] opacity-45 pointer-events-none select-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="text-left md:max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 leading-snug">
              Temukan Benih Ikan Terbaik<br /> dan Berkualitas Hanya di Sini!
            </h1>
            <p className="mt-4 text-white text-base md:text-lg font-light">
              Kami menyediakan berbagai jenis bibit ikan unggulan dengan kualitas terjamin.
              Dapatkan bibit sehat, siap tebar, dan dikirim langsung ke lokasi Anda dengan cepat dan aman.
              Percayakan kebutuhan bibit ikan Anda kepada kami untuk hasil panen yang lebih optimal!
            </p>
          </div>

          {/* Fish Types Grid (tetap dipakai) */}
          {/* <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {fishTypes.map((fish) => (
              <div
                key={fish.id}
                onClick={() => navigate(`/product/${fish.id}`, { state: { fish } })}
                className="bg-[#80B3BB] p-4 rounded-xl cursor-pointer text-center shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={fish.image}
                  alt={fish.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="font-semibold text-white">{fish.name}</p>
              </div>
            ))}
          </div> */}
        </motion.div>
      </section>

      {/* Fish Types Section - Responsive Layout */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-12 -mt-12 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-2 md:px-0">
          {fishTypes.map((fish) => (
            <div
              key={fish.id}
              className="relative"
              style={{
                minHeight: hoveredFishId === fish.id ? "240px" : "auto",
              }}
            >
              <motion.div
                onClick={() => {
                  navigate(`/product/${fish.id}`, { state: { fish } });
                  window.scrollTo(0, 0);
                }}
                onMouseEnter={() => setHoveredFishId(fish.id)}
                onMouseLeave={() => setHoveredFishId(null)}
                animate={{
                  scale: hoveredFishId === fish.id ? 1.05 : 1,
                  zIndex: hoveredFishId === fish.id ? 10 : 1,
                  boxShadow:
                    hoveredFishId === fish.id
                      ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                initial={false}
                transition={{ duration: 0.3 }}
                className={`bg-[#80B3BB] p-3 md:p-4 rounded-lg border-2 ${
                  hoveredFishId === fish.id
                    ? "border-blue-500"
                    : "border-transparent"
                } cursor-pointer flex flex-col items-center justify-center h-auto w-full absolute`}
                style={{
                  minHeight: hoveredFishId === fish.id ? "240px" : "auto",
                  height: "auto",
                }}
              >
                {hoveredFishId === fish.id ? (
                  /* Hover View Content - Detailed Nutrition */
                  <div className="flex flex-col items-center w-full py-2">
                    <img
                      src={fish.image}
                      alt={fish.name}
                      className="w-14 md:w-16 h-14 md:h-16 object-contain mb-1"
                    />
                    <p className="text-center font-semibold text-sm md:text-base mb-2">
                      {fish.name}
                    </p>
                    <div className="h-px w-3/4 bg-white/50 mb-2"></div>
                    {/* Detailed Nutrition Table */}
                    <div className="w-full text-xs px-2">
                      {Object.entries(fish.nutrition.detailed).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between py-1">
                            <span className="capitalize font-medium">
                              {key}:
                            </span>
                            <span className="text-right">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  /* Normal View Content */
                  <div className="flex flex-col items-center py-2">
                    <img
                      src={fish.image}
                      alt={fish.name}
                      className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 object-contain"
                    />
                    <p className="text-center font-semibold mt-2 text-sm md:text-base">
                      {fish.name}
                    </p>
                    {/* Short Nutrition Info */}
                    <div className="flex flex-col items-center mt-1">
                      {fish.nutrition.short.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-800 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              {/* Spacer div to maintain grid layout - height matches content */}
              <div
                className={`invisible bg-transparent rounded-lg ${
                  hoveredFishId === fish.id ? "h-60" : "h-32 md:h-36 lg:h-40"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      {/* Product Recommendations */}
      <div className="pt-16 md:pt-20 lg:pt-24 max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        <ProductRecommendations />
      </div>
      {/* <CustomerReviews /> */}
      {/* Footer */}
      <FooterCust />
    </div>
  );
};

export default DashboardCust;
