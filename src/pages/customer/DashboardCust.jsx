import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderCust from "../../components/Customer/headerCust";
import ProductRecommendations from "../../components/Customer/productRecommendation";
import FooterCust from "../../components/Customer/footerCust";
import CustomerReviews from "../../components/Customer/reviewCust";

const fishTypes = [
  { id: 1, name: "Lele", image: ["/src/images/Rectangle 1.png"] },
  { id: 2, name: "Nila", image: ["/src/images/nila.png"] },
  { id: 3, name: "Mas", image: ["/src/images/mas.png"] },
  { id: 4, name: "Bawal", image: ["/src/images/bawal.png"] },
];

const fullText =
  "Temukan Bibit Ikan Terbaik dan Siap Kirim Ke Seluruh Indonesia!";
const typingSpeed = 50; // Speed of typing effect (ms per character)

const DashboardCust = () => {
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              vel magna luctus, cursus velit a, accumsan metus. Suspendisse
              accumsan erat gravida eleifend fermentum. Integer malesuada lorem
              in enim mollis, in pretium nisi consectetur. Aenean vitae accumsan
              ligula.
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
              src="/src/images/Rectangle 1.png"
              alt="Bibit Ikan"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.div>
        </motion.div>
      </section>
      {/* Fish Types Section (Floating Cards) */}
      {/* Fish Types Section - 2x2 Grid */}
      {/* Fish Types Section - Responsive Layout */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-12 -mt-12 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-2 md:px-0">
          {fishTypes.map((fish, index) => (
            <motion.div
              key={fish.id}
              onClick={() => {
                navigate(`/product/${fish.id}`, { state: { fish } });
                window.scrollTo(0, 0);
              }}
              className="bg-[#80B3BB] p-3 md:p-4 rounded-lg shadow-lg cursor-pointer hover:border-2 hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center h-32 md:h-36 lg:h-40"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={fish.image}
                alt={fish.name}
                className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 object-contain"
              />
              <p className="text-center font-semibold mt-2 text-sm md:text-base">
                {fish.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Product Recommendations */}
      <div className="pt-16 md:pt-20 lg:pt-24 max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        <ProductRecommendations />
      </div>
      <CustomerReviews />
      {/* Footer */}
      <FooterCust />
    </div>
  );
};

export default DashboardCust;
