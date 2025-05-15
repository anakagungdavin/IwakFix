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
    image: ["/public/images/Rectangle 1.png"],
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
    image: ["/public/images/nila.png"],
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
    image: ["/public/images/mas.png"],
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
    name: "Bawal",
    image: ["/public/images/bawal.png"],
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

const fullText = "Temukan Bibit Ikan Terbaik";
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
      {/* Hero Section */}
      <section className="relative bg-[#003D47] text-white py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-12 rounded-br-[50px] md:rounded-br-[75px] lg:rounded-br-[100px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center"
        >
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 leading-tight">
              {fullText.substring(0, textIndex)}
              {showCursor && <span className="animate-blink">|</span>}
            </h1>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-4 text-base md:text-lg"
            >
              Kami menyediakan berbagai jenis bibit ikan unggulan dengan
              kualitas terjamin. Dapatkan bibit sehat, siap tebar, dan dikirim
              langsung ke lokasi Anda dengan cepat dan aman. Percayakan
              kebutuhan bibit ikan Anda kepada kami untuk hasil panen yang lebih
              optimal!
            </motion.p>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <img
              src="/public/images/Rectangle 1.png"
              alt="Bibit Ikan"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.div>
        </motion.div>
      </section>
      {/* Fish Types Section (Floating Cards) */}
      {/* Fish Types Section - 2x2 Grid */}
      {/* Fish Types Section - Responsive Layout */}
      {/*Then modify the card section in the return statement*/}
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
