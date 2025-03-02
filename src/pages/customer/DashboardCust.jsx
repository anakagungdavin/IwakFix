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

const fullText = "Temukan Bibit Ikan Terbaik siap Kirim Ke Seluruh Indonesia!";
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
      <HeaderCust />

      {/* Hero Section */}
      <section className="relative bg-[#003D47] text-white py-24 px-6 lg:px-12 rounded-br-[100px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center"
        >
          {/* Left Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold text-yellow-400 leading-tight">
              {fullText.substring(0, textIndex)}
              {showCursor && <span className="animate-blink">|</span>}
            </h1>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-4 text-lg"
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
            className="lg:w-1/2 flex justify-end mt-6 lg:mt-0"
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
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="absolute inset-x-0 -top-12 flex justify-start gap-6 z-10">
          {fishTypes.map((fish, index) => (
            <motion.div
              key={fish.id}
              onClick={() =>
                navigate(`/customer/product/${fish.id}`, { state: { fish } })
              }
              className="bg-[#80B3BB] p-4 rounded-lg shadow-lg cursor-pointer hover:border-2 hover:border-blue-500 transition-all duration-300 w-32 h-40 flex flex-col items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={fish.image}
                alt={fish.name}
                className="w-20 h-20 object-contain"
              />
              <p className="text-center font-semibold mt-2">{fish.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Recommendations */}
      <div className="mt-40 max-w-6xl mx-auto px-6 lg:px-12">
        <ProductRecommendations />
      </div>

      <CustomerReviews />

      {/* Footer */}
      <FooterCust />
    </div>
  );
};

export default DashboardCust;
